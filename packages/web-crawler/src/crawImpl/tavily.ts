import { CrawlImpl, CrawlSuccessResult } from '../type';
import { NetworkConnectionError, PageNotFoundError, TimeoutError } from '../utils/errorType';
import { DEFAULT_TIMEOUT, withTimeout } from '../utils/withTimeout';

interface TavilyResults {
  raw_content: string;
  url: string;
}

interface TavilyResponse {
  base_url: string;
  response_time: number;
  results: TavilyResults[];
}

export const tavily: CrawlImpl = async (url) => {
  // Get API key from environment variable
  const apiKey = process.env.TAVILY_API_KEY;

  let res: Response;

  try {
    res = await withTimeout(
      fetch('https://api.tavily.com/crawl', {
        body: JSON.stringify({
          extract_depth: process.env.TAVILY_EXTRACT_DEPTH || 'basic', // basic or advanced
          limit: 1,
          max_breadth: 1,
          max_depth: 1,
          url,
        }),
        headers: {
          'Authorization': !apiKey ? '' : `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
      }),
      DEFAULT_TIMEOUT,
    );
  } catch (e) {
    const error = e as Error;
    if (error.message === 'fetch failed') {
      throw new NetworkConnectionError();
    }

    if (error instanceof TimeoutError) {
      throw error;
    }

    throw e;
  }

  if (!res.ok) {
    if (res.status === 404) {
      throw new PageNotFoundError(res.statusText);
    }

    throw new Error(`Tavily request failed with status ${res.status}: ${res.statusText}`);
  }

  try {
    const data = (await res.json()) as TavilyResponse;

    // Check if content is empty or too short
    if (!data.results[0].content || data.results[0].content.length < 100) {
      return;
    }

    return {
      content: data.results[0].raw_content,
      contentType: 'text',
      length: data.results[0].raw_content.length,
      siteName: new URL(url).hostname,
      title: new URL(url).hostname,
      url: data.results[0].url || url,
    } satisfies CrawlSuccessResult;
  } catch (error) {
    console.error(error);
  }

  return;
};
