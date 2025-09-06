import { TouchableOpacity, Text } from 'react-native';

interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export default function Button({ children, onPress, disabled = false, loading = false }: ButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled || loading}>
      <Text>{loading ? 'Loading...' : children}</Text>
    </TouchableOpacity>
  );
}