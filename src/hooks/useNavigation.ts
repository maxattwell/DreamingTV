import { useState } from 'react';
import { ViewType, DSVideo, DSSeries } from '../types';
import { VIEWS } from '../constants';

export const useNavigation = () => {
  const [currentView, setCurrentView] = useState<ViewType>(VIEWS.PROGRESS);
  const [selectedVideo, setSelectedVideo] = useState<DSVideo | null>(null);
  const [selectedSeries, setSelectedSeries] = useState<DSSeries | null>(null);

  const navigateTo = (view: ViewType, video?: DSVideo) => {
    setCurrentView(view);
    if (video) {
      setSelectedVideo(video);
    } else if (view !== VIEWS.SERIES_DETAIL) {
      setSelectedVideo(null);
    }
    if (view !== VIEWS.SERIES_DETAIL) {
      setSelectedSeries(null);
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
    setSelectedSeries(null);
  };

  const goToSeries = () => {
    setCurrentView(VIEWS.SERIES);
    setSelectedVideo(null);
    setSelectedSeries(null);
  };

  const goToSeriesDetail = (series: DSSeries) => {
    setCurrentView(VIEWS.SERIES_DETAIL);
    setSelectedSeries(series);
    setSelectedVideo(null);
  };

  const goToPlayer = (video: DSVideo) => {
    setCurrentView(VIEWS.PLAYER);
    setSelectedVideo(video);
  };

  const goBack = () => {
    if (currentView === VIEWS.PLAYER) {
      if (selectedSeries) {
        setCurrentView(VIEWS.SERIES_DETAIL);
        setSelectedVideo(null);
      } else {
        setCurrentView(VIEWS.VIDEOS);
        setSelectedVideo(null);
      }
    } else if (currentView === VIEWS.VIDEOS) {
      setCurrentView(VIEWS.PROGRESS);
    } else if (currentView === VIEWS.SERIES_DETAIL) {
      setCurrentView(VIEWS.SERIES);
      setSelectedSeries(null);
    } else if (currentView === VIEWS.SERIES) {
      setCurrentView(VIEWS.PROGRESS);
    }
  };

  return {
    currentView,
    selectedVideo,
    selectedSeries,
    navigateTo,
    goToDashboard,
    goToVideos,
    goToSeries,
    goToSeriesDetail,
    goToProgress,
    goToPlayer,
    goBack,
  };
};