export interface ZhipuSearchParameters {
  content_size?: string;
  count?: number;
  request_id?: string;
  search_domain_filter?: string;
  search_engine?: string;
  search_query: string;
  search_recency_filter?: string;
  user_id?: string;
}

interface ZhipuSearchIntent {
  intent?: string;
  keywords?: string;
  query: string;
}

interface ZhipuSearchResult {
  content: string;
  icon?: string;
  link: string;
  media?: string;
  refer?: string;
  publish_date?: string;
  title: string;
}

export interface ZhipuResponse {
  created?: number;
  id?: string;
  search_intent?: ZhipuSearchIntent;
  search_result: ZhipuSearchResult[];
}
