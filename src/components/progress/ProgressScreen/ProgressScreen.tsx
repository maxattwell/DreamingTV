import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { colors, spacing, typography } from '../../../styles';
import { useProgress, useVideos, useSeries } from '../../../context';
import ProgressCard from '../../dashboard/ProgressCard';
import Button from '../../common/Button';

const ProgressScreen: React.FC = () => {
  const { currentMinutes, goalMinutes, goalReached, refreshProgress } = useProgress();
  const { refreshData: refreshVideos } = useVideos();
  const { refreshData: refreshSeries } = useSeries();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Refresh all data in parallel
      await Promise.all([
        refreshProgress(),
        refreshVideos(),
        refreshSeries(),
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Progress</Text>
      
      <ProgressCard
        currentMinutes={currentMinutes}
        goalMinutes={goalMinutes}
        goalReached={goalReached}
      />
      
      <View style={styles.buttonContainer}>
        <Button onPress={handleRefresh} loading={refreshing}>
          Refresh Data
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
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
});

export default ProgressScreen;