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

export type ViewType = 'dashboard' | 'videos' | 'player';

export interface NavigationState {
  currentView: ViewType;
  selectedVideo: any;
}