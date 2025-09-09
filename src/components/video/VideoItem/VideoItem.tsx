import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { DSVideo } from '../../../types';
import { colors, typography, spacing } from '../../../styles';
import { formatDuration, capitalizeFirstLetter } from '../../../utils';

interface VideoItemProps {
  video: DSVideo;
  onPress: (video: DSVideo) => void;
}

const VideoItem: React.FC<VideoItemProps> = ({ video, onPress }) => {
  const handlePress = () => {
    onPress(video);
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'superbeginner':
        return '#4CAF50';
      case 'beginner':
        return '#8BC34A';
      case 'intermediate':
        return '#FF9800';
      case 'advanced':
        return '#F44336';
      default:
        return colors.textSecondary;
    }
  };

  const thumbnailUrl = `https://d36f3pr6g3yfev.cloudfront.net/${video.id}.jpg`;

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Image 
        source={{ uri: thumbnailUrl }}
        style={styles.thumbnail}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {video.title}
        </Text>
        <View style={styles.metadata}>
          {video.level && (
            <View style={[styles.levelBadge, { backgroundColor: getLevelColor(video.level) }]}>
              <Text style={styles.level}>
                {capitalizeFirstLetter(video.level)}
              </Text>
            </View>
          )}
          {video.duration && (
            <Text style={styles.duration}>
              {formatDuration(video.duration)}
            </Text>
          )}
          {!video.hasAccess && (
            <Text style={styles.premium}>Premium</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.lightGray,
    overflow: 'hidden',
    width: '24%',
    aspectRatio: 1.1,
  },
  thumbnail: {
    width: '100%',
    height: 120,
  },
  content: {
    flex: 1,
    padding: spacing.sm,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  metadata: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    alignItems: 'center',
  },
  levelBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  level: {
    fontSize: typography.fontSize.xs,
    color: 'white',
    fontWeight: typography.fontWeight.bold,
  },
  duration: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  premium: {
    fontSize: typography.fontSize.xs,
    color: colors.premium,
    fontWeight: typography.fontWeight.bold,
  },
});

export default VideoItem;
