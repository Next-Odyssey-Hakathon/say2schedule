import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Platform } from 'react-native';
import { useToast } from '../context/ToastContext';

const { width } = Dimensions.get('window');

const Toast = () => {
  const { toast } = useToast();
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (toast.visible) {
      Animated.spring(slideAnim, {
        toValue: 50, // Top margin
        useNativeDriver: true,
        tension: 40,
        friction: 7,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -150,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [toast.visible, slideAnim]);

  const getBackgroundColor = () => {
    switch (toast.type) {
      case 'success': return '#000000'; // Success in this app's style is often black/neutral
      case 'error': return '#FF3B30';
      case 'info': return '#000000';
      default: return '#000000';
    }
  };

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          transform: [{ translateY: slideAnim }],
          backgroundColor: getBackgroundColor()
        }
      ]}
    >
      <View style={styles.content}>
        <Text style={styles.text}>{toast.message}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    width: width * 0.8,
    alignSelf: 'center',
    padding: 16,
    borderRadius: 25,
    zIndex: 10000,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default Toast;
