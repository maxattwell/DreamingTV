import { useState, useEffect, useRef } from 'react';
import { useVideoPlayer as useExpoVideoPlayer } from 'expo-video';
import { VideoPlayerState } from '../types';
import { useVideos, useProgress } from '../context';
import { APP_CONFIG } from '../constants';
import { getErrorMessage } from '../utils';

export const useVideoPlayer = (videoId: string) => {
  const { getVideoById } = useVideos();
  const { addWatchTime } = useProgress();
  
  const [playerState, setPlayerState] = useState<VideoPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    watchedSeconds: 0,
    loading: true,
    error: null,
  });
  
  const [videoData, setVideoData] = useState<any>(null);
  
  // Construct the video URL
  const bunnyVideoUrl = videoData?.video?.sources?.bunny || null;
  const m3u8Url = bunnyVideoUrl ? `${bunnyVideoUrl}/playlist.m3u8` : null;
  const title = videoData?.video?.title || '';

  const player = useExpoVideoPlayer(m3u8Url || '', player => {
    player.loop = false;
    player.addListener('playbackStatusUpdate', (status) => {
      setPlayerState(prev => ({
        ...prev,
        isPlaying: status.isLoaded ? player.playing : false,
        currentTime: status.positionMillis ? status.positionMillis / 1000 : 0,
        duration: status.durationMillis ? status.durationMillis / 1000 : 0,
      }));
    });
  });

  useEffect(() => {
    fetchVideoDetails();
  }, [videoId]);

  // Track watched time
  useEffect(() => {
    const interval = setInterval(() => {
      if (player.currentTime) {
        const currentSeconds = Math.floor(player.currentTime);
        if (currentSeconds > playerState.watchedSeconds) {
          setPlayerState(prev => ({
            ...prev,
            watchedSeconds: currentSeconds,
          }));
        }
      }
    }, APP_CONFIG.PROGRESS_UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, [player, playerState.watchedSeconds]);

  const fetchVideoDetails = async () => {
    setPlayerState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await getVideoById(videoId);
      setVideoData(data);
      setPlayerState(prev => ({ ...prev, loading: false }));
    } catch (err) {
      setPlayerState(prev => ({
        ...prev,
        loading: false,
        error: getErrorMessage(err),
      }));
    }
  };

  const togglePlayback = () => {
    if (player.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  const logWatchTime = async (): Promise<boolean> => {
    if (playerState.watchedSeconds > APP_CONFIG.MIN_WATCH_TIME_FOR_LOGGING) {
      return await addWatchTime(title, playerState.watchedSeconds);
    }
    return false;
  };

  return {
    ...playerState,
    videoData,
    title,
    m3u8Url,
    player,
    togglePlayback,
    logWatchTime,
    fetchVideoDetails,
  };
};