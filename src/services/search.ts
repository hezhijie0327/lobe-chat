import { toolsClient } from '@/libs/trpc/client';
import { SearchQuery } from '@/types/tool/search';

class SearchService {
  search(parmas: SearchQuery) {
    return toolsClient.search.query.query(parmas);
  }

  crawlPage(url: string) {
    return toolsClient.search.crawlPages.mutate({ urls: [url] });
  }

  crawlPages(urls: string[]) {
    return toolsClient.search.crawlPages.mutate({ urls });
  }
}

export const searchService = new SearchService();
