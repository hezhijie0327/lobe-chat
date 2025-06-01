import { TRPCError } from '@trpc/server';
import debug from 'debug';
import urlJoin from 'url-join';

import { SearchParams, UniformSearchResponse, UniformSearchResult } from '@/types/tool/search';

import { SearchServiceImpl } from '../type';
import { ZhipuSearchParameters, ZhipuResponse } from './type';

const log = debug('lobe-search:Zhipu');

const timeRangeMapping = {
  day: 'oneDay',
  month: 'oneMonth',
  week: 'oneWeek',
  year: 'oneYear',
};

/**
 * Zhipu implementation of the search service
 * Primarily used for web crawling
 */
export class ZhipuImpl implements SearchServiceImpl {
  private get apiKey(): string | undefined {
    return process.env.ZHIPU_SEARCH_API_KEY || process.env.ZHIPU_API_KEY;
  }

  private get baseUrl(): string {
    // Assuming the base URL is consistent with the crawl endpoint
    return 'https://open.bigmodel.cn/api/paas/v4';
  }

  async query(query: string, params: SearchParams = {}): Promise<UniformSearchResponse> {
    log('Starting Zhipu query with query: "%s", params: %o', query, params);
    const endpoint = urlJoin(this.baseUrl, '/web_search');

    const defaultQueryParams: ZhipuSearchParameters = {
      //content_size: process.env.ZHIPU_CONTENT_SIZE || 'medium', // low, medium, high
      count: 15,
      search_engine: process.env.ZHIPU_SEARCH_ENGINE || 'search_std', // search_std or search_pro
      search_query: query,
    };

    let body: ZhipuSearchParameters = {
      ...defaultQueryParams,
      search_recency_filter:
        params?.searchTimeRange && params.searchTimeRange !== 'anytime'
          ? timeRangeMapping[params.searchTimeRange as keyof typeof timeRangeMapping] ?? undefined
          : undefined,
    };

    log('Constructed request body: %o', body);

    let response: Response;
    const startAt = Date.now();
    let costTime = 0;
    try {
      log('Sending request to endpoint: %s', endpoint);
      response = await fetch(endpoint, {
        body: JSON.stringify(body),
        headers: {
          'Authorization': this.apiKey ? `Bearer ${this.apiKey}` : '',
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });
      log('Received response with status: %d', response.status);
      costTime = Date.now() - startAt;
    } catch (error) {
      log.extend('error')('Zhipu fetch error: %o', error);
      throw new TRPCError({
        cause: error,
        code: 'SERVICE_UNAVAILABLE',
        message: 'Failed to connect to Zhipu.',
      });
    }

    if (!response.ok) {
      const errorBody = await response.text();
      log.extend('error')(
        `Zhipu request failed with status ${response.status}: %s`,
        errorBody.length > 200 ? `${errorBody.slice(0, 200)}...` : errorBody,
      );
      throw new TRPCError({
        cause: errorBody,
        code: 'SERVICE_UNAVAILABLE',
        message: `Zhipu request failed: ${response.statusText}`,
      });
    }

    try {
      const ZhipuResponse = (await response.json()) as ZhipuResponse;

      log('Parsed Zhipu response: %o', ZhipuResponse);

      const mappedResults = (ZhipuResponse.search_result || []).map(
        (result): UniformSearchResult => ({
          category: 'general', // Default category
          content: result.content || '', // Prioritize content, fallback to snippet
          engines: ['zhipu'], // Use 'zhipu' as the engine name
          parsedUrl: result.link ? new URL(result.link).hostname : '', // Basic URL parsing
          score: 1, // Default score to 1
          title: result.title || '',
          url: result.link,
        }),
      );

      log('Mapped %d results to SearchResult format', mappedResults.length);

      return {
        costTime,
        query: query,
        resultNumbers: mappedResults.length,
        results: mappedResults,
      };
    } catch (error) {
      log.extend('error')('Error parsing Zhipu response: %o', error);
      throw new TRPCError({
        cause: error,
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to parse Zhipu response.',
      });
    }
  }
}
