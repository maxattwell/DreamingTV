import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '../../../styles';
import { VIEWS } from '../../../constants';
import { ViewType } from '../../../types';
import { useAuth } from '../../../context';
import Button from '../../common/Button';
import WatchIcon from '../../common/WatchIcon';
import ProgressIcon from '../../common/ProgressIcon';

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
    { view: VIEWS.VIDEOS, label: 'Watch', icon: 'watch', isSvg: true, color: '#FF69B4' },
    { view: VIEWS.PROGRESS, label: 'Progress', icon: 'progress', isSvg: true, color: '#4A148C' },
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
              currentView === item.view && { ...styles.activeMenuItem, borderLeftColor: item.color }
            ]}
            onPress={() => onNavigate(item.view)}
          >
            <View style={styles.iconContainer}>
              {item.isSvg ? (
                item.icon === 'watch' ? (
                  <WatchIcon 
                    size={24} 
                    color={item.color} 
                  />
                ) : (
                  <ProgressIcon 
                    size={24} 
                    color={item.color} 
                  />
                )
              ) : (
                <Text style={styles.icon}>{item.icon}</Text>
              )}
            </View>
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
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
  },
  iconContainer: {
    width: 24,
    height: 24,
    marginRight: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
  },
  menuText: {
    fontSize: typography.fontSize.lg,
    color: '#000000',
    fontWeight: typography.fontWeight.medium,
  },
  activeMenuText: {
    color: '#000000',
    fontWeight: typography.fontWeight.bold,
  },
  bottomSection: {
    marginTop: spacing.xl,
  },
});

export default Sidebar;
