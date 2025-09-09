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

  const sortOptions = ['none', 'random', 'new', 'old', 'easy', 'hard', 'long', 'short'];
  const levelOptions = ['advanced', 'beginner', 'intermediate', 'superbeginner'];

  useEffect(() => {
    if (videos.length === 0) {
      fetchVideos();
    }
  }, []);

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
    
    if (filterParts.length === 0) {
      return 'Dreaming Spanish Videos';
    }
    
    return `Dreaming Spanish Videos (${filterParts.join(' • ')})`;
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
        data={videos}
        renderItem={renderVideoItem}
        keyExtractor={(item) => item.id}
        numColumns={4}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.row}
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
});

export default VideoList;
