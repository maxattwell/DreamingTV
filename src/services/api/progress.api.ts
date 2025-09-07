import { apiClient } from './client';
import { API_ENDPOINTS } from '../../constants';
import { 
  DayWatchedTimeResponse, 
  UserResponse, 
  ExternalTimeLogEntry 
} from '../../types';
import { getCurrentDateString, getCurrentTimezone } from '../../utils';

export const progressApi = {
  async getDayWatchedTime(token: string, date?: string): Promise<DayWatchedTimeResponse> {
    const dateParam = date || getCurrentDateString();
    return apiClient.get<DayWatchedTimeResponse>(
      `${API_ENDPOINTS.DAY_WATCHED_TIME}?date=${dateParam}`,
      { Authorization: `Bearer ${token}` }
    );
  },

  async getUserData(token: string): Promise<UserResponse> {
    const timezone = getCurrentTimezone();
    return apiClient.get<UserResponse>(
      `${API_ENDPOINTS.USER}?timezone=${timezone}`,
      { Authorization: `Bearer ${token}` }
    );
  },

  async logExternalTime(entry: ExternalTimeLogEntry, token: string): Promise<void> {
    return apiClient.post(
      API_ENDPOINTS.EXTERNAL_TIME,
      entry,
      { Authorization: `Bearer ${token}` }
    );
  },
};