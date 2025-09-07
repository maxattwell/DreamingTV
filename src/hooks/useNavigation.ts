import { useState } from 'react';
import { ViewType, DSVideo } from '../types';
import { VIEWS } from '../constants';

export const useNavigation = () => {
  const [currentView, setCurrentView] = useState<ViewType>(VIEWS.DASHBOARD);
  const [selectedVideo, setSelectedVideo] = useState<DSVideo | null>(null);

  const navigateTo = (view: ViewType, video?: DSVideo) => {
    setCurrentView(view);
    if (video) {
      setSelectedVideo(video);
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

  const goToPlayer = (video: DSVideo) => {
    setCurrentView(VIEWS.PLAYER);
    setSelectedVideo(video);
  };

  const goBack = () => {
    if (currentView === VIEWS.PLAYER) {
      setCurrentView(VIEWS.VIDEOS);
      setSelectedVideo(null);
    } else if (currentView === VIEWS.VIDEOS) {
      setCurrentView(VIEWS.DASHBOARD);
    }
  };

  return {
    currentView,
    selectedVideo,
    navigateTo,
    goToDashboard,
    goToVideos,
    goToPlayer,
    goBack,
  };
};