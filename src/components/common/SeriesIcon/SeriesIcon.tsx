import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface SeriesIconProps {
  size?: number;
  color?: string;
}

const SeriesIcon: React.FC<SeriesIconProps> = ({ 
  size = 24, 
  color = '#000' 
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 6H20V18H4V6ZM2 4V20H22V4H2ZM6 8H18V10H6V8ZM6 12H14V14H6V12Z"
        fill={color}
      />
      <Path
        d="M8 2H16V4H8V2Z"
        fill={color}
      />
    </Svg>
  );
};

export default SeriesIcon;