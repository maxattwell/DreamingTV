import React, { createContext, useContext, useEffect, useState } from 'react';
import { ProgressState, WatchedVideo, ExternalTimeLogEntry } from '../../types';
import { progressApi, storageService } from '../../services';
import { getCurrentDateString, generateUniqueId, secondsToMinutes } from '../../utils';
import { useAuth } from '../AuthContext';

interface ProgressContextType extends ProgressState {
  addWatchTime: (title: string, duration: number) => Promise<boolean>;
  refreshProgress: () => Promise<void>;
  resetDailyProgress: () => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const [progressState, setProgressState] = useState<ProgressState>({
    goalMinutes: '60',
    currentMinutes: '0',
    goalReached: false,
    loading: false,
    error: null,
  });

  const dateString = getCurrentDateString();

  useEffect(() => {
    if (isAuthenticated && token) {
      loadStoredProgress();
      fetchProgressData();
    }
  }, [isAuthenticated, token, dateString]);

  const loadStoredProgress = async () => {
    try {
      const storedData = await storageService.getProgressData();
      
      // Check if it's a new day
      if (storedData.dateString === dateString) {
        setProgressState(prev => ({
          ...prev,
          goalMinutes: storedData.goalMinutes,
          currentMinutes: storedData.currentMinutes,
          goalReached: storedData.goalReached,
        }));
      } else {
        // Reset for new day
        await resetDailyProgress();
      }
    } catch (error) {
      console.error('Error loading stored progress:', error);
      setProgressState(prev => ({
        ...prev,
        error: 'Failed to load progress data',
      }));
    }
  };

  const fetchProgressData = async () => {
    if (!token) return;

    setProgressState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const [dayData, userData] = await Promise.all([
        progressApi.getDayWatchedTime(token),
        progressApi.getUserData(token),
      ]);

      const currentMins = secondsToMinutes(dayData.dayWatchedTime.timeSeconds).toString();
      const goalMins = secondsToMinutes(userData.user.dailyGoalSeconds).toString();

      const newProgressData = {
        goalMinutes: goalMins,
        currentMinutes: currentMins,
        goalReached: dayData.dayWatchedTime.goalReached,
        dateString,
      };

      await storageService.setProgressData(newProgressData);

      setProgressState(prev => ({
        ...prev,
        goalMinutes: goalMins,
        currentMinutes: currentMins,
        goalReached: dayData.dayWatchedTime.goalReached,
        loading: false,
      }));
    } catch (error) {
      console.error('Error fetching progress data:', error);
      setProgressState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to fetch progress data',
      }));
    }
  };

  const addWatchTime = async (title: string, duration: number): Promise<boolean> => {
    if (!token) return false;

    const entry: ExternalTimeLogEntry = {
      date: getCurrentDateString(),
      description: `${title} -- Logged by DreamingTV`,
      id: generateUniqueId(),
      timeSeconds: duration,
      type: 'watching',
    };

    try {
      await progressApi.logExternalTime(entry, token);

      const additionalMinutes = secondsToMinutes(duration);
      const newCurrentMinutes = (Number(progressState.currentMinutes) + additionalMinutes).toString();
      const goalReached = Number(newCurrentMinutes) >= Number(progressState.goalMinutes);

      const updatedData = {
        currentMinutes: newCurrentMinutes,
        goalReached,
      };

      await storageService.setProgressData(updatedData);

      setProgressState(prev => ({
        ...prev,
        currentMinutes: newCurrentMinutes,
        goalReached,
      }));

      return true;
    } catch (error) {
      console.error('Error adding watch time:', error);
      setProgressState(prev => ({
        ...prev,
        error: 'Failed to log watch time',
      }));
      return false;
    }
  };

  const refreshProgress = async () => {
    await fetchProgressData();
  };

  const resetDailyProgress = async () => {
    const resetData = {
      currentMinutes: '0',
      goalReached: false,
      dateString,
    };

    await storageService.setProgressData(resetData);

    setProgressState(prev => ({
      ...prev,
      currentMinutes: '0',
      goalReached: false,
    }));
  };

  const value: ProgressContextType = {
    ...progressState,
    addWatchTime,
    refreshProgress,
    resetDailyProgress,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = (): ProgressContextType => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};