import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { ButtonProps } from '../../../types';
import { styles } from './Button.styles';

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onPress, 
  disabled = false, 
  loading = false,
  variant = 'primary',
  size = 'medium'
}) => {
  const isDisabled = disabled || loading;
  
  const buttonStyles = [
    styles.button,
    styles[variant],
    styles[size],
    isDisabled && styles.disabled,
    loading && styles.loading,
  ];
  
  const textStyles = [
    styles.text,
    styles[`text${size.charAt(0).toUpperCase() + size.slice(1)}` as keyof typeof styles] || styles.text,
    isDisabled && styles.textDisabled,
  ];

  return (
    <TouchableOpacity 
      style={buttonStyles} 
      onPress={onPress} 
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      <Text style={textStyles}>
        {loading ? 'Loading...' : children}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;