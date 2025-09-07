import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useSeries } from '../../../context/SeriesContext';
import { DSSeries } from '../../../types/series.types';
import { colors, typography, spacing } from '../../../styles';
import Button from '../../common/Button';

interface SeriesListProps {
  onSelectSeries: (series: DSSeries) => void;
  onBack: () => void;
}

const SeriesList: React.FC<SeriesListProps> = ({ onSelectSeries, onBack }) => {
  const { series, loading, error, fetchSeries } = useSeries();

  useEffect(() => {
    if (series.length === 0) {
      fetchSeries();
    }
  }, []);

  const handleRetry = () => {
    fetchSeries();
  };

  const renderSeriesItem = ({ item }: { item: DSSeries }) => {
    return (
      <TouchableOpacity
        style={styles.seriesItem}
        onPress={() => onSelectSeries(item)}
      >
        <View style={styles.seriesContent}>
          <Text style={styles.seriesTitle}>{item.title}</Text>
          <Text style={styles.seriesDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.seriesMetadata}>
            <Text style={styles.metadataText}>Level: {item.level}</Text>
            <Text style={styles.metadataText}>Episodes: {item.numberOfEpisodes}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading series...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button onPress={handleRetry} style={styles.retryButton}>
          Retry
        </Button>
        <Button onPress={onBack} variant="secondary" style={styles.backButton}>
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Series</Text>
        <Button onPress={onBack} variant="secondary" style={styles.backButtonHeader}>
          Back
        </Button>
      </View>
      
      <FlatList
        data={series}
        renderItem={renderSeriesItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => {
          return <Text style={styles.loadingText}>No series found</Text>;
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  backButtonHeader: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  listContent: {
    padding: spacing.lg,
  },
  seriesItem: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    marginBottom: spacing.md,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  seriesContent: {
    padding: spacing.lg,
  },
  seriesTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  seriesDescription: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  seriesMetadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metadataText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  loadingText: {
    fontSize: typography.fontSize.lg,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  errorText: {
    fontSize: typography.fontSize.lg,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  retryButton: {
    marginBottom: spacing.md,
  },
  backButton: {
    marginTop: spacing.sm,
  },
});

export default SeriesList;
