import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {video.title}
        </Text>
        <View style={styles.metadata}>
          {video.level && (
            <Text style={styles.level}>
              {capitalizeFirstLetter(video.level)}
            </Text>
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
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  metadata: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  level: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  duration: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  premium: {
    fontSize: typography.fontSize.xs,
    color: colors.premium,
    fontWeight: typography.fontWeight.bold,
  },
});

export default VideoItem;