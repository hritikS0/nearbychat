import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableWithoutFeedback, 
  Keyboard,
  ActivityIndicator,
  Alert
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  useSharedValue,
  interpolate,
  Extrapolate,
  FadeIn,
  SlideInDown,
  SlideInUp
} from 'react-native-reanimated';
import { RootStackParamList } from '../types';
import { useChatStore } from '../store/chatStore';
import * as Haptics from 'expo-haptics';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const login = useChatStore((state) => state.login);
  
  // Animation values
  const buttonScale = useSharedValue(1);
  const emailBorderGlow = useSharedValue(0);
  const passwordBorderGlow = useSharedValue(0);
  const formOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(50);
  
  useEffect(() => {
    // Entrance animations
    titleTranslateY.value = withSpring(0, { damping: 12 });
    formOpacity.value = withTiming(1, { duration: 600 });
  }, []);

  const handleLogin = async () => {
    // Validation
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }
    
    // Haptic feedback
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    // Animate button
    buttonScale.value = withSpring(0.95);
    setTimeout(() => {
      buttonScale.value = withSpring(1);
    }, 150);
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      login();
      // Success haptic
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }, 1500);
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Reset Password',
      'Password reset link will be sent to your email',
      [{ text: 'OK', onPress: () => console.log('Reset password') }]
    );
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const formAnimatedStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
  }));

  const getInputGlowStyle = (fieldName: string) => {
    const glowValue = fieldName === 'email' ? emailBorderGlow : passwordBorderGlow;
    return useAnimatedStyle(() => ({
      borderColor: glowValue.value === 1 ? '#A3FF12' : 'transparent',
      shadowColor: '#A3FF12',
      shadowOpacity: glowValue.value,
      shadowRadius: 8,
    }));
  };

  const EmailGlowStyle = getInputGlowStyle('email');
  const PasswordGlowStyle = getInputGlowStyle('password');

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient
        colors={['#0A0A0A', '#121212', '#1A1A1A']}
        className="flex-1"
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 px-6 justify-center"
        >
          {/* Animated Logo/Header */}
          <Animated.View 
            entering={FadeIn.duration(800).springify()}
            className="items-center mb-8"
          >
            <View className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent to-accent/60 items-center justify-center mb-4">
              <Text className="text-4xl">💬</Text>
            </View>
          </Animated.View>

          {/* Title Section with Animation */}
          <Animated.View style={titleAnimatedStyle} className="mb-10">
            <Text className="text-text-primary text-4xl font-bold tracking-tight">
              Welcome back
            </Text>
            <Text className="text-text-secondary text-base mt-2">
              Sign in to see who's nearby
            </Text>
          </Animated.View>

          {/* Form Fields */}
          <Animated.View style={formAnimatedStyle} className="gap-y-4">
            {/* Email Field */}
            <Animated.View style={EmailGlowStyle} className="rounded-2xl overflow-hidden">
              <View className="flex-row items-center bg-bg-elevated border border-white/5 rounded-2xl">
                <View className="px-4">
                  <Text className="text-text-muted text-lg">✉️</Text>
                </View>
                <TextInput
                  className="flex-1 h-14 text-text-primary text-base"
                  placeholder="Email"
                  placeholderTextColor="#71717A"
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => {
                    setIsFocused('email');
                    emailBorderGlow.value = withTiming(1, { duration: 200 });
                    if (Platform.OS !== 'web') {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                  }}
                  onBlur={() => {
                    setIsFocused(null);
                    emailBorderGlow.value = withTiming(0, { duration: 200 });
                  }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                />
              </View>
            </Animated.View>

            {/* Password Field */}
            <Animated.View style={PasswordGlowStyle} className="rounded-2xl overflow-hidden">
              <View className="flex-row items-center bg-bg-elevated border border-white/5 rounded-2xl">
                <View className="px-4">
                  <Text className="text-text-muted text-lg">🔒</Text>
                </View>
                <TextInput
                  className="flex-1 h-14 text-text-primary text-base"
                  placeholder="Password"
                  placeholderTextColor="#71717A"
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => {
                    setIsFocused('password');
                    passwordBorderGlow.value = withTiming(1, { duration: 200 });
                  }}
                  onBlur={() => {
                    setIsFocused(null);
                    passwordBorderGlow.value = withTiming(0, { duration: 200 });
                  }}
                  secureTextEntry={!showPassword}
                />
                <Pressable 
                  onPress={() => setShowPassword(!showPassword)}
                  className="px-4"
                >
                  <Text className="text-text-muted text-base">
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </Text>
                </Pressable>
              </View>
            </Animated.View>

            {/* Forgot Password */}
            <Pressable 
              onPress={handleForgotPassword}
              className="items-end"
            >
              <Text className="text-text-muted text-sm">Forgot password?</Text>
            </Pressable>

            {/* Login Button */}
            <Animated.View style={buttonAnimatedStyle}>
              <Pressable
                onPress={handleLogin}
                disabled={isLoading}
                className="h-14 rounded-2xl items-center justify-center mt-2 overflow-hidden"
              >
                <LinearGradient
                  colors={['#A3FF12', '#7CCF0E']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="absolute inset-0"
                />
                {isLoading ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <Text className="text-black font-bold text-lg">
                    Login →
                  </Text>
                )}
              </Pressable>
            </Animated.View>
          </Animated.View>

          {/* Divider */}
          <Animated.View 
            entering={SlideInDown.delay(200)}
            className="flex-row items-center my-8"
          >
            <View className="flex-1 h-px bg-white/10" />
            <Text className="text-text-muted px-4 text-sm">or</Text>
            <View className="flex-1 h-px bg-white/10" />
          </Animated.View>

          {/* Social Login Options */}
          <Animated.View entering={SlideInUp.delay(300)} className="gap-y-3">
            <Pressable 
              onPress={() => console.log('Google login')}
              className="flex-row items-center justify-center gap-3 h-12 rounded-xl bg-white/5 border border-white/10"
            >
              <Text className="text-lg">🌐</Text>
              <Text className="text-text-primary font-medium">Continue with Google</Text>
            </Pressable>
            
            <Pressable 
              onPress={() => console.log('Apple login')}
              className="flex-row items-center justify-center gap-3 h-12 rounded-xl bg-white/5 border border-white/10"
            >
              <Text className="text-lg">🍎</Text>
              <Text className="text-text-primary font-medium">Continue with Apple</Text>
            </Pressable>
          </Animated.View>

          {/* Register Link */}
          <Animated.View 
            entering={FadeIn.delay(400)}
            className="flex-row justify-center mt-8 gap-x-1"
          >
            <Text className="text-text-secondary">Don't have an account?</Text>
            <Pressable 
              onPress={() => {
                if (Platform.OS !== 'web') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                navigation.navigate('Register');
              }}
            >
              <Text className="text-accent font-semibold"> Register</Text>
            </Pressable>
          </Animated.View>

          {/* Location Permission Notice */}
          <Animated.View 
            entering={FadeIn.delay(500)}
            className="mt-6 items-center"
          >
            <Text className="text-text-muted text-xs text-center">
              By logging in, you agree to share your location with nearby users
            </Text>
          </Animated.View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}