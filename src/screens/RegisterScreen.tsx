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
  Alert,
  ScrollView
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  useSharedValue,
  interpolate,
  FadeIn,
  SlideInDown,
  SlideInUp,
  Stagger,
  FadeOut
} from 'react-native-reanimated';
import { RootStackParamList } from '../types';
import { useChatStore } from '../store/chatStore';
import * as Haptics from 'expo-haptics';

type RegisterScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Register'>;
};

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const register = useChatStore((state) => state.register);
  
  // Animation values
  const buttonScale = useSharedValue(1);
  const formOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(50);
  
  // Validation state
  const [usernameValid, setUsernameValid] = useState<boolean | null>(null);
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [passwordValid, setPasswordValid] = useState<boolean | null>(null);
  const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Entrance animations
    titleTranslateY.value = withSpring(0, { damping: 12 });
    formOpacity.value = withTiming(1, { duration: 600 });
  }, []);
  
  // Real-time validation
  useEffect(() => {
    // Username validation (min 3 chars, alphanumeric)
    if (username.length > 0) {
      const isValid = username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username);
      setUsernameValid(isValid);
    } else {
      setUsernameValid(null);
    }
  }, [username]);
  
  useEffect(() => {
    // Email validation
    if (email.length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValid = emailRegex.test(email);
      setEmailValid(isValid);
    } else {
      setEmailValid(null);
    }
  }, [email]);
  
  useEffect(() => {
    // Password validation (min 6 chars)
    if (password.length > 0) {
      const isValid = password.length >= 6;
      setPasswordValid(isValid);
    } else {
      setPasswordValid(null);
    }
  }, [password]);
  
  useEffect(() => {
    // Password match validation
    if (confirmPassword.length > 0 && password.length > 0) {
      const isValid = password === confirmPassword;
      setPasswordsMatch(isValid);
    } else {
      setPasswordsMatch(null);
    }
  }, [password, confirmPassword]);

  const handleRegister = async () => {
    // Comprehensive validation
    if (!username.trim()) {
      Alert.alert('Error', 'Please enter a username');
      return;
    }
    if (username.length < 3) {
      Alert.alert('Error', 'Username must be at least 3 characters');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    if (!emailValid) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter a password');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (!agreedToTerms) {
      Alert.alert('Agreement Required', 'Please agree to the terms and conditions');
      return;
    }
    
    // Haptic feedback
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
      register();
      // Success haptic
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }, 1500);
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

  const getStatusIcon = (isValid: boolean | null) => {
    if (isValid === null) return null;
    return isValid ? '✅' : '❌';
  };

  const getStatusColor = (isValid: boolean | null) => {
    if (isValid === null) return '#71717A';
    return isValid ? '#A3FF12' : '#EF4444';
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient
        colors={['#0A0A0A', '#121212', '#1A1A1A']}
        className="flex-1"
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 40 }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Animated Logo/Header */}
            <Animated.View 
              entering={FadeIn.duration(800).springify()}
              className="items-center mb-6"
            >
              <View className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent to-accent/60 items-center justify-center mb-3">
                <Text className="text-4xl">🚀</Text>
              </View>
            </Animated.View>

            {/* Title Section */}
            <Animated.View style={titleAnimatedStyle} className="mb-8">
              <Text className="text-text-primary text-4xl font-bold tracking-tight">
                Create account
              </Text>
              <Text className="text-text-secondary text-base mt-2">
                Join the nearby community
              </Text>
            </Animated.View>

            {/* Form Fields */}
            <Animated.View style={formAnimatedStyle} className="gap-y-4">
              {/* Username Field */}
              <View>
                <View className="flex-row items-center bg-bg-elevated border border-white/5 rounded-2xl overflow-hidden">
                  <View className="px-4">
                    <Text className="text-text-muted text-lg">👤</Text>
                  </View>
                  <TextInput
                    className="flex-1 h-14 text-text-primary text-base"
                    placeholder="Username"
                    placeholderTextColor="#71717A"
                    value={username}
                    onChangeText={setUsername}
                    onFocus={() => setIsFocused('username')}
                    onBlur={() => setIsFocused(null)}
                    autoCapitalize="none"
                    autoComplete="username"
                  />
                  {getStatusIcon(usernameValid) && (
                    <View className="px-4">
                      <Text>{getStatusIcon(usernameValid)}</Text>
                    </View>
                  )}
                </View>
                {usernameValid === false && (
                  <Text className="text-error text-xs mt-1 ml-4">
                    Username must be 3+ characters (letters, numbers, underscore only)
                  </Text>
                )}
              </View>

              {/* Email Field */}
              <View>
                <View className="flex-row items-center bg-bg-elevated border border-white/5 rounded-2xl overflow-hidden">
                  <View className="px-4">
                    <Text className="text-text-muted text-lg">✉️</Text>
                  </View>
                  <TextInput
                    className="flex-1 h-14 text-text-primary text-base"
                    placeholder="Email"
                    placeholderTextColor="#71717A"
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setIsFocused('email')}
                    onBlur={() => setIsFocused(null)}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoComplete="email"
                  />
                  {getStatusIcon(emailValid) && (
                    <View className="px-4">
                      <Text>{getStatusIcon(emailValid)}</Text>
                    </View>
                  )}
                </View>
                {emailValid === false && (
                  <Text className="text-error text-xs mt-1 ml-4">
                    Please enter a valid email address
                  </Text>
                )}
              </View>

              {/* Password Field */}
              <View>
                <View className="flex-row items-center bg-bg-elevated border border-white/5 rounded-2xl overflow-hidden">
                  <View className="px-4">
                    <Text className="text-text-muted text-lg">🔒</Text>
                  </View>
                  <TextInput
                    className="flex-1 h-14 text-text-primary text-base"
                    placeholder="Password"
                    placeholderTextColor="#71717A"
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setIsFocused('password')}
                    onBlur={() => setIsFocused(null)}
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
                {passwordValid === false && (
                  <Text className="text-error text-xs mt-1 ml-4">
                    Password must be at least 6 characters
                  </Text>
                )}
                {passwordValid === true && (
                  <Text className="text-success text-xs mt-1 ml-4">
                    ✓ Strong password
                  </Text>
                )}
              </View>

              {/* Confirm Password Field */}
              <View>
                <View className="flex-row items-center bg-bg-elevated border border-white/5 rounded-2xl overflow-hidden">
                  <View className="px-4">
                    <Text className="text-text-muted text-lg">✓</Text>
                  </View>
                  <TextInput
                    className="flex-1 h-14 text-text-primary text-base"
                    placeholder="Confirm Password"
                    placeholderTextColor="#71717A"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    onFocus={() => setIsFocused('confirm')}
                    onBlur={() => setIsFocused(null)}
                    secureTextEntry={!showConfirmPassword}
                  />
                  <Pressable 
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="px-4"
                  >
                    <Text className="text-text-muted text-base">
                      {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                    </Text>
                  </Pressable>
                </View>
                {passwordsMatch === false && (
                  <Text className="text-error text-xs mt-1 ml-4">
                    Passwords do not match
                  </Text>
                )}
              </View>

              {/* Terms and Conditions */}
              <Pressable 
                onPress={() => setAgreedToTerms(!agreedToTerms)}
                className="flex-row items-center gap-3 mt-2"
              >
                <View className={`w-5 h-5 rounded border-2 items-center justify-center ${
                  agreedToTerms ? 'bg-accent border-accent' : 'border-white/30'
                }`}>
                  {agreedToTerms && <Text className="text-black text-xs">✓</Text>}
                </View>
                <Text className="text-text-secondary text-sm flex-1">
                  I agree to the Terms of Service and Privacy Policy
                </Text>
              </Pressable>

              {/* Register Button */}
              <Animated.View style={buttonAnimatedStyle} className="mt-4">
                <Pressable
                  onPress={handleRegister}
                  disabled={isLoading}
                  className="h-14 rounded-2xl items-center justify-center overflow-hidden"
                >
                  <LinearGradient
                    colors={agreedToTerms ? ['#A3FF12', '#7CCF0E'] : ['#3A3A3A', '#2A2A2A']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="absolute inset-0"
                  />
                  {isLoading ? (
                    <ActivityIndicator color={agreedToTerms ? "#000" : "#FFF"} />
                  ) : (
                    <Text className={`font-bold text-lg ${agreedToTerms ? 'text-black' : 'text-text-muted'}`}>
                      Create account →
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

            {/* Social Sign Up */}
            <Animated.View entering={SlideInUp.delay(300)} className="gap-y-3">
              <Pressable 
                onPress={() => console.log('Google sign up')}
                className="flex-row items-center justify-center gap-3 h-12 rounded-xl bg-white/5 border border-white/10"
              >
                <Text className="text-lg">🌐</Text>
                <Text className="text-text-primary font-medium">Sign up with Google</Text>
              </Pressable>
              
              <Pressable 
                onPress={() => console.log('Apple sign up')}
                className="flex-row items-center justify-center gap-3 h-12 rounded-xl bg-white/5 border border-white/10"
              >
                <Text className="text-lg">🍎</Text>
                <Text className="text-text-primary font-medium">Sign up with Apple</Text>
              </Pressable>
            </Animated.View>

            {/* Login Link */}
            <Animated.View 
              entering={FadeIn.delay(400)}
              className="flex-row justify-center mt-8 gap-x-1"
            >
              <Text className="text-text-secondary">Already have an account?</Text>
              <Pressable 
                onPress={() => {
                  if (Platform.OS !== 'web') {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                  navigation.navigate('Login');
                }}
              >
                <Text className="text-accent font-semibold"> Login</Text>
              </Pressable>
            </Animated.View>

            {/* Privacy Note */}
            <Animated.View 
              entering={FadeIn.delay(500)}
              className="mt-6 items-center pb-8"
            >
              <Text className="text-text-muted text-xs text-center">
                🔒 Your data is encrypted and never shared with third parties
              </Text>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}