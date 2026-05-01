import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import NearbyUsersScreen from '../screens/NearbyUsersScreen';
import MapScreen from '../screens/MapScreen';
import PrivateChatScreen from '../screens/PrivateChatScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useChatStore } from '../store/chatStore';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const isAuthenticated = useChatStore((state) => state.isAuthenticated);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0A0A0A' },
          animation: 'fade',
        }}
      >
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="NearbyUsers" component={NearbyUsersScreen} />
            <Stack.Screen name="Map" component={MapScreen} />
            <Stack.Screen name="PrivateChat" component={PrivateChatScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
