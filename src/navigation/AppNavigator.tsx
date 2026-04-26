import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import EntryScreen from '../screens/EntryScreen';
import ConnectingScreen from '../screens/ConnectingScreen';
import NearbyUsersScreen from '../screens/NearbyUsersScreen';
import PrivateChatScreen from '../screens/PrivateChatScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0A0A0A' },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="Entry" component={EntryScreen} />
        <Stack.Screen name="Connecting" component={ConnectingScreen} />
        <Stack.Screen name="NearbyUsers" component={NearbyUsersScreen} />
        <Stack.Screen name="PrivateChat" component={PrivateChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}