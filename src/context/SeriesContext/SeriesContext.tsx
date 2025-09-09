import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { DSSeries, SeriesListState } from '../../types/series.types';
import { seriesApi } from '../../services/api/series.api';
import { storageService } from '../../services';
import { useAuth } from '../AuthContext';

interface SeriesContextType extends SeriesListState {
  fetchSeries: (forceRefresh?: boolean) => Promise<void>;
  clearSeries: () => void;
  refreshData: () => Promise<void>;
}

const SeriesContext = createContext<SeriesContextType | undefined>(undefined);

export const SeriesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  const [seriesState, setSeriesState] = useState<SeriesListState>({
    series: [],
    loading: false,
    error: null,
  });
  const [hasFetched, setHasFetched] = useState(false);

  // Load series from storage on initialization
  useEffect(() => {
    if (token && seriesState.series.length === 0 && !hasFetched) {
      loadSeriesFromStorage();
    }
  }, [token]);

  const loadSeriesFromStorage = async () => {
    try {
      const cachedSeries = await storageService.getSeriesData();
      const timestamp = await storageService.getSeriesTimestamp();
      
      if (cachedSeries && !storageService.isCacheExpired(timestamp)) {
        console.log('📦 Loading series from cache');
        setSeriesState({
          series: cachedSeries,
          loading: false,
          error: null,
        });
        setHasFetched(true);
        return;
      }
    } catch (error) {
      console.error('Error loading cached series:', error);
    }

    // If no valid cache, fetch from API
    await fetchSeries(true);
  };

  const fetchSeries = useCallback(async (forceRefresh: boolean = false) => {
    if (!token) {
      setSeriesState(prev => ({ ...prev, error: 'No authentication token' }));
      return;
    }

    // Don't refetch if we already have data unless forcing refresh
    if (hasFetched && seriesState.series.length > 0 && !forceRefresh) {
      return;
    }

    setSeriesState(prev => ({ ...prev, loading: true, error: null }));
    setHasFetched(true);

    try {
      const response = await seriesApi.getSeries(token);
      const series = response.series || [];

      // Store in cache
      await storageService.setSeriesData(series);

      setSeriesState({
        series,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error fetching series:', error);
      setSeriesState({
        series: [],
        loading: false,
        error: 'Failed to fetch series',
      });
    }
  }, [token, hasFetched, seriesState.series.length]);

  const clearSeries = () => {
    setSeriesState({
      series: [],
      loading: false,
      error: null,
    });
    setHasFetched(false);
  };

  const refreshData = async () => {
    console.log('🔄 Refreshing series data');
    await fetchSeries(true);
  };

  const value: SeriesContextType = {
    ...seriesState,
    fetchSeries,
    clearSeries,
    refreshData,
  };

  return (
    <SeriesContext.Provider value={value}>
      {children}
    </SeriesContext.Provider>
  );
};

export const useSeries = (): SeriesContextType => {
  const context = useContext(SeriesContext);
  if (!context) {
    throw new Error('useSeries must be used within a SeriesProvider');
  }
  return context;
};
