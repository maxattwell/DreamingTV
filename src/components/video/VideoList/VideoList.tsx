import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { DSVideo } from '../../../types';
import { colors, typography, spacing } from '../../../styles';
import { useVideos } from '../../../context';
import VideoItem from '../VideoItem';
import Button from '../../common/Button';

interface VideoListProps {
  onSelectVideo: (video: DSVideo) => void;
  onBack: () => void;
}

const VideoList: React.FC<VideoListProps> = ({ onSelectVideo, onBack }) => {
  const { videos, loading, error, fetchVideos } = useVideos();

  useEffect(() => {
    if (videos.length === 0) {
      fetchVideos();
    }
  }, []);

  const handleRefresh = () => {
    fetchVideos();
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
      <Text style={styles.title}>Dreaming Spanish Videos</Text>
      
      <FlatList
        data={videos}
        renderItem={renderVideoItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.row}
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
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    textAlign: 'center',
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
});

export default VideoList;
