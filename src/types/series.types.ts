export interface DSSeries {
  _id: string;
  title: string;
  description: string;
  level: string;
  numberOfEpisodes: number;
  publishedAt: string;
}

export interface SeriesListState {
  series: DSSeries[];
  loading: boolean;
  error: string | null;
}