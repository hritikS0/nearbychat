import "./global.css";
import React, { useEffect, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context";
import { View, Text, Platform, LogBox } from "react-native";
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import AppNavigator from "./src/navigation/AppNavigator";

// Keep splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Ignore specific warnings that are non-critical (optional)
if (__DEV__) {
  LogBox.ignoreLogs([
    'Remote debugger',
    'EventEmitter.removeListener',
    '[react-native-gesture-handler]',
  ]);
}

export default function App() {
  // Load custom fonts for better typography
  const [fontsLoaded, fontError] = useFonts({
    // Inter font family - modern and clean
    'Inter_18pt-Regular': require('@expo-google-fonts/inter/Inter_18pt-Regular.ttf'),
    'Inter_18pt-Medium': require('@expo-google-fonts/inter/Inter_18pt-Medium.ttf'),
    'Inter_18pt-SemiBold': require('@expo-google-fonts/inter/Inter_18pt-SemiBold.ttf'),
    'Inter_18pt-Bold': require('@expo-google-fonts/inter/Inter_18pt-Bold.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Show loading screen while fonts are loading
  if (!fontsLoaded && !fontError) {
    return (
      <View className="flex-1 bg-bg-primary items-center justify-center">
        <View className="w-12 h-12 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        <Text className="text-text-primary mt-4 text-base">Loading NearbyChat...</Text>
      </View>
    );
  }

  // If there's a font error, still render the app (fallback to system fonts)
  if (fontError) {
    console.warn('Font loading error:', fontError);
  }

  return (
    <GestureHandlerRootView 
      className="flex-1"
      style={{
        // Improve gesture performance
        touchAction: 'pan-x pan-y',
      }}
    >
      <SafeAreaProvider 
        initialMetrics={initialWindowMetrics}
        // Optional: Add custom safe area insets for different devices
      >
        {/* StatusBar configuration for different screens */}
        <StatusBar 
          style="light"
          backgroundColor="transparent"
          translucent
          // For Android, make status bar content light
          {...(Platform.OS === 'android' && { animated: true })}
        />
        
        {/* Main App Navigator */}
        <AppNavigator />
        
        {/* Optional: Global error boundary fallback */}
        <GlobalErrorBoundary />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

// Optional: Global error boundary component
class GlobalErrorBoundary extends React.Component<{}, { hasError: boolean }> {
  constructor(props: {}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('Global error caught:', error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You could log to an error reporting service here
    console.error('App error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View className="absolute inset-0 bg-bg-primary/95 backdrop-blur-md items-center justify-center p-6">
          <View className="w-16 h-16 rounded-full bg-error/10 items-center justify-center mb-4">
            <Text className="text-error text-3xl">⚠️</Text>
          </View>
          <Text className="text-text-primary text-xl font-semibold mb-2">
            Something went wrong
          </Text>
          <Text className="text-text-secondary text-center mb-4">
            The app encountered an unexpected error. Please restart the app.
          </Text>
          <View className="bg-bg-elevated px-6 py-3 rounded-xl">
            <Text className="text-accent text-sm">Restart App</Text>
          </View>
        </View>
      );
    }
    return null;
  }
}

// Optional: Add performance monitoring in development
if (__DEV__) {
  const { registerPerformanceLogger } = require('react-native/Libraries/Performance/PerformanceLogger');
  registerPerformanceLogger();
}