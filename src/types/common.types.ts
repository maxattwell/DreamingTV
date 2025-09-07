export interface LoadingState {
  loading: boolean;
  error: string | null;
}

export interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
}

export type ViewType = 'dashboard' | 'videos' | 'series' | 'series-detail' | 'player' | 'progress';

export interface NavigationState {
  currentView: ViewType;
  selectedVideo: any;
  selectedSeries: any;
}