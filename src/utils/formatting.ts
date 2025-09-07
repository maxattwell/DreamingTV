export const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

export const formatProgressPercentage = (current: number, goal: number): number => {
  return Math.min((current / goal) * 100, 100);
};

export const formatVideoTitle = (title: string): string => {
  return capitalizeFirstLetter(title.trim());
};

export const formatLevel = (level: string): string => {
  return level
    .split(' ')
    .map(word => capitalizeFirstLetter(word))
    .join(' ');
};