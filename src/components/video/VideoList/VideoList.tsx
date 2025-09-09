import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { DSVideo } from '../../../types';
import { colors, typography, spacing } from '../../../styles';
import { useVideos } from '../../../context';
import VideoItem from '../VideoItem';
import Button from '../../common/Button';
import FiltersDrawer from '../FiltersDrawer';

interface VideoListProps {
  onSelectVideo: (video: DSVideo) => void;
  onBack: () => void;
}

const VideoList: React.FC<VideoListProps> = ({ onSelectVideo, onBack }) => {
  const { videos, loading, error, fetchVideos, applyFilters, filters } = useVideos();
  const [sortOption, setSortOption] = useState<string>(filters.sort);
  const [selectedLevels, setSelectedLevels] = useState<string[]>(filters.level);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [displayedVideos, setDisplayedVideos] = useState<DSVideo[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const ITEMS_PER_PAGE = 20;

  const sortOptions = ['none', 'random', 'new', 'old', 'easy', 'hard', 'long', 'short'];
  const levelOptions = ['advanced', 'beginner', 'intermediate', 'superbeginner'];

  useEffect(() => {
    if (videos.length === 0) {
      fetchVideos();
    }
  }, []);

  // Update displayed videos when videos or page changes
  useEffect(() => {
    const startIndex = 0;
    const endIndex = currentPage * ITEMS_PER_PAGE;
    setDisplayedVideos(videos.slice(startIndex, endIndex));
  }, [videos, currentPage]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Sync local state with context filters
  useEffect(() => {
    setSortOption(filters.sort);
    setSelectedLevels(filters.level);
  }, [filters]);

  // Auto-apply filters when sort option changes
  useEffect(() => {
    if (sortOption !== filters.sort) {
      applyFilters({
        sort: sortOption,
        level: selectedLevels
      });
    }
  }, [sortOption]);

  // Auto-apply filters when level selection changes
  useEffect(() => {
    if (JSON.stringify(selectedLevels) !== JSON.stringify(filters.level)) {
      applyFilters({
        sort: sortOption,
        level: selectedLevels
      });
    }
  }, [selectedLevels]);

  const handleRefresh = () => {
    fetchVideos();
  };

  const loadMore = async () => {
    if (loadingMore || displayedVideos.length >= videos.length) {
      return;
    }

    setLoadingMore(true);
    // Simulate network delay for smooth UX
    setTimeout(() => {
      setCurrentPage(prev => prev + 1);
      setLoadingMore(false);
    }, 300);
  };

  const toggleLevel = (level: string) => {
    const newLevels = selectedLevels.includes(level)
      ? selectedLevels.filter(l => l !== level)
      : [...selectedLevels, level];
    setSelectedLevels(newLevels);
  };

  const getAppliedFiltersText = () => {
    const filterParts = [];
    
    if (sortOption && sortOption !== 'none') {
      filterParts.push(`Sort: ${sortOption}`);
    }
    
    if (selectedLevels.length > 0) {
      filterParts.push(`Level: ${selectedLevels.join(', ')}`);
    }
    
    const baseText = filterParts.length === 0 
      ? 'Dreaming Spanish Videos' 
      : `Dreaming Spanish Videos (${filterParts.join(' • ')})`;
      
    const countText = videos.length > 0 
      ? ` (${displayedVideos.length}/${videos.length})`
      : '';
      
    return baseText + countText;
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.title}>Loading Videos...</Text>
        <Button onPress={onBack}>Back</Button>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.title}>Error Loading Videos</Text>
        <Text style={styles.error}>{error}</Text>
        <View style={styles.buttonRow}>
          <Button onPress={handleRefresh}>Retry</Button>
          <Button onPress={onBack} variant="secondary">Back</Button>
        </View>
      </View>
    );
  }

  const renderVideoItem = ({ item }: { item: DSVideo }) => (
    <VideoItem
      video={item}
      onPress={onSelectVideo}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{getAppliedFiltersText()}</Text>
        <View style={styles.headerActions}>
          <Button 
            onPress={() => setFiltersVisible(true)} 
            variant="secondary" 
            style={styles.filtersButton}
          >
            Filters
          </Button>
          <Button onPress={handleRefresh} variant="secondary" style={styles.refreshButton}>
            Refresh
          </Button>
        </View>
      </View>
      
      <FlatList
        data={displayedVideos}
        renderItem={renderVideoItem}
        keyExtractor={(item) => item.id}
        numColumns={4}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.row}
        ListFooterComponent={() => (
          displayedVideos.length < videos.length ? (
            <View style={styles.loadMoreContainer}>
              <Button 
                onPress={loadMore} 
                loading={loadingMore}
                variant="secondary"
                style={styles.loadMoreButton}
              >
                {loadingMore ? 'Loading...' : `Load More (${videos.length - displayedVideos.length} remaining)`}
              </Button>
            </View>
          ) : videos.length > 0 ? (
            <View style={styles.endContainer}>
              <Text style={styles.endText}>All videos loaded ({videos.length} total)</Text>
            </View>
          ) : null
        )}
      />

      <FiltersDrawer
        visible={filtersVisible}
        onClose={() => setFiltersVisible(false)}
        sortOption={sortOption}
        setSortOption={setSortOption}
        selectedLevels={selectedLevels}
        toggleLevel={toggleLevel}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'center',
  },
  gridContainer: {
    paddingBottom: spacing.lg,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  error: {
    color: colors.error,
    fontSize: typography.fontSize.md,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  filtersButton: {
    minWidth: 80,
  },
  refreshButton: {
    minWidth: 100,
  },
  loadMoreContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  loadMoreButton: {
    paddingHorizontal: spacing.xl,
  },
  endContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  endText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
  },
});

export default VideoList;
