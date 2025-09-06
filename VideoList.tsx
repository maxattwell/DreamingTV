import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useContext } from './ProgressContext';
import Button from './Button';

interface DSVideo {
  id: string;
  title: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
  level?: string;
  difficultyScore?: number;
  hasAccess?: boolean;
  private?: boolean;
}

interface VideoListProps {
  onSelectVideo: (video: DSVideo) => void;
  onBack: () => void;
}

export default function VideoList({ onSelectVideo, onBack }: VideoListProps) {
  const [videos, setVideos] = useState<DSVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useContext();

  const fetchVideos = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://www.dreamingspanish.com/.netlify/functions/videos', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch videos: ${response.status}`);
      }

      const data = await response.json();
      
      const formattedVideos: DSVideo[] = (data.videos || [])
        .filter((video: any) => video.hasAccess === true || video.private === false)
        .map((video: any) => ({
          id: video._id,
          title: video.title,
          level: video.level,
          duration: video.duration,
          videoUrl: video.sources?.mp4 || video.sources?.hls || '',
          thumbnailUrl: video.thumbnail,
          difficultyScore: video.difficultyScore,
          hasAccess: video.hasAccess,
          private: video.private
        }));
      
      setVideos(formattedVideos);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading Videos...</Text>
        <Button onPress={onBack}>Back</Button>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Error Loading Videos</Text>
        <Text style={styles.error}>{error}</Text>
        <Button onPress={fetchVideos}>Retry</Button>
        <Button onPress={onBack}>Back</Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dreaming Spanish Videos</Text>
      
      <ScrollView style={styles.scrollView}>
        {videos.map((video) => (
          <TouchableOpacity
            key={video.id}
            style={styles.videoItem}
            onPress={() => onSelectVideo(video)}
          >
            <View style={styles.videoInfo}>
              <Text style={styles.videoTitle}>{video.title}</Text>
              <View style={styles.videoMeta}>
                {video.level && <Text style={styles.level}>{video.level.charAt(0).toUpperCase() + video.level.slice(1)}</Text>}
                {video.duration && <Text style={styles.duration}>{formatDuration(video.duration)}</Text>}
                {!video.hasAccess && <Text style={styles.premium}>Premium</Text>}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <View style={styles.bottomButtons}>
        <Button onPress={fetchVideos}>Refresh</Button>
        <Button onPress={onBack}>Back</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    marginBottom: 20,
  },
  videoItem: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  videoInfo: {
    flex: 1,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  videoMeta: {
    flexDirection: 'row',
    gap: 15,
  },
  level: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  duration: {
    fontSize: 14,
    color: '#666',
  },
  premium: {
    fontSize: 12,
    color: '#ff6b35',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  bottomButtons: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
});
