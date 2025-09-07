import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { VideoView } from 'expo-video';
import { colors, typography, spacing } from '../../../styles';
import { useVideoPlayer } from '../../../hooks';
import { formatWatchTime } from '../../../utils';
import Button from '../../common/Button';

interface VideoPlayerProps {
  videoId: string;
  onBack: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId, onBack }) => {
  const [isFinishing, setIsFinishing] = useState(false);
  
  const {
    loading,
    error,
    videoData,
    title,
    m3u8Url,
    watchedSeconds,
    player,
    togglePlayback,
    logWatchTime,
  } = useVideoPlayer(videoId);

  const handleFinish = async () => {
    try {
      setIsFinishing(true);
      await logWatchTime();
      onBack();
    } catch (error) {
      console.error('Error logging watch time:', error);
    } finally {
      setIsFinishing(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading video...</Text>
        <Button onPress={onBack}>Back</Button>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Error loading video</Text>
        <Text style={styles.errorDetails}>{error}</Text>
        <Button onPress={onBack}>Back</Button>
      </View>
    );
  }

  if (!videoData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>No video data available</Text>
        <Button onPress={onBack}>Back</Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {m3u8Url ? (
        <VideoView
          style={styles.video}
          player={player}
          nativeControls
          contentFit="contain"
          allowsFullscreen
          allowsPictureInPicture
        />
      ) : (
        <View style={styles.noVideoContainer}>
          <Text style={styles.noVideoText}>No video source available</Text>
        </View>
      )}
      
      <View style={styles.controls}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.watchTime}>
          Watched: {formatWatchTime(watchedSeconds)}
        </Text>
        
        <View style={styles.buttonRow}>
          {m3u8Url && (
            <Button onPress={togglePlayback}>
              {player.playing ? 'Pause' : 'Play'}
            </Button>
          )}
          <Button onPress={handleFinish} loading={isFinishing} disabled={isFinishing}>
            Finish & Log Time
          </Button>
          <Button onPress={onBack} variant="secondary">
            Back
          </Button>
        </View>
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  video: {
    width: width,
    height: height * 0.7,
  },
  controls: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  watchTime: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: typography.fontSize.lg,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  errorText: {
    fontSize: typography.fontSize.lg,
    color: colors.error,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  errorDetails: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  noVideoContainer: {
    width: width,
    height: height * 0.7,
    backgroundColor: colors.darkGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noVideoText: {
    fontSize: typography.fontSize.md,
    color: colors.white,
  },
});

export default VideoPlayer;