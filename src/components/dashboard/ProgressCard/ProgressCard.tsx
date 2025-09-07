import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../../../styles';
import ProgressBar from '../../common/ProgressBar';
import { formatProgressPercentage } from '../../../utils';

interface ProgressCardProps {
  currentMinutes: string;
  goalMinutes: string;
  goalReached: boolean;
}

const ProgressCard: React.FC<ProgressCardProps> = ({
  currentMinutes,
  goalMinutes,
  goalReached,
}) => {
  const progressPercentage = formatProgressPercentage(
    Number(currentMinutes), 
    Number(goalMinutes)
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Progress</Text>
      <Text style={styles.progress}>
        {currentMinutes} / {goalMinutes} minutes
      </Text>
      <ProgressBar progress={progressPercentage} />
      <Text style={styles.percentage}>{Math.round(progressPercentage)}%</Text>
      {goalReached && (
        <Text style={styles.goalReached}>🎉 Goal Reached!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: 12,
    margin: spacing.md,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  progress: {
    fontSize: typography.fontSize.lg,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  percentage: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  goalReached: {
    fontSize: typography.fontSize.md,
    color: colors.goalReached,
    fontWeight: typography.fontWeight.bold,
    marginTop: spacing.md,
  },
});

export default ProgressCard;