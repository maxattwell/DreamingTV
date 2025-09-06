import { useState } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from './Button';
import { ContextProvider, useContext } from './ProgressContext';
import VideoList from './VideoList';
import VideoPlayer from './VideoPlayer';

function Login({ setToken }: { setToken: (token: string | null) => void }) {
  const [tempToken, setTempToken] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showVerification, setShowVerification] = useState(false);

  const fetchEphemeralAccount = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        'https://www.dreamingspanish.com/.netlify/functions/newEphemeralAccount'
      );
      if (!res.ok) throw new Error('Failed to fetch ephemeral account');
      const data = await res.json();
      setTempToken(data.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !tempToken) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        'https://www.dreamingspanish.com/.netlify/functions/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tempToken}`
          },
          body: JSON.stringify({ email })
        }
      );

      if (!res.ok) throw new Error('Login failed: ' + res.statusText);
      await res.json();

      setShowVerification(true);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async () => {
    if (!code || !tempToken || !email) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        'https://www.dreamingspanish.com/.netlify/functions/verify',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tempToken}`
          },
          body: JSON.stringify({ code, email })
        }
      );

      if (!res.ok) throw new Error('Verification failed: ' + res.statusText);

      const data = await res.json();
      await AsyncStorage.setItem('token', data.token);
      setToken(data.token);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  if (!tempToken) {
    return (
      <View style={styles.container}>
        <Text>Welcome to DreamingTV</Text>
        <Text>Sign in to sync your Dreaming Spanish progress</Text>
        <Button onPress={fetchEphemeralAccount} loading={loading}>
          Sign In
        </Button>
        {error && <Text>{error}</Text>}
      </View>
    );
  }

  if (showVerification) {
    return (
      <View style={styles.container}>
        <Text>Enter Verification Code</Text>
        <TextInput
          placeholder="Enter the code sent to your email"
          value={code}
          onChangeText={setCode}
          style={styles.input}
          keyboardType="numeric"
        />
        <Button onPress={handleVerification} disabled={!code} loading={loading}>
          Verify
        </Button>
        {error && <Text>{error}</Text>}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Login with Email</Text>
      <TextInput
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <Button onPress={handleLogin} disabled={!email} loading={loading}>
        Submit
      </Button>
      {error && <Text>{error}</Text>}
    </View>
  );
}

function LoggedInScreen() {
  const { currentMinutes, goalMinutes, goalReached, handleRemoveToken, refreshProgress } = useContext();
  const [refreshing, setRefreshing] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'videos' | 'player'>('dashboard');
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  
  const progressPercentage = Math.min((Number(currentMinutes) / Number(goalMinutes)) * 100, 100);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshProgress();
    setRefreshing(false);
  };

  const handleWatchVideos = () => {
    setCurrentView('videos');
  };

  const handleSelectVideo = (video: any) => {
    setSelectedVideo(video);
    setCurrentView('player');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedVideo(null);
  };

  const handleBackToVideos = () => {
    setCurrentView('videos');
    setSelectedVideo(null);
  };

  if (currentView === 'player' && selectedVideo) {
    return (
      <VideoPlayer
        videoId={selectedVideo.id}
        onBack={handleBackToVideos}
      />
    );
  }

  if (currentView === 'videos') {
    return (
      <VideoList
        onSelectVideo={handleSelectVideo}
        onBack={handleBackToDashboard}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Progress</Text>
      <Text style={styles.progress}>
        {currentMinutes} / {goalMinutes} minutes
      </Text>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progressPercentage}%` }]} />
      </View>
      <Text style={styles.percentage}>{Math.round(progressPercentage)}%</Text>
      {goalReached && <Text style={styles.goalReached}>🎉 Goal Reached!</Text>}
      <Button onPress={handleRefresh} loading={refreshing}>Refresh</Button>
      <Button onPress={handleWatchVideos}>Watch Videos</Button>
      <Button onPress={handleRemoveToken}>Logout</Button>
    </View>
  );
}

function AppContent() {
  const { token, handleSetToken } = useContext();

  if (token) {
    return <LoggedInScreen />;
  }

  return <Login setToken={handleSetToken} />;
}

export default function App() {
  return (
    <ContextProvider>
      <AppContent />
    </ContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    width: 250,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  progress: {
    fontSize: 18,
    marginBottom: 10,
  },
  progressBarContainer: {
    width: 200,
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    marginBottom: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 10,
  },
  percentage: {
    fontSize: 16,
    marginBottom: 10,
  },
  goalReached: {
    fontSize: 16,
    color: 'green',
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
