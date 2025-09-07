import React, { createContext, useContext, useState, useCallback } from 'react';
import { DSSeries, SeriesListState } from '../../types/series.types';
import { seriesApi } from '../../services/api/series.api';
import { useAuth } from '../AuthContext';

interface SeriesContextType extends SeriesListState {
  fetchSeries: () => Promise<void>;
  clearSeries: () => void;
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

  const fetchSeries = useCallback(async () => {
    if (!token) {
      setSeriesState(prev => ({ ...prev, error: 'No authentication token' }));
      return;
    }

    // Don't refetch if we already have data
    if (hasFetched && seriesState.series.length > 0) {
      return;
    }

    setSeriesState(prev => ({ ...prev, loading: true, error: null }));
    setHasFetched(true);

    try {
      const response = await seriesApi.getSeries(token);

      setSeriesState({
        series: response.series || [],
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
  }, [token, hasFetched]);

  const clearSeries = () => {
    setSeriesState({
      series: [],
      loading: false,
      error: null,
    });
    setHasFetched(false);
  };

  const value: SeriesContextType = {
    ...seriesState,
    fetchSeries,
    clearSeries,
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
