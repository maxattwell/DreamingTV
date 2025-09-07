import React from 'react';
import { View, Text, StyleSheet, Modal, ScrollView } from 'react-native';
import { colors, typography, spacing } from '../../../styles';
import Button from '../../common/Button';

interface FiltersDrawerProps {
  visible: boolean;
  onClose: () => void;
  sortOption: string;
  setSortOption: (option: string) => void;
  selectedLevels: string[];
  toggleLevel: (level: string) => void;
}

const FiltersDrawer: React.FC<FiltersDrawerProps> = ({
  visible,
  onClose,
  sortOption,
  setSortOption,
  selectedLevels,
  toggleLevel,
}) => {
  const sortOptions = ['none', 'random', 'new', 'old', 'easy', 'hard', 'long', 'short'];
  const levelOptions = ['advanced', 'beginner', 'intermediate', 'superbeginner'];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.drawer}>
          <View style={styles.header}>
            <Text style={styles.title}>Filters</Text>
            <Button onPress={onClose} variant="secondary" style={styles.closeButton}>
              Close
            </Button>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Sort:</Text>
              <View style={styles.optionsGrid}>
                {sortOptions.map((option) => (
                  <Button
                    key={option}
                    onPress={() => setSortOption(option)}
                    variant={sortOption === option ? 'primary' : 'secondary'}
                    style={styles.filterButton}
                  >
                    {option}
                  </Button>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Level:</Text>
              <View style={styles.optionsGrid}>
                {levelOptions.map((level) => (
                  <Button
                    key={level}
                    onPress={() => toggleLevel(level)}
                    variant={selectedLevels.includes(level) ? 'primary' : 'secondary'}
                    style={styles.filterButton}
                  >
                    {level}
                  </Button>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  drawer: {
    backgroundColor: colors.surface || colors.background,
    borderRadius: 12,
    maxWidth: 600,
    width: '90%',
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border || 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  closeButton: {
    minWidth: 80,
  },
  content: {
    padding: spacing.lg,
  },
  filterSection: {
    marginBottom: spacing.xl,
  },
  filterLabel: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  filterButton: {
    marginBottom: spacing.sm,
    minWidth: 100,
    flex: 0,
  },
});

export default FiltersDrawer;