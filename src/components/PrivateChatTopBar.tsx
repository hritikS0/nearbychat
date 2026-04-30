import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList, formatDistance } from '../types';
import * as Haptics from 'expo-haptics';

interface PrivateChatTopBarProps {
  username: string;
  color?: string;
  isOnline?: boolean;
  distance?: number;
  navigation: NativeStackNavigationProp<RootStackParamList, 'PrivateChat'>;
}

export default function PrivateChatTopBar({ 
  username, 
  color = '#A1A1AA', 
  isOnline = true,
  distance = 120,
  navigation 
}: PrivateChatTopBarProps) {
  const insets = useSafeAreaInsets();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Pulse animation for online indicator
    if (isOnline) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isOnline]);

  const getDistanceColor = () => {
    if (distance < 50) return '#A3FF12';
    if (distance < 200) return '#2DD4BF';
    if (distance < 500) return '#4F46E5';
    return '#F59E0B';
  };

  return (
    <LinearGradient
      colors={['rgba(10,10,10,0.98)', 'rgba(18,18,18,0.98)']}
      className="border-b border-white/10"
      style={{ paddingTop: insets.top + 12 }}
    >
      <View className="flex-row items-center justify-between px-4 pb-3">
        {/* Back Button & User Info */}
        <Pressable 
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.goBack();
          }}
          className="flex-row items-center gap-3 flex-1"
        >
          <Text className="text-text-primary text-2xl">←</Text>
          
          <View className="flex-row items-center gap-3">
            {/* Avatar */}
            <View 
              className="w-10 h-10 rounded-xl items-center justify-center"
              style={{ backgroundColor: color + '20' }}
            >
              <Text className="text-text-primary font-semibold text-base">
                {username.slice(0, 2).toUpperCase()}
              </Text>
            </View>
            
            {/* Name & Status */}
            <View>
              <Text 
                className="text-text-primary text-base font-semibold"
                style={{ color }}
              >
                {username}
              </Text>
              <View className="flex-row items-center gap-2 mt-0.5">
                {isOnline && (
                  <>
                    <Animated.View 
                      className="w-2 h-2 rounded-full bg-accent"
                      style={{ transform: [{ scale: pulseAnim }] }}
                    />
                    <Text className="text-text-secondary text-xs">Active now</Text>
                  </>
                )}
                {distance && (
                  <>
                    <Text className="text-text-muted text-xs">•</Text>
                    <Text className="text-xs" style={{ color: getDistanceColor() }}>
                      {formatDistance(distance)}
                    </Text>
                  </>
                )}
              </View>
            </View>
          </View>
        </Pressable>

        {/* Action Buttons */}
        <View className="flex-row items-center gap-3">
          {/* Voice/Video Call (future feature) */}
          <Pressable 
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              // Future: Implement voice call
            }}
            className="p-2 rounded-full bg-white/5"
          >
            <Text className="text-text-secondary text-lg">📞</Text>
          </Pressable>
          
          {/* More Options */}
          <Pressable 
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              // Future: Show more options
            }}
            className="p-2 rounded-full bg-white/5"
          >
            <Text className="text-text-secondary text-lg">⋯</Text>
          </Pressable>
        </View>
      </View>
      
      {/* Proximity gradient line */}
      <View className="h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent" />
    </LinearGradient>
  );
}