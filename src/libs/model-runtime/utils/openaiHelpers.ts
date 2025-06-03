import OpenAI from 'openai';

import { disableStreamModels, systemToUserModels } from '@/const/models';
import { ChatStreamPayload, OpenAIChatMessage } from '@/libs/model-runtime';
import { imageUrlToBase64 } from '@/utils/imageToBase64';

import { parseDataUri } from './uriParser';

// 预留值解析函数
const parseTemplateVariables = (text: string): string => {
  const now = new Date();
  
  const variables: Record<string, string> = {
    date: now.toLocaleDateString(),
    time: now.toLocaleTimeString(),
    datetime: now.toLocaleString(),
    timestamp: now.getTime().toString(),
    iso: now.toISOString(),
    year: now.getFullYear().toString(),
    month: (now.getMonth() + 1).toString().padStart(2, '0'),
    day: now.getDate().toString().padStart(2, '0'),
    hour: now.getHours().toString().padStart(2, '0'),
    minute: now.getMinutes().toString().padStart(2, '0'),
    second: now.getSeconds().toString().padStart(2, '0'),
    weekday: now.toLocaleDateString('en-US', { weekday: 'long' }),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };

  return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return variables[key] || match;
  });
};

export const convertMessageContent = async (
  content: OpenAI.ChatCompletionContentPart,
): Promise<OpenAI.ChatCompletionContentPart> => {
  // 处理图片URL转换
  if (content.type === 'image_url') {
    const { type } = parseDataUri(content.image_url.url);
    if (type === 'url' && process.env.LLM_VISION_IMAGE_USE_BASE64 === '1') {
      const { base64, mimeType } = await imageUrlToBase64(content.image_url.url);
      return {
        ...content,
        image_url: { ...content.image_url, url: `data:${mimeType};base64,${base64}` },
      };
    }
  }
  
  // 处理文本内容中的预留值
  if (content.type === 'text' && typeof content.text === 'string') {
    return {
      ...content,
      text: parseTemplateVariables(content.text),
    };
  }

  return content;
};

export const convertOpenAIMessages = async (messages: OpenAI.ChatCompletionMessageParam[]) => {
  return (await Promise.all(
    messages.map(async (message) => ({
      ...message,
      content:
        typeof message.content === 'string'
          ? parseTemplateVariables(message.content) // 处理字符串类型的content
          : await Promise.all(
              (message.content || []).map((c) =>
                convertMessageContent(c as OpenAI.ChatCompletionContentPart),
              ),
            ),
    })),
  )) as OpenAI.ChatCompletionMessageParam[];
};

export const pruneReasoningPayload = (payload: ChatStreamPayload) => {
  return {
    ...payload,
    frequency_penalty: 0,
    messages: payload.messages.map((message: OpenAIChatMessage) => ({
      ...message,
      role:
        message.role === 'system'
          ? systemToUserModels.has(payload.model)
            ? 'user'
            : 'developer'
          : message.role,
    })),
    presence_penalty: 0,
    stream: !disableStreamModels.has(payload.model),
    temperature: 1,
    top_p: 1,
  };
};
