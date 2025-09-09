import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors, spacing } from '../../../styles';
import { VIEWS } from '../../../constants';
import { ViewType } from '../../../types';
import WatchIcon from '../../common/WatchIcon';
import ProgressIcon from '../../common/ProgressIcon';
import SeriesIcon from '../../common/SeriesIcon';

interface SidebarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  onFocusContent?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, onFocusContent }) => {
  const menuItems = [
    { view: VIEWS.VIDEOS, label: 'Watch', icon: 'watch', isSvg: true, color: '#FF69B4' },
    { view: VIEWS.SERIES, label: 'Series', icon: 'series', isSvg: true, color: '#9C27B0' },
    { view: VIEWS.PROGRESS, label: 'Progress', icon: 'progress', isSvg: true, color: '#4A148C' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.menuContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.view}
            style={[
              styles.menuItem,
              currentView === item.view && { ...styles.activeMenuItem, borderLeftColor: item.color }
            ]}
            onPress={() => {
              onNavigate(item.view);
              onFocusContent?.();
            }}
            onFocus={() => onNavigate(item.view)}
          >
            <View style={styles.iconContainer}>
              {item.isSvg ? (
                item.icon === 'watch' ? (
                  <WatchIcon 
                    size={24} 
                    color={item.color} 
                  />
                ) : item.icon === 'series' ? (
                  <SeriesIcon 
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
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 60,
    backgroundColor: colors.surface,
    justifyContent: 'center',
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
  },
  activeMenuItem: {
    borderLeftWidth: 4,
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
  },
});

export default Sidebar;
