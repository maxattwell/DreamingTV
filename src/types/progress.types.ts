export interface ProgressState {
  goalMinutes: string;
  currentMinutes: string;
  goalReached: boolean;
  loading: boolean;
  error: string | null;
}

export interface DayWatchedTimeResponse {
  dayWatchedTime: {
    goalReached: boolean;
    timeSeconds: number;
  };
}

export interface UserResponse {
  user: {
    dailyGoalSeconds: number;
  };
}

export interface ExternalTimeLogEntry {
  date: string;
  description: string;
  id: string;
  timeSeconds: number;
  type: string;
}

export interface WatchedVideo {
  title: string;
  watchedSeconds: number;
}