import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Splash from './src/screens/Splash';
import Home from './src/screens/Home';
import CalendarScreen from './src/screens/Calender'; // Keeping spelling for now to avoid break
import TaskScreen from './src/screens/Task';

import { ToastProvider } from './src/context/ToastContext';
import Toast from './src/components/Toast';

export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  Calender: undefined;
  Task: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  return (
    <ToastProvider>
      <SafeAreaProvider>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent={true}
        />
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName="Splash"
            screenOptions={{
              headerShown: false, // Maintain custom design
              animation: 'fade',
            }}
          >
            <Stack.Screen name="Splash" component={Splash} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Calender" component={CalendarScreen} />
            <Stack.Screen name="Task" component={TaskScreen} />
          </Stack.Navigator>
        </NavigationContainer>
        <Toast />
      </SafeAreaProvider>
    </ToastProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

export default App;
