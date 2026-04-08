import React, { useEffect, useRef } from 'react';
import { View, Image, Animated, StyleSheet } from 'react-native';

const Splash = () => {
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const createAnimation = (animatedValue: Animated.Value) => {
      return Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0.3,
          duration: 600,
          useNativeDriver: true,
        }),
      ]);
    };

    Animated.loop(
      Animated.stagger(200, [
        createAnimation(dot1),
        createAnimation(dot2),
        createAnimation(dot3),
      ]),
    ).start();
  }, [dot1, dot2, dot3]);

  return (
    <View style={styles.container}>
      <View style={styles.centerContainer}>
        <Image
          source={require('../assets/logosaytoschedule.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.bottomContainer}>
        <Animated.View style={[styles.dot, {backgroundColor: '#FF3B30', opacity: dot1}]} />
        <Animated.View style={[styles.dot, {backgroundColor: '#34C759', opacity: dot2}]} />
        <Animated.View style={[styles.dot, {backgroundColor: '#000000', opacity: dot3}]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 250,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 100, // Position dots near the bottom
  },
  dot: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    marginHorizontal: 8,
  },
});

export default Splash;