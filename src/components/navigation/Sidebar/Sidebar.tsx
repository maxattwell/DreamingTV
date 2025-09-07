import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '../../../styles';
import { VIEWS } from '../../../constants';
import { ViewType } from '../../../types';
import { useAuth } from '../../../context';
import Button from '../../common/Button';

interface SidebarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const menuItems = [
    { view: VIEWS.PROGRESS, label: 'Progress', icon: '📊' },
    { view: VIEWS.VIDEOS, label: 'Watch', icon: '🎬' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>DreamingTV</Text>
      
      <View style={styles.menuContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.view}
            style={[
              styles.menuItem,
              currentView === item.view && styles.activeMenuItem
            ]}
            onPress={() => onNavigate(item.view)}
          >
            <Text style={styles.icon}>{item.icon}</Text>
            <Text style={[
              styles.menuText,
              currentView === item.view && styles.activeMenuText
            ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.bottomSection}>
        <Button onPress={handleLogout} variant="secondary">
          Logout
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 200,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  menuContainer: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: 8,
  },
  activeMenuItem: {
    backgroundColor: colors.primary,
  },
  icon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  menuText: {
    fontSize: typography.fontSize.lg,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.medium,
  },
  activeMenuText: {
    color: colors.background,
    fontWeight: typography.fontWeight.bold,
  },
  bottomSection: {
    marginTop: spacing.xl,
  },
});

export default Sidebar;