import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface ProgressIconProps {
  size?: number;
  color?: string;
}

const ProgressIcon: React.FC<ProgressIconProps> = ({ size = 24, color = 'currentColor' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 1024 1024" fill={color}>
      <Path d="M874.798 340.8h-88.796v-308.8c0-17.6-14.403-32-32-32h-259.002c-11 0-21 5.6-27 14.8-5.8 9.2-6.6 20.8-2 30.6l37.4 81-37.4 78.6c-4.8 10-4 21.6 1.8 30.8s16 15 27 15h227.202v89.8h-89.001c-17.603 0-32 14.4-32 32v161.601h-210.001c-17.6 0-32 14.397-32 32v151.798h-210c-17.6 0-32 14.403-32 32v242.002c0 17.603 14.4 32 32 32h725.598c17.603 0 32-14.397 32-32v-619.2c0.2-17.8-13.998-32-31.8-32zM568.003 113.2l-22.804-49.2h176.804v122.8h-176.2l21.996-46.4c4.004-8.6 4.004-18.6 0.205-27.2zM181.2 781.998h178v178.002h-178v-178.002zM423 749.998v-151.798h178.001v361.8h-178.001v-210.002zM842.798 960h-177.997v-555.4h177.997v555.4z" />
    </Svg>
  );
};

export default ProgressIcon;