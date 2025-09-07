export const STORAGE_KEYS = {
  TOKEN: 'token',
  GOAL_MINUTES: 'goalMinutes',
  CURRENT_MINUTES: 'currentMinutes',
  GOAL_REACHED: 'goalReached',
  DATE_STRING: 'dateString',
} as const;

export const DEFAULT_VALUES = {
  GOAL_MINUTES: '60',
  CURRENT_MINUTES: '0',
  GOAL_REACHED: false,
} as const;