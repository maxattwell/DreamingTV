import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import Button from './Button';
import { useContext } from './ProgressContext';

interface VideoPlayerProps {
  videoId: string;
  onBack: () => void;
}


export default function VideoPlayer({ videoId, onBack }: VideoPlayerProps) {
  const [watchedSeconds, setWatchedSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoData, setVideoData] = useState<any>(null);
  const { addHours, token } = useContext();

  const bunnyVideoUrl = videoData?.video?.sources?.bunny || null;
  const title = videoData?.video?.title || '';
  
  // Construct the m3u8 URL by appending the video ID and playlist.m3u8 to the Bunny proxy URL
  const m3u8Url = bunnyVideoUrl ? `${bunnyVideoUrl}/playlist.m3u8` : null;

  console.log('Video sources:', {
    bunnyVideoUrl,
    m3u8Url
  });

  const player = useVideoPlayer(m3u8Url || '', player => {
    player.loop = false;
    player.addListener('playbackStatusUpdate', (status) => {
      console.log('Playback status:', status);
    });
  });

  useEffect(() => {
    const fetchVideoDetails = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`https://www.dreamingspanish.com/.netlify/functions/video?id=${videoId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch video details: ${response.status}`);
        }

        const data = await response.json();
        console.log('Video data:', data);
        setVideoData(data);
        
      } catch (err) {
        console.error('Error fetching video:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch video details');
      } finally {
        setLoading(false);
      }
    };

    fetchVideoDetails();
  }, [videoId, token]);

  // Poll for current time and playing status
  useEffect(() => {
    const interval = setInterval(() => {
      if (player.currentTime) {
        const currentSeconds = Math.floor(player.currentTime);
        if (currentSeconds > watchedSeconds) {
          setWatchedSeconds(currentSeconds);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [player, watchedSeconds]);

  /* useEffect(() => {
   *   return () => {
   *     // Log watched time when component unmounts
   *     if (watchedSeconds > 30) { // Only log if watched for more than 30 seconds
   *       addHours(title, watchedSeconds);
   *     }
   *   };
   * }, [watchedSeconds, title]); */

  const togglePlayback = () => {
    if (player.playing) {
      player.pause();
    } else {
      player.play();
    }
  };


  const handleFinish = async () => {
    if (watchedSeconds > 0) {
      await addHours(title, watchedSeconds);
    }
    onBack();
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
          Watched: {Math.floor(watchedSeconds / 60)}m {watchedSeconds % 60}s
        </Text>
        
        <View style={styles.buttonRow}>
          {m3u8Url && (
            <Button onPress={togglePlayback}>
              {player.playing ? 'Pause' : 'Play'}
            </Button>
          )}
          <Button onPress={handleFinish}>
            Finish & Log Time
          </Button>
          <Button onPress={onBack}>
            Back
          </Button>
        </View>
      </View>
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  video: {
    width: width,
    height: height * 0.7,
  },
  controls: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  watchTime: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 18,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  noVideoContainer: {
    width: width,
    height: height * 0.7,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noVideoText: {
    fontSize: 16,
    color: 'white',
  },
  fallbackMessage: {
    fontSize: 14,
    color: '#ff6b35',
    marginBottom: 10,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
