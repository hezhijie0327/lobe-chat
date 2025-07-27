import createDebug from 'debug';

import { CreateImagePayload, CreateImageResponse } from '../types/image';
import { AgentRuntimeError } from '../utils/createError';
import { CreateImageOptions } from '../utils/openaiCompatibleFactory';

const log = createDebug('lobe-image:minimax');

interface MiniMaxImageResponse {
  id: string;
  data: {
    image_urls: string[];
  };
  metadata: {
    failed_count: string;
    success_count: string;
  };
  base_resp: {
    status_code: number;
    status_msg: string;
  };
}

interface MiniMaxSubjectReference {
  type: 'human_face' | 'human_body' | 'object';
  image_url: string;
  weight?: number; // 权重，范围[0.1, 1.0]
}

interface MiniMaxStyle {
  style_id: string; // 画风ID
  weight?: number; // 权重，范围[0.1, 1.0]
}

/**
 * Convert standard image parameters to MiniMax format
 */
function convertImageParams(params: CreateImagePayload['params']) {
  const { width, height, n = 1, seed } = params;
  
  // Prepare the base parameters
  const miniMaxParams: any = {
    prompt: params.prompt,
    response_format: 'url',
    n: Math.min(Math.max(n, 1), 9), // MiniMax supports 1-9 images
    prompt_optimizer: true, // Enable prompt optimization by default
  };

  // Add seed if provided
  if (seed !== undefined) {
    miniMaxParams.seed = seed;
  }

  // Handle width/height vs aspect_ratio
  if (width && height) {
    // Ensure dimensions are multiples of 8 and within valid range
    const normalizeSize = (size: number) => {
      const clamped = Math.max(512, Math.min(2048, size));
      return Math.round(clamped / 8) * 8; // Round to nearest multiple of 8
    };
    
    const normalizedWidth = normalizeSize(width);
    const normalizedHeight = normalizeSize(height);
    
    // Check if total pixels exceed 2M (recommended limit)
    const totalPixels = normalizedWidth * normalizedHeight;
    if (totalPixels > 2000000) {
      log('Warning: Image resolution (%dx%d = %d pixels) exceeds recommended 2M pixel limit', 
          normalizedWidth, normalizedHeight, totalPixels);
    }
    
    miniMaxParams.width = normalizedWidth;
    miniMaxParams.height = normalizedHeight;
  } else {
    // Use aspect_ratio if width/height not specified
    let aspect_ratio = '1:1'; // default square
    if (width && height) {
      const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
      const divisor = gcd(width, height);
      aspect_ratio = `${width / divisor}:${height / divisor}`;
      
      // Map to supported aspect ratios
      const supportedRatios = ['1:1', '16:9', '4:3', '3:2', '2:3', '3:4', '9:16', '21:9'];
      if (!supportedRatios.includes(aspect_ratio)) {
        aspect_ratio = '1:1'; // fallback to square
        log('Unsupported aspect ratio %s, falling back to 1:1', aspect_ratio);
      }
    }
    miniMaxParams.aspect_ratio = aspect_ratio;
  }
  
  return miniMaxParams;
}

/**
 * Create image using MiniMax API
 */
export async function createMiniMaxImage(
  payload: CreateImagePayload,
  options: CreateImageOptions,
): Promise<CreateImageResponse> {
  const { apiKey, provider } = options;
  const { model, params } = payload;
  
  try {
    const endpoint = 'https://api.minimaxi.com/v1/image_generation';
    
    // Convert parameters to MiniMax format
    const miniMaxParams = convertImageParams(params);
    
    log('Creating image with MiniMax model: %s', model);
    log('Parameters: %O', miniMaxParams);

    const requestBody = {
      model: model || 'image-01', // Default to image-01 if no model specified
      ...miniMaxParams,
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        // Failed to parse JSON error response
      }
      
      // Check if it's a MiniMax error response format
      const errorMessage = errorData?.base_resp?.status_msg || 
                          errorData?.error?.message || 
                          errorData?.message || 
                          response.statusText;
      
      throw new Error(
        `MiniMax API error (${response.status}): ${errorMessage}`
      );
    }

    const data: MiniMaxImageResponse = await response.json();
    
    log('Image generation response: %O', data);

    // Check API response status
    if (data.base_resp.status_code !== 0) {
      throw new Error(`MiniMax API error: ${data.base_resp.status_msg}`);
    }

    // Check if we have valid image data
    if (!data.data?.image_urls || data.data.image_urls.length === 0) {
      throw new Error('No images generated in response');
    }

    // Log generation statistics
    const successCount = parseInt(data.metadata.success_count);
    const failedCount = parseInt(data.metadata.failed_count);
    log('Image generation completed: %d successful, %d failed', successCount, failedCount);

    // Return the first generated image URL
    const imageUrl = data.data.image_urls[0];
    
    if (!imageUrl) {
      throw new Error('No valid image URL in response');
    }

    log('Image generated successfully: %s', imageUrl);

    return { 
      imageUrl,
      // Include additional metadata if available
      metadata: {
        id: data.id,
        successCount,
        failedCount,
        totalImages: data.data.image_urls.length,
        allImageUrls: data.data.image_urls, // Include all generated images
      },
    };

  } catch (error) {
    log('Error in createMiniMaxImage: %O', error);

    // Handle specific error types
    let errorType: 'InvalidPayload' | 'ProviderBizError' | 'NoOpenAIAPIKey' = 'ProviderBizError';
    
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      if (errorMessage.includes('401') || errorMessage.includes('unauthorized') || 
          errorMessage.includes('invalid api key')) {
        errorType = 'NoOpenAIAPIKey';
      } else if (errorMessage.includes('400') || errorMessage.includes('invalid') ||
                errorMessage.includes('parameter')) {
        errorType = 'InvalidPayload';
      }
    }

    throw AgentRuntimeError.createImage({
      error: error as any,
      errorType,
      provider,
    });
  }
}

/**
 * Supported MiniMax image generation models and their capabilities
 */
export const MINIMAX_IMAGE_MODELS = {
  'image-01': {
    name: 'MiniMax Image-01',
    supportsDimensions: true,
    supportsSubjectReference: true,
    supportsStyle: false,
    maxImages: 9,
    supportedAspectRatios: ['1:1', '16:9', '4:3', '3:2', '2:3', '3:4', '9:16', '21:9'],
    dimensionRange: { min: 512, max: 2048, step: 8 },
    maxPixels: 2000000, // 2M pixels recommended limit
  },
  'image-01-live': {
    name: 'MiniMax Image-01-Live',
    supportsDimensions: false,
    supportsSubjectReference: false,
    supportsStyle: true,
    maxImages: 9,
    supportedAspectRatios: ['1:1', '16:9', '4:3', '3:2', '2:3', '3:4', '9:16', '21:9'],
  },
} as const;

/**
 * Validate if the model is supported by MiniMax
 */
export function isMiniMaxImageModel(model: string): boolean {
  return model in MINIMAX_IMAGE_MODELS;
}

/**
 * Get model configuration for MiniMax image model
 */
export function getMiniMaxImageModelConfig(model: string) {
  return MINIMAX_IMAGE_MODELS[model as keyof typeof MINIMAX_IMAGE_MODELS];
}

/**
 * Validate image generation parameters for MiniMax
 */
export function validateMiniMaxImageParams(model: string, params: CreateImagePayload['params']): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const config = getMiniMaxImageModelConfig(model);
  
  if (!config) {
    errors.push(`Unsupported model: ${model}`);
    return { isValid: false, errors };
  }

  // Validate prompt length
  if (!params.prompt || params.prompt.length > 1500) {
    errors.push('Prompt is required and must be <= 1500 characters');
  }

  // Validate n parameter
  if (params.n && (params.n < 1 || params.n > config.maxImages)) {
    errors.push(`Number of images must be between 1 and ${config.maxImages}`);
  }

  // Validate dimensions for image-01 model
  if (config.supportsDimensions && params.width && params.height) {
    const { min, max, step } = config.dimensionRange;
    
    if (params.width < min || params.width > max) {
      errors.push(`Width must be between ${min} and ${max} pixels`);
    }
    if (params.height < min || params.height > max) {
      errors.push(`Height must be between ${min} and ${max} pixels`);
    }
    if (params.width % step !== 0 || params.height % step !== 0) {
      errors.push(`Width and height must be multiples of ${step}`);
    }
    if (params.width * params.height > config.maxPixels) {
      errors.push(`Total resolution exceeds ${config.maxPixels} pixels limit`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
