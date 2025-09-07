import { apiClient } from './client';
import { DSSeries } from '../../types/series.types';
import { API_ENDPOINTS } from '../../constants';

interface SeriesResponse {
  series: DSSeries[];
}

export const seriesApi = {
  async getSeries(token: string): Promise<SeriesResponse> {
    return apiClient.get<SeriesResponse>(
      API_ENDPOINTS.SERIES,
      { Authorization: `Bearer ${token}` }
    );
  },
};
