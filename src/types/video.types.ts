export interface DSVideo {
  id: string;
  title: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
  level?: string;
  difficultyScore?: number;
  hasAccess?: boolean;
  private?: boolean;
  publishedAt?: string;
  tags?: string[];
}

export interface VideoSources {
  mp4?: string;
  hls?: string;
  bunny?: string;
}

export interface VideoData {
  video: {
    _id: string;
    title: string;
    level: string;
    duration: number;
    sources: VideoSources;
    thumbnail: string;
    difficultyScore: number;
    hasAccess: boolean;
    private: boolean;
  };
}

export interface VideosResponse {
  videos: VideoData['video'][];
}

export interface VideoPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  watchedSeconds: number;
  loading: boolean;
  error: string | null;
}

export interface VideoListState {
  videos: DSVideo[];
  loading: boolean;
  error: string | null;
}