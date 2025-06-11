import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface FoxLogoProps {
  size?: number;
  color?: string;
}

export default function FoxLogo({ size = 32, color = '#8B5CF6' }: FoxLogoProps) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M12 2L8 6L4 4L6 8L2 12L6 16L4 20L8 18L12 22L16 18L20 20L18 16L22 12L18 8L20 4L16 6L12 2Z"
          fill={color}
        />
        <Path
          d="M12 8C10.9 8 10 8.9 10 10S10.9 12 12 12S14 11.1 14 10S13.1 8 12 8Z"
          fill="#121212"
        />
        <Path
          d="M8 10C7.4 10 7 10.4 7 11S7.4 12 8 12S9 11.6 9 11S8.6 10 8 10Z"
          fill="#121212"
        />
        <Path
          d="M16 10C15.4 10 15 10.4 15 11S15.4 12 16 12S17 11.6 17 11S16.6 10 16 10Z"
          fill="#121212"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});