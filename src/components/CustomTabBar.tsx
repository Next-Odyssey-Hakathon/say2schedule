import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Dimensions, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../App';

const { width } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CustomTabBar = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const tabs = [
    { name: 'Calender', icon: require('../assets/schedule.png') },
    { name: 'Home', icon: require('../assets/ai.png') },
    { name: 'Task', icon: require('../assets/task.png') },
  ];

  const handlePress = (tabName: string) => {
    if (route.name !== tabName) {
      if (tabName === 'Home') {
        navigation.navigate('Home');
      } else if (tabName === 'Calender') {
        navigation.navigate('Calender');
      } else if (tabName === 'Task') {
        navigation.navigate('Task');
      }
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 15) }]}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = route.name === tab.name;
          const isAI = tab.name === 'Home';

          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tabItem}
              onPress={() => handlePress(tab.name)}
              activeOpacity={0.7}
            >
              <View style={[
                styles.iconContainer,
                isAI && styles.aiIconContainer,
                isActive && styles.activeIconContainer
              ]}>
                <Image
                  source={tab.icon}
                  style={[
                    styles.icon,
                    isAI && styles.aiIcon,
                    isActive && styles.activeIcon
                  ]}
                  resizeMode="contain"
                />
              </View>
              {isActive && <View style={styles.activeDot} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  tabBar: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    padding: 8,
    borderRadius: 15,
  },
  activeIconContainer: {
    backgroundColor: '#f8f8f8',
  },
  aiIconContainer: {
    backgroundColor: '#000000',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 22,
    height: 22,
    tintColor: '#bbbbbb',
  },
  aiIcon: {
    width: 24,
    height: 24,
    tintColor: '#ffffff',
  },
  activeIcon: {
    tintColor: '#000000',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#000000',
    marginTop: 2,
    position: 'absolute',
    bottom: -6,
  },
});

export default CustomTabBar;
