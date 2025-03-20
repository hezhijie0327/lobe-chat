import qs from 'query-string';
import urlJoin from 'url-join';

import { SearchResponse } from '@/types/tool/search';

export class SearXNGClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async search(query: string, optionalParams: Record<string, any> = {}): Promise<SearchResponse> {
    try {
      const formatParams = Object.entries(optionalParams).reduce<Record<string, any>>((acc, [key, value]) => {
        acc[key] = Array.isArray(value) ? value.join(',') : value;
        return acc;
      }, {});

      const searchParams = qs.stringify({
        ...formatParams,
        format: 'json',
        q: query,
      });

      const response = await fetch(urlJoin(this.baseUrl, `/search?${searchParams}`));

      if (response.ok) {
        return await response.json();
      }

      throw new Error(`Failed to search: ${response.statusText}`);
    } catch (error) {
      console.error('Error searching:', error);
      throw error;
    }
  }
}
