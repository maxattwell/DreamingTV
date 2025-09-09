import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
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
  const [showControls, setShowControls] = useState(true);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);
  
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

  // Auto-hide controls when video is playing
  useEffect(() => {
    if (player?.playing && showControls) {
      hideTimeout.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    
    return () => {
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
      }
    };
  }, [player?.playing, showControls]);

  const showControlsTemporarily = () => {
    setShowControls(true);
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
    }
  };

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
          nativeControls={false}
          contentFit="contain"
          allowsFullscreen
          allowsPictureInPicture
        />
      ) : (
        <View style={styles.noVideoContainer}>
          <Text style={styles.noVideoText}>No video source available</Text>
        </View>
      )}
      
      {/* Video Touch Area (only active when controls are hidden) */}
      {!showControls && (
        <TouchableOpacity 
          style={styles.videoTouchArea} 
          onPress={showControlsTemporarily}
          activeOpacity={1}
        />
      )}
      
      {/* Overlay Controls */}
      {showControls && (
        <View style={styles.overlay}>
          {/* Top Controls */}
          <View style={styles.topControls}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Text style={styles.buttonIcon}>←</Text>
            </TouchableOpacity>
          </View>
          
          {/* Center Controls */}
          <View style={styles.centerControls}>
            {m3u8Url && player && (
              <TouchableOpacity 
                onPress={() => {
                  togglePlayback();
                  showControlsTemporarily();
                }} 
                style={styles.playButton}
              >
                <Text style={styles.buttonIcon}>
                  {player.playing ? '⏸' : '▶'}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              onPress={() => {
                handleFinish();
                showControlsTemporarily();
              }}
              disabled={isFinishing}
              style={[styles.finishButton, isFinishing && styles.buttonDisabled]}
            >
              <Text style={styles.buttonIcon}>
                {isFinishing ? '...' : '✓'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Bottom Controls */}
          <View style={styles.bottomControls}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.watchTime}>
              Watched: {formatWatchTime(watchedSeconds)}
            </Text>
          </View>
        </View>
      )}
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
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
  },
  videoTouchArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    justifyContent: 'space-between',
  },
  topControls: {
    paddingTop: spacing.xl,
    paddingLeft: spacing.lg,
    alignItems: 'flex-start',
  },
  centerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
  },
  bottomControls: {
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 35,
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  finishButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    color: colors.white,
    fontSize: 20,
    fontWeight: typography.fontWeight.bold,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
    marginBottom: spacing.sm,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  watchTime: {
    fontSize: typography.fontSize.sm,
    color: colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
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
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
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
