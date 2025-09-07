import { apiClient } from './client';
import { API_ENDPOINTS } from '../../constants';
import { VideosResponse, VideoData } from '../../types';

export const videoApi = {
  async getVideos(token: string): Promise<VideosResponse> {
    return apiClient.get<VideosResponse>(
      API_ENDPOINTS.VIDEOS,
      { Authorization: `Bearer ${token}` }
    );
  },

  async getVideoById(videoId: string, token: string): Promise<VideoData> {
    return apiClient.get<VideoData>(
      `${API_ENDPOINTS.VIDEO}?id=${videoId}`,
      { Authorization: `Bearer ${token}` }
    );
  },
};