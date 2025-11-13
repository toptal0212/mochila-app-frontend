import React from 'react';
import { View, StyleSheet } from 'react-native';

interface GlobeIconProps {
  size?: number;
  color?: string;
}

export const GlobeIcon: React.FC<GlobeIconProps> = ({ 
  size = 120, 
  color = '#6A5ACD' 
}) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Main globe circle */}
      <View style={[styles.globe, { backgroundColor: color }]}>
        {/* Continent shapes using smaller circles */}
        <View style={styles.continent1} />
        <View style={styles.continent2} />
        <View style={styles.continent3} />
        <View style={styles.continent4} />
        <View style={styles.continent5} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  globe: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  continent1: {
    position: 'absolute',
    width: 20,
    height: 15,
    backgroundColor: '#000',
    borderRadius: 10,
    top: 25,
    left: 20,
  },
  continent2: {
    position: 'absolute',
    width: 15,
    height: 25,
    backgroundColor: '#000',
    borderRadius: 8,
    top: 45,
    left: 25,
  },
  continent3: {
    position: 'absolute',
    width: 18,
    height: 12,
    backgroundColor: '#000',
    borderRadius: 9,
    top: 35,
    right: 20,
  },
  continent4: {
    position: 'absolute',
    width: 12,
    height: 20,
    backgroundColor: '#000',
    borderRadius: 6,
    top: 50,
    right: 25,
  },
  continent5: {
    position: 'absolute',
    width: 16,
    height: 10,
    backgroundColor: '#000',
    borderRadius: 8,
    bottom: 25,
    right: 30,
  },
});
