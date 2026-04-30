import React, { useEffect, useRef } from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, Platform } from 'react-native';
import { RootStackParamList } from '../types';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import NearbyUsersScreen from '../screens/NearbyUsersScreen';
import MapScreen from '../screens/MapScreen';
import PrivateChatScreen from '../screens/PrivateChatScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useChatStore } from '../store/chatStore';

// Custom screen transition configurations
const screenConfigs = {
  // Fade transition for auth screens (smooth and simple)
  auth: {
    animation: 'fade' as const,
    animationDuration: 300,
  },
  // Slide transitions for main app (feels more native)
  main: {
    animation: 'slide_from_right' as const,
    animationDuration: 300,
  },
  // Modal style for chat (feels like a sheet)
  modal: {
    presentation: 'modal' as const,
    animation: 'slide_from_bottom' as const,
    animationDuration: 400,
  },
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Optional: Deep linking configuration for future features
const linking = {
  prefixes: ['nearbychat://', 'https://nearbychat.app'],
  config: {
    screens: {
      Login: 'login',
      Register: 'register',
      NearbyUsers: 'users',
      Map: 'map',
      PrivateChat: 'chat/:userId',
      Profile: 'profile',
    },
  },
};

export default function AppNavigator() {
  const isAuthenticated = useChatStore((state) => state.isAuthenticated);
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);

  // Handle system back button behavior (Android)
  useEffect(() => {
    if (Platform.OS === 'android') {
      // You can add back button handling here if needed
      const backHandler = () => {
        if (navigationRef.current?.canGoBack()) {
          navigationRef.current?.goBack();
          return true;
        }
        return false;
      };
      
      // Uncomment if you want custom back button behavior
      // BackHandler.addEventListener('hardwareBackPress', backHandler);
      // return () => BackHandler.removeEventListener('hardwareBackPress', backHandler);
    }
  }, []);

  // Set status bar style based on authentication state
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }
  }, [isAuthenticated]);

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={linking}
      fallback={<></>} // Optional: Add a loading component here
      documentTitle={{
        formatter: (options, route) => {
          if (route?.name === 'PrivateChat') {
            return `Chatting • NearbyChat`;
          }
          return `NearbyChat • ${route?.name || 'Connect Locally'}`;
        },
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0A0A0A' },
          // Default animations based on platform
          animation: Platform.OS === 'ios' ? 'default' : 'fade_from_bottom',
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          fullScreenGestureEnabled: true,
          // Custom transition specifications
          transitionSpec: {
            open: {
              animation: 'timing',
              config: { duration: 300 },
            },
            close: {
              animation: 'timing',
              config: { duration: 300 },
            },
          },
        }}
      >
        {!isAuthenticated ? (
          // Auth Group - No header, clean transitions
          <Stack.Group screenOptions={screenConfigs.auth}>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
              options={{
                title: 'Welcome Back',
              }}
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen}
              options={{
                title: 'Create Account',
              }}
            />
          </Stack.Group>
        ) : (
          // Main App Group
          <>
            {/* Main screens with standard navigation */}
            <Stack.Group screenOptions={screenConfigs.main}>
              <Stack.Screen 
                name="NearbyUsers" 
                component={NearbyUsersScreen}
                options={{
                  title: 'Nearby',
                  headerShown: false,
                }}
              />
              <Stack.Screen 
                name="Map" 
                component={MapScreen}
                options={{
                  title: 'Radar View',
                  headerShown: false,
                }}
              />
              <Stack.Screen 
                name="Profile" 
                component={ProfileScreen}
                options={{
                  title: 'Profile',
                  headerShown: false,
                  animation: 'slide_from_bottom', // Profile feels like a modal sheet
                }}
              />
            </Stack.Group>

            {/* Chat screens with modal presentation for immersive experience */}
            <Stack.Group screenOptions={screenConfigs.modal}>
              <Stack.Screen 
                name="PrivateChat" 
                component={PrivateChatScreen}
                options={{
                  title: '',
                  headerShown: false,
                  gestureEnabled: true,
                  gestureDirection: 'vertical', // Swipe down to close
                  presentation: 'card',
                }}
              />
            </Stack.Group>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Optional: Export a hook for easy navigation access
export const useAppNavigation = () => {
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);
  return navigationRef.current;
};