import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, DEFAULT_VALUES } from '../../constants';
import { DSVideo } from '../../types';
import { DSSeries } from '../../types/series.types';

export const storageService = {
  // Token management
  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  async setToken(token: string | null): Promise<void> {
    if (token) {
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
    } else {
      await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
    }
  },

  async removeToken(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
  },

  // Progress management
  async getGoalMinutes(): Promise<string> {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.GOAL_MINUTES);
    return value || DEFAULT_VALUES.GOAL_MINUTES;
  },

  async setGoalMinutes(minutes: string): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.GOAL_MINUTES, minutes);
  },

  async getCurrentMinutes(): Promise<string> {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_MINUTES);
    return value || DEFAULT_VALUES.CURRENT_MINUTES;
  },

  async setCurrentMinutes(minutes: string): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_MINUTES, minutes);
  },

  async getGoalReached(): Promise<boolean> {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.GOAL_REACHED);
    return value === 'true';
  },

  async setGoalReached(reached: boolean): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.GOAL_REACHED, reached.toString());
  },

  async getDateString(): Promise<string | null> {
    return await AsyncStorage.getItem(STORAGE_KEYS.DATE_STRING);
  },

  async setDateString(date: string): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.DATE_STRING, date);
  },

  // Bulk operations for progress data
  async getProgressData() {
    const [goalMinutes, currentMinutes, goalReached, dateString] = await Promise.all([
      this.getGoalMinutes(),
      this.getCurrentMinutes(),
      this.getGoalReached(),
      this.getDateString(),
    ]);

    return {
      goalMinutes,
      currentMinutes,
      goalReached,
      dateString,
    };
  },

  async setProgressData(data: {
    goalMinutes?: string;
    currentMinutes?: string;
    goalReached?: boolean;
    dateString?: string;
  }): Promise<void> {
    const promises: Promise<void>[] = [];

    if (data.goalMinutes !== undefined) {
      promises.push(this.setGoalMinutes(data.goalMinutes));
    }
    if (data.currentMinutes !== undefined) {
      promises.push(this.setCurrentMinutes(data.currentMinutes));
    }
    if (data.goalReached !== undefined) {
      promises.push(this.setGoalReached(data.goalReached));
    }
    if (data.dateString !== undefined) {
      promises.push(this.setDateString(data.dateString));
    }

    await Promise.all(promises);
  },

  // Videos data management
  async getVideosData(): Promise<DSVideo[] | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.VIDEOS_DATA);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error parsing videos data from storage:', error);
      return null;
    }
  },

  async setVideosData(videos: DSVideo[]): Promise<void> {
    const timestamp = Date.now().toString();
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.VIDEOS_DATA, JSON.stringify(videos)),
      AsyncStorage.setItem(STORAGE_KEYS.VIDEOS_TIMESTAMP, timestamp),
    ]);
  },

  async getVideosTimestamp(): Promise<number | null> {
    const timestamp = await AsyncStorage.getItem(STORAGE_KEYS.VIDEOS_TIMESTAMP);
    return timestamp ? parseInt(timestamp, 10) : null;
  },

  // Series data management
  async getSeriesData(): Promise<DSSeries[] | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SERIES_DATA);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error parsing series data from storage:', error);
      return null;
    }
  },

  async setSeriesData(series: DSSeries[]): Promise<void> {
    const timestamp = Date.now().toString();
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.SERIES_DATA, JSON.stringify(series)),
      AsyncStorage.setItem(STORAGE_KEYS.SERIES_TIMESTAMP, timestamp),
    ]);
  },

  async getSeriesTimestamp(): Promise<number | null> {
    const timestamp = await AsyncStorage.getItem(STORAGE_KEYS.SERIES_TIMESTAMP);
    return timestamp ? parseInt(timestamp, 10) : null;
  },

  // Check if cached data is fresh (less than 1 hour old)
  isCacheExpired(timestamp: number | null, maxAgeMs: number = 3600000): boolean {
    if (!timestamp) return true;
    return Date.now() - timestamp > maxAgeMs;
  },

  // Clear all app data
  async clearAll(): Promise<void> {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.TOKEN,
      STORAGE_KEYS.GOAL_MINUTES,
      STORAGE_KEYS.CURRENT_MINUTES,
      STORAGE_KEYS.GOAL_REACHED,
      STORAGE_KEYS.DATE_STRING,
      STORAGE_KEYS.VIDEOS_DATA,
      STORAGE_KEYS.VIDEOS_TIMESTAMP,
      STORAGE_KEYS.SERIES_DATA,
      STORAGE_KEYS.SERIES_TIMESTAMP,
    ]);
  },

  // Clear only video and series cached data
  async clearCachedData(): Promise<void> {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.VIDEOS_DATA,
      STORAGE_KEYS.VIDEOS_TIMESTAMP,
      STORAGE_KEYS.SERIES_DATA,
      STORAGE_KEYS.SERIES_TIMESTAMP,
    ]);
  },
};