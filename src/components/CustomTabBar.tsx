import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Dimensions, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

const { width } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CustomTabBar = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();

  const tabs = [
    { name: 'Calender', icon: require('../assets/schedule.png') },
    { name: 'Home', icon: require('../assets/ai.png') },
    { name: 'Task', icon: require('../assets/task.png') },
  ];

  // Helper to determine active state
  const getIsActive = (tabName: string) => {
    return route.name === tabName;
  };

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
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = getIsActive(tab.name);
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
                isActive && !isAI && styles.activeIconContainer
              ]}>
                <Image
                  source={tab.icon}
                  style={[
                    styles.icon,
                    isAI && styles.aiIcon,
                    isActive && !isAI && styles.activeIcon
                  ]}
                  resizeMode="contain"
                />
              </View>
              {isActive && !isAI && <View style={styles.activeDot} />}
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
    bottom: 30,
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    width: width * 0.85,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'space-around',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
    paddingHorizontal: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    padding: 10,
    borderRadius: 20,
  },
  activeIconContainer: {
    backgroundColor: '#f0f0f0',
  },
  aiIconContainer: {
    backgroundColor: '#000000',
    width: 65,
    height: 65,
    borderRadius: 32.5,
    marginTop: -45, // Floating effect
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#ffffff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 15,
      },
    }),
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: '#999999',
  },
  aiIcon: {
    width: 32,
    height: 32,
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
    marginTop: 4,
    position: 'absolute',
    bottom: 8,
  },
});

export default CustomTabBar;
