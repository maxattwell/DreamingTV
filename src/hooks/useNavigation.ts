import { useState } from 'react';
import { ViewType, DSVideo } from '../types';
import { VIEWS } from '../constants';

export const useNavigation = () => {
  const [currentView, setCurrentView] = useState<ViewType>(VIEWS.PROGRESS);
  const [selectedVideo, setSelectedVideo] = useState<DSVideo | null>(null);

  const navigateTo = (view: ViewType, video?: DSVideo) => {
    setCurrentView(view);
    if (video) {
      setSelectedVideo(video);
    } else {
      setSelectedVideo(null);
    }
  };

  const goToDashboard = () => {
    setCurrentView(VIEWS.DASHBOARD);
    setSelectedVideo(null);
  };

  const goToVideos = () => {
    setCurrentView(VIEWS.VIDEOS);
    setSelectedVideo(null);
  };

  const goToProgress = () => {
    setCurrentView(VIEWS.PROGRESS);
    setSelectedVideo(null);
  };

  const goToPlayer = (video: DSVideo) => {
    setCurrentView(VIEWS.PLAYER);
    setSelectedVideo(video);
  };

  const goBack = () => {
    if (currentView === VIEWS.PLAYER) {
      setCurrentView(VIEWS.VIDEOS);
      setSelectedVideo(null);
    } else if (currentView === VIEWS.VIDEOS) {
      setCurrentView(VIEWS.PROGRESS);
    }
  };

  return {
    currentView,
    selectedVideo,
    navigateTo,
    goToDashboard,
    goToVideos,
    goToProgress,
    goToPlayer,
    goBack,
  };
};