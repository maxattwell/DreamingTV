import React, { createContext, useContext, useState } from 'react';
import { DSVideo, VideoListState } from '../../types';
import { videoApi } from '../../services';
import { useAuth } from '../AuthContext';
import { formatVideoTitle, formatLevel } from '../../utils';

interface VideoContextType extends VideoListState {
  fetchVideos: () => Promise<void>;
  clearVideos: () => void;
  getVideoById: (videoId: string) => Promise<any>;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const VideoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  const [videoState, setVideoState] = useState<VideoListState>({
    videos: [],
    loading: false,
    error: null,
  });

  const fetchVideos = async () => {
    if (!token) {
      setVideoState(prev => ({ ...prev, error: 'No authentication token' }));
      return;
    }

    setVideoState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await videoApi.getVideos(token);
      
      const formattedVideos: DSVideo[] = (response.videos || [])
        .filter((video: any) => video.hasAccess === true || video.private === false)
        .map((video: any) => ({
          id: video._id,
          title: formatVideoTitle(video.title),
          level: video.level ? formatLevel(video.level) : undefined,
          duration: video.duration,
          videoUrl: video.sources?.mp4 || video.sources?.hls || '',
          thumbnailUrl: video.thumbnail,
          difficultyScore: video.difficultyScore,
          hasAccess: video.hasAccess,
          private: video.private,
        }));

      setVideoState({
        videos: formattedVideos,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error fetching videos:', error);
      setVideoState({
        videos: [],
        loading: false,
        error: 'Failed to fetch videos',
      });
    }
  };

  const getVideoById = async (videoId: string) => {
    if (!token) {
      throw new Error('No authentication token');
    }

    try {
      const videoData = await videoApi.getVideoById(videoId, token);
      return videoData;
    } catch (error) {
      console.error('Error fetching video details:', error);
      throw new Error('Failed to fetch video details');
    }
  };

  const clearVideos = () => {
    setVideoState({
      videos: [],
      loading: false,
      error: null,
    });
  };

  const value: VideoContextType = {
    ...videoState,
    fetchVideos,
    clearVideos,
    getVideoById,
  };

  return (
    <VideoContext.Provider value={value}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideos = (): VideoContextType => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideos must be used within a VideoProvider');
  }
  return context;
};