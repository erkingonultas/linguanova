import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './home';
import ChatScreen from './chat';

const Stack = createNativeStackNavigator();

function AppNavigation() {
  return (
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
}

export default AppNavigation;