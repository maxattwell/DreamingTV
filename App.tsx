import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, ProgressProvider, VideoProvider, useAuth } from './src/context';
import { LoginForm, DashboardScreen, VideoList, VideoPlayer } from './src/components';
import { useNavigation } from './src/hooks';
import { VIEWS } from './src/constants';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { currentView, selectedVideo, goToDashboard, goToVideos, goToPlayer, goBack } = useNavigation();

  const handleLoginSuccess = () => {
    goToDashboard();
  };

  if (isLoading) {
    return null; // Could add a loading screen here
  }

  if (!isAuthenticated) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  // Authenticated user navigation
  if (currentView === VIEWS.PLAYER && selectedVideo) {
    return (
      <VideoPlayer
        videoId={selectedVideo.id}
        onBack={goBack}
      />
    );
  }

  if (currentView === VIEWS.VIDEOS) {
    return (
      <VideoList
        onSelectVideo={goToPlayer}
        onBack={goBack}
      />
    );
  }

  // Default to dashboard
  return (
    <DashboardScreen
      onWatchVideos={goToVideos}
    />
  );
};

const App: React.FC = () => {
  return (
    <>
      <StatusBar style="auto" />
      <AuthProvider>
        <ProgressProvider>
          <VideoProvider>
            <AppContent />
          </VideoProvider>
        </ProgressProvider>
      </AuthProvider>
    </>
  );
};

export default App;