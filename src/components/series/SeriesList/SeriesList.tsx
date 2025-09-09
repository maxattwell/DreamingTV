import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { useSeries } from '../../../context/SeriesContext';
import { DSSeries } from '../../../types/series.types';
import { colors, typography, spacing } from '../../../styles';
import Button from '../../common/Button';

interface SeriesListProps {
  onSelectSeries: (series: DSSeries) => void;
  onBack: () => void;
}

const SeriesList: React.FC<SeriesListProps> = ({ onSelectSeries, onBack }) => {
  const { series, loading, error, fetchSeries } = useSeries();
  const [displayedSeriesPerLevel, setDisplayedSeriesPerLevel] = useState<Record<string, number>>({});
  const [loadingMoreLevel, setLoadingMoreLevel] = useState<string | null>(null);
  
  const SERIES_PER_PAGE = 6;

  const seriesByLevel = useMemo(() => {
    const grouped = series.reduce((acc, seriesItem) => {
      const level = seriesItem.level;
      if (!acc[level]) {
        acc[level] = [];
      }
      acc[level].push(seriesItem);
      return acc;
    }, {} as Record<string, DSSeries[]>);
    
    // Define level order
    const levelOrder = ['superbeginner', 'beginner', 'intermediate', 'advanced'];
    
    return levelOrder.reduce((orderedGroups, level) => {
      if (grouped[level]) {
        orderedGroups[level] = grouped[level];
      }
      return orderedGroups;
    }, {} as Record<string, DSSeries[]>);
  }, [series]);

  // Initialize displayed counts for each level
  useEffect(() => {
    const initialCounts: Record<string, number> = {};
    Object.keys(seriesByLevel).forEach(level => {
      initialCounts[level] = SERIES_PER_PAGE;
    });
    setDisplayedSeriesPerLevel(initialCounts);
  }, [seriesByLevel]);

  const loadMoreForLevel = async (level: string) => {
    if (loadingMoreLevel) return;
    
    setLoadingMoreLevel(level);
    // Simulate network delay for smooth UX
    setTimeout(() => {
      setDisplayedSeriesPerLevel(prev => ({
        ...prev,
        [level]: (prev[level] || SERIES_PER_PAGE) + SERIES_PER_PAGE
      }));
      setLoadingMoreLevel(null);
    }, 300);
  };

  const getLevelDisplayName = (level: string) => {
    const levelNames = {
      'superbeginner': 'Super Beginner',
      'beginner': 'Beginner',
      'intermediate': 'Intermediate',
      'advanced': 'Advanced'
    };
    return levelNames[level as keyof typeof levelNames] || level;
  };

  const getSeriesImageUrl = (seriesId: string) => {
    return `https://d36f3pr6g3yfev.cloudfront.net/series-${seriesId}-vertical.jpg`;
  };

  useEffect(() => {
    if (series.length === 0) {
      fetchSeries();
    }
  }, []);

  const handleRetry = () => {
    fetchSeries();
  };

  const renderSeriesItem = (item: DSSeries) => {
    return (
      <TouchableOpacity
        key={item._id}
        style={styles.seriesItem}
        onPress={() => onSelectSeries(item)}
      >
        <Image
          source={{ uri: getSeriesImageUrl(item._id) }}
          style={styles.seriesImage}
          resizeMode="cover"
        />
        <View style={styles.fallbackContainer}>
          <Text style={styles.fallbackTitle} numberOfLines={3}>
            {item.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderLevelSection = (level: string, seriesItems: DSSeries[]) => {
    const displayedCount = displayedSeriesPerLevel[level] || SERIES_PER_PAGE;
    const displayedItems = seriesItems.slice(0, displayedCount);
    const hasMore = displayedItems.length < seriesItems.length;
    const isLoadingThisLevel = loadingMoreLevel === level;

    return (
      <View key={level} style={styles.levelSection}>
        <View style={styles.levelHeader}>
          <Text style={styles.levelTitle}>
            {getLevelDisplayName(level)} ({displayedItems.length}/{seriesItems.length})
          </Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScrollContent}
        >
          {displayedItems.map(renderSeriesItem)}
          {hasMore && (
            <TouchableOpacity
              style={styles.loadMoreCard}
              onPress={() => loadMoreForLevel(level)}
              disabled={isLoadingThisLevel}
            >
              <View style={styles.loadMoreContent}>
                <Text style={styles.loadMoreText}>
                  {isLoadingThisLevel ? 'Loading...' : `Load More\n(${seriesItems.length - displayedItems.length} remaining)`}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading series...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button onPress={handleRetry} style={styles.retryButton}>
          Retry
        </Button>
        <Button onPress={onBack} variant="secondary" style={styles.backButton}>
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Series</Text>
        <Button onPress={onBack} variant="secondary" style={styles.backButtonHeader}>
          Back
        </Button>
      </View>
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {Object.entries(seriesByLevel).length === 0 ? (
          <Text style={styles.loadingText}>No series found</Text>
        ) : (
          Object.entries(seriesByLevel).map(([level, seriesItems]) =>
            renderLevelSection(level, seriesItems)
          )
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  backButtonHeader: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  levelSection: {
    marginBottom: spacing.xl,
  },
  levelHeader: {
    marginBottom: spacing.md,
    marginLeft: spacing.sm,
  },
  levelTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  horizontalScrollContent: {
    paddingHorizontal: spacing.sm,
  },
  seriesItem: {
    marginRight: spacing.md,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  seriesImage: {
    width: 160,
    height: 240,
  },
  fallbackContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
    zIndex: -1,
  },
  fallbackTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingText: {
    fontSize: typography.fontSize.lg,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  errorText: {
    fontSize: typography.fontSize.lg,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  retryButton: {
    marginBottom: spacing.md,
  },
  backButton: {
    marginTop: spacing.sm,
  },
  loadMoreCard: {
    marginRight: spacing.md,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.border,
    opacity: 0.7,
  },
  loadMoreContent: {
    width: 160,
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
  },
  loadMoreText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default SeriesList;
