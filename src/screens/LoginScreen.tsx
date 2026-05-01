import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useChatStore } from '../store/chatStore';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFocused, setIsFocused] = useState<string | null>(null);
  const login = useChatStore((state) => state.login);

  const handleLogin = () => {
    if (email && password) {
      login();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 bg-bg-primary px-6 justify-center"
      >
        <View className="mb-12">
          <Text className="text-text-primary text-4xl font-bold tracking-tight">
            Welcome back
          </Text>
          <Text className="text-text-secondary text-base mt-2">
            Sign in to see who's nearby
          </Text>
        </View>

        <View className="gap-y-4">
          <View>
            <TextInput
              className={`bg-bg-elevated h-14 rounded-2xl px-4 text-text-primary border ${
                isFocused === 'email' ? 'border-accent' : 'border-transparent'
              }`}
              placeholder="Email"
              placeholderTextColor="#71717A"
              value={email}
              onChangeText={setEmail}
              onFocus={() => setIsFocused('email')}
              onBlur={() => setIsFocused(null)}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View>
            <TextInput
              className={`bg-bg-elevated h-14 rounded-2xl px-4 text-text-primary border ${
                isFocused === 'password' ? 'border-accent' : 'border-transparent'
              }`}
              placeholder="Password"
              placeholderTextColor="#71717A"
              value={password}
              onChangeText={setPassword}
              onFocus={() => setIsFocused('password')}
              onBlur={() => setIsFocused(null)}
              secureTextEntry
            />
          </View>

          <Pressable
            onPress={handleLogin}
            className="bg-accent h-14 rounded-2xl items-center justify-center mt-4 active:scale-[0.98]"
          >
            <Text className="text-black font-bold text-lg">Login</Text>
          </Pressable>
        </View>

        <View className="flex-row justify-center mt-8 gap-x-1">
          <Text className="text-text-secondary">Don't have an account?</Text>
          <Pressable onPress={() => navigation.navigate('Register')}>
            <Text className="text-accent font-semibold">Register</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
