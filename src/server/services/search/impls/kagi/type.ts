export interface KagiSearchParameters {
  limit?: number;
  q: string;
}

interface KagiThumbnail {
  height?: number | null;
  url: string;
  width?: number | null;
}

interface KagiData {
  list?: string[];
  published?: number;
  snippet?: string;
  t: number;
  thumbnail?: KagiThumbnail;
  title?: string;
  url?: string;
}

export interface KagiResponse {
  meta?: any;
  data: KagiData[];
}
