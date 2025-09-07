import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { AuthProvider, ProgressProvider, VideoProvider, SeriesProvider, useAuth } from './src/context';
import { LoginForm, DashboardScreen, VideoList, VideoPlayer, ProgressScreen, Sidebar, SeriesList, SeriesDetail } from './src/components';
import { useNavigation } from './src/hooks';
import { VIEWS } from './src/constants';
import { colors } from './src/styles';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { currentView, selectedVideo, selectedSeries, navigateTo, goToPlayer, goToSeriesDetail, goBack } = useNavigation();

  const handleLoginSuccess = () => {
    navigateTo(VIEWS.PROGRESS);
  };

  if (isLoading) {
    return null; // Could add a loading screen here
  }

  if (!isAuthenticated) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  // Video player takes full screen
  if (currentView === VIEWS.PLAYER && selectedVideo) {
    return (
      <VideoPlayer
        videoId={selectedVideo.id}
        onBack={goBack}
      />
    );
  }

  // Main app layout with sidebar
  const renderMainContent = () => {
    console.log('📱 App renderMainContent - currentView:', currentView);
    
    switch (currentView) {
      case VIEWS.PROGRESS:
        return <ProgressScreen />;
      case VIEWS.VIDEOS:
        return (
          <VideoList
            onSelectVideo={goToPlayer}
            onBack={goBack}
          />
        );
      case VIEWS.SERIES:
        console.log('📱 Rendering SeriesList component');
        return (
          <SeriesList
            onSelectSeries={goToSeriesDetail}
            onBack={goBack}
          />
        );
      case VIEWS.SERIES_DETAIL:
        return selectedSeries ? (
          <SeriesDetail
            series={selectedSeries}
            onSelectVideo={goToPlayer}
            onBack={goBack}
          />
        ) : <ProgressScreen />;
      case VIEWS.DASHBOARD:
        return (
          <DashboardScreen
            onWatchVideos={() => navigateTo(VIEWS.VIDEOS)}
          />
        );
      default:
        return <ProgressScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <Sidebar 
        currentView={currentView}
        onNavigate={navigateTo}
      />
      <View style={styles.content}>
        {renderMainContent()}
      </View>
    </View>
  );
};

const App: React.FC = () => {
  return (
    <>
      <StatusBar style="auto" />
      <AuthProvider>
        <ProgressProvider>
          <VideoProvider>
            <SeriesProvider>
              <AppContent />
            </SeriesProvider>
          </VideoProvider>
        </ProgressProvider>
      </AuthProvider>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
});

export default App;