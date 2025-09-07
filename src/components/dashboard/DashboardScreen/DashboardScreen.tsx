import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '../../../styles';
import { useProgress, useAuth } from '../../../context';
import ProgressCard from '../ProgressCard';
import Button from '../../common/Button';

interface DashboardScreenProps {
  onWatchVideos: () => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ onWatchVideos }) => {
  const { currentMinutes, goalMinutes, goalReached, refreshProgress } = useProgress();
  const { logout } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshProgress();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View style={styles.container}>
      <ProgressCard
        currentMinutes={currentMinutes}
        goalMinutes={goalMinutes}
        goalReached={goalReached}
      />
      
      <View style={styles.buttonContainer}>
        <Button onPress={handleRefresh} loading={refreshing}>
          Refresh
        </Button>
        <Button onPress={onWatchVideos}>
          Watch Videos
        </Button>
        <Button onPress={handleLogout} variant="secondary">
          Logout
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
});

export default DashboardScreen;