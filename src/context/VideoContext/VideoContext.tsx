import React, { createContext, useContext, useState, useEffect } from 'react';
import { DSVideo, VideoListState } from '../../types';
import { videoApi, storageService } from '../../services';
import { useAuth } from '../AuthContext';
import { formatVideoTitle } from '../../utils';

interface FilterOptions {
  sort: string;
  level: string[];
}

interface VideoContextType extends VideoListState {
  allVideos: DSVideo[];
  filters: FilterOptions;
  fetchVideos: (forceRefresh?: boolean) => Promise<void>;
  applyFilters: (filters: FilterOptions) => void;
  clearVideos: () => void;
  getVideoById: (videoId: string) => Promise<any>;
  refreshData: () => Promise<void>;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const VideoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  const [allVideos, setAllVideos] = useState<DSVideo[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    sort: 'none',
    level: []
  });
  const [videoState, setVideoState] = useState<VideoListState>({
    videos: [],
    loading: false,
    error: null,
  });

  // Load videos from storage on initialization
  useEffect(() => {
    if (token && allVideos.length === 0) {
      loadVideosFromStorage();
    }
  }, [token]);

  const loadVideosFromStorage = async () => {
    try {
      const cachedVideos = await storageService.getVideosData();
      const timestamp = await storageService.getVideosTimestamp();
      
      if (cachedVideos && !storageService.isCacheExpired(timestamp)) {
        console.log('📦 Loading videos from cache');
        setAllVideos(cachedVideos);
        const filteredAndSorted = applySortingAndFiltering(cachedVideos, filters);
        setVideoState({
          videos: filteredAndSorted,
          loading: false,
          error: null,
        });
        return;
      }
    } catch (error) {
      console.error('Error loading cached videos:', error);
    }

    // If no valid cache, fetch from API
    await fetchVideos(true);
  };

  const fetchVideos = async (forceRefresh: boolean = false) => {
    if (!token) {
      setVideoState(prev => ({ ...prev, error: 'No authentication token' }));
      return;
    }

    // Don't refetch if we already have videos unless forcing refresh
    if (allVideos.length > 0 && !forceRefresh) {
      return;
    }

    setVideoState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await videoApi.getVideos(token);
      
      console.log('📡 Raw API Response Sample:');
      console.log('First 3 videos:', response.videos?.slice(0, 3).map(v => ({ _id: v._id, level: v.level, title: v.title, seriesId: v.seriesId })));
      console.log('Videos with seriesId in raw data:', response.videos?.filter(v => v.seriesId).length);
      
      // Debug the filtering
      const allRawVideos = response.videos || [];
      console.log('🎯 Video Access Debug:');
      console.log('Total raw videos:', allRawVideos.length);
      
      // Check specific series videos
      const seriesVideos = allRawVideos.filter(v => v.seriesId === '6409a9e5112debe7aa739d59');
      console.log(`Videos for series 6409a9e5112debe7aa739d59:`, seriesVideos.length);
      if (seriesVideos.length > 0) {
        console.log('Sample series video access:', seriesVideos[0] ? {
          _id: seriesVideos[0]._id,
          title: seriesVideos[0].title,
          hasAccess: seriesVideos[0].hasAccess,
          private: seriesVideos[0].private
        } : 'none');
      }
      
      const beforeFilter = allRawVideos.length;
      // More inclusive filtering - include series videos even if access is restricted
      const filteredRaw = allRawVideos.filter((video: any) => 
        video.hasAccess === true || 
        video.private === false || 
        video.seriesId // Include all videos that belong to a series
      );
      console.log(`Access filtering: ${beforeFilter} -> ${filteredRaw.length} videos`);
      
      const formattedVideos: DSVideo[] = filteredRaw
        .map((video: any) => ({
          id: video._id,
          title: formatVideoTitle(video.title),
          level: video.level,
          duration: video.duration,
          videoUrl: video.sources?.mp4 || video.sources?.hls || '',
          thumbnailUrl: video.thumbnail,
          difficultyScore: video.difficultyScore,
          hasAccess: video.hasAccess,
          private: video.private,
          publishedAt: video.publishedAt,
          tags: video.tags || [],
          seriesId: video.seriesId,
        }));

      // Store in cache
      await storageService.setVideosData(formattedVideos);
      
      setAllVideos(formattedVideos);
      
      // Apply current filters to the newly loaded data
      const filteredAndSorted = applySortingAndFiltering(formattedVideos, filters);
      
      setVideoState({
        videos: filteredAndSorted,
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

  const applySortingAndFiltering = (videos: DSVideo[], filterOptions: FilterOptions): DSVideo[] => {
    let filtered = [...videos];
    
    console.log('🔍 Filtering Debug:');
    console.log('Total videos:', videos.length);
    console.log('Filter options:', filterOptions);
    console.log('Sample video levels:', videos.slice(0, 5).map(v => ({ id: v.id, level: v.level })));
    
    // Apply level filtering
    if (filterOptions.level.length > 0) {
      const beforeFilter = filtered.length;
      filtered = filtered.filter(video => 
        video.level && filterOptions.level.includes(video.level.toLowerCase())
      );
      console.log(`Level filtering: ${beforeFilter} -> ${filtered.length} videos`);
      console.log('Selected levels:', filterOptions.level);
      console.log('Unique levels in data:', [...new Set(videos.map(v => v.level))]);
    }
    
    // Apply sorting
    switch (filterOptions.sort) {
      case 'random':
        for (let i = filtered.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
        }
        break;
      case 'new':
        filtered.sort((a, b) => new Date(b.publishedAt || '').getTime() - new Date(a.publishedAt || '').getTime());
        break;
      case 'old':
        filtered.sort((a, b) => new Date(a.publishedAt || '').getTime() - new Date(b.publishedAt || '').getTime());
        break;
      case 'easy':
        filtered.sort((a, b) => (a.difficultyScore || 0) - (b.difficultyScore || 0));
        break;
      case 'hard':
        filtered.sort((a, b) => (b.difficultyScore || 0) - (a.difficultyScore || 0));
        break;
      case 'long':
        filtered.sort((a, b) => (b.duration || 0) - (a.duration || 0));
        break;
      case 'short':
        filtered.sort((a, b) => (a.duration || 0) - (b.duration || 0));
        break;
      case 'none':
      default:
        // No sorting
        break;
    }
    
    return filtered;
  };

  const applyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    const filteredAndSorted = applySortingAndFiltering(allVideos, newFilters);
    
    setVideoState(prev => ({
      ...prev,
      videos: filteredAndSorted,
    }));
  };

  const clearVideos = () => {
    setAllVideos([]);
    setVideoState({
      videos: [],
      loading: false,
      error: null,
    });
  };

  const refreshData = async () => {
    console.log('🔄 Refreshing videos data');
    await fetchVideos(true);
  };

  const value: VideoContextType = {
    ...videoState,
    allVideos,
    filters,
    fetchVideos,
    applyFilters,
    clearVideos,
    getVideoById,
    refreshData,
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