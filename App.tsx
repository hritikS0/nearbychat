
import "./global.css";
import React, { useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context";
import { View, Text, Platform, LogBox } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import AppNavigator from "./src/navigation/AppNavigator";

// ✅ Correct font imports
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";

// Keep splash screen visible while loading resources
SplashScreen.preventAutoHideAsync();

// Ignore non-critical warnings (optional)
if (__DEV__) {
  LogBox.ignoreLogs([
    "Remote debugger",
    "EventEmitter.removeListener",
    "[react-native-gesture-handler]",
  ]);
}

export default function App() {
  // ✅ Proper font loading (no require .ttf)
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Loading screen
  if (!fontsLoaded && !fontError) {
    return (
      <View className="flex-1 bg-bg-primary items-center justify-center">
        <View className="w-12 h-12 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        <Text className="text-text-primary mt-4 text-base">
          Loading NearbyChat...
        </Text>
      </View>
    );
  }

  if (fontError) {
    console.warn("Font loading error:", fontError);
  }

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <StatusBar
          style="light"
          backgroundColor="transparent"
          translucent
          {...(Platform.OS === "android" && { animated: true })}
        />

        {/* Wrap navigator inside error boundary */}
        <GlobalErrorBoundary>
          <AppNavigator />
        </GlobalErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

// ✅ Proper error boundary wrapping children
class GlobalErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error("Global error caught:", error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("App error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 bg-bg-primary items-center justify-center p-6">
          <Text className="text-error text-3xl mb-4">⚠️</Text>
          <Text className="text-text-primary text-xl font-semibold mb-2">
            Something went wrong
          </Text>
          <Text className="text-text-secondary text-center">
            Please restart the app.
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}


