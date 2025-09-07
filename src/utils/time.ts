export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const formatWatchTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

export const secondsToMinutes = (seconds: number): number => {
  return Math.floor(seconds / 60);
};

export const minutesToSeconds = (minutes: number): number => {
  return minutes * 60;
};

export const getCurrentDateString = (): string => {
  return new Date().toLocaleDateString('en-CA');
};

export const getCurrentTimezone = (): number => {
  return -new Date().getTimezoneOffset() / 60;
};

export const generateUniqueId = (): string => {
  const timestamp = Date.now();
  const randomComponent = Math.random();
  return `${timestamp}${randomComponent}`;
};