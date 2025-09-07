export const APP_CONFIG = {
  MIN_WATCH_TIME_FOR_LOGGING: 30, // seconds
  PROGRESS_UPDATE_INTERVAL: 1000, // milliseconds
  DEFAULT_DAILY_GOAL: 60, // minutes
} as const;

export const VIEWS = {
  DASHBOARD: 'dashboard',
  VIDEOS: 'videos', 
  SERIES: 'series',
  SERIES_DETAIL: 'series-detail',
  PLAYER: 'player',
  PROGRESS: 'progress',
} as const;

export const VIDEO_LEVELS = {
  ABSOLUTE_BEGINNER: 'absolute beginner',
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
} as const;