import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useVideos } from '../../../context/VideoContext';
import { DSSeries } from '../../../types/series.types';
import { DSVideo } from '../../../types/video.types';
import { colors, typography, spacing } from '../../../styles';
import Button from '../../common/Button';
import ProgressBar from '../../common/ProgressBar';
import VideoItem from '../../video/VideoItem';

interface SeriesDetailProps {
  series: DSSeries;
  onSelectVideo: (video: DSVideo) => void;
  onBack: () => void;
}

const SeriesDetail: React.FC<SeriesDetailProps> = ({ series, onSelectVideo, onBack }) => {
  const { allVideos, loading, error, fetchVideos } = useVideos();

  useEffect(() => {
    if (allVideos.length === 0) {
      fetchVideos();
    }
  }, []);

  const seriesVideos = useMemo(() => {
    const matchingVideos = allVideos.filter(video => video.seriesId === series._id);
    console.log('🔍 SeriesDetail: Found', matchingVideos.length, 'videos for series', series._id);
    
    return matchingVideos;
  }, [allVideos, series]);

  const handleRetry = () => {
    fetchVideos();
  };

  const renderVideoItem = ({ item }: { item: DSVideo }) => (
    <VideoItem
      video={item}
      onPress={onSelectVideo}
    />
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading series videos...</Text>
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
        <View style={styles.headerContent}>
          <Text style={styles.title}>{series.title}</Text>
          <Text style={styles.description}>{series.description}</Text>
          <View style={styles.seriesMetadata}>
            <Text style={styles.metadataText}>Level: {series.level}</Text>
            <Text style={styles.metadataText}>Episodes: {series.numberOfEpisodes}</Text>
            <Text style={styles.metadataText}>Found Videos: {seriesVideos.length}</Text>
          </View>
        </View>
        <Button onPress={onBack} variant="secondary" style={styles.backButtonHeader}>
          Back
        </Button>
      </View>
      
      {seriesVideos.length === 0 ? (
        <View style={styles.noVideosContainer}>
          <Text style={styles.noVideosText}>
            No videos found for this series. Videos may not be tagged correctly or may not be available yet.
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={seriesVideos}
            renderItem={renderVideoItem}
            keyExtractor={(item) => item.id}
            numColumns={4}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={styles.row}
          />
        </>
      )}
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
    alignItems: 'flex-start',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerContent: {
    flex: 1,
    marginRight: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  seriesMetadata: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
  },
  metadataText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  backButtonHeader: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: spacing.lg,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  noVideosContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  noVideosText: {
    fontSize: typography.fontSize.lg,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  videoItem: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    marginBottom: spacing.md,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  videoContent: {
    padding: spacing.lg,
  },
  videoTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  videoMetadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  progressBar: {
    marginTop: spacing.sm,
  },
  loadingText: {
    fontSize: typography.fontSize.lg,
    color: colors.textSecondary,
    textAlign: 'center',
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
});

export default SeriesDetail;
