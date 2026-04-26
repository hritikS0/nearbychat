import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

interface PrivateChatTopBarProps {
  username: string;
  color?: string;
  isOnline?: boolean;
  navigation: NativeStackNavigationProp<RootStackParamList, 'PrivateChat'>;
}

export default function PrivateChatTopBar({ 
  username, 
  color = '#A1A1AA', 
  isOnline = true,
  navigation 
}: PrivateChatTopBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View 
      className="flex-row items-center justify-between px-4 pb-3 bg-bg-secondary border-b border-white/5"
      style={{ paddingTop: insets.top + 12 }}
    >
      <Pressable 
        onPress={() => navigation.goBack()}
        className="flex-row items-center gap-3 flex-1"
      >
        <Text className="text-text-primary text-lg">‹</Text>
        <View className="flex-row items-center gap-2">
          <Text 
            className="text-text-primary text-base font-medium"
            style={{ color }}
          >
            {username}
          </Text>
          {isOnline && (
            <View className="w-2 h-2 bg-accent rounded-full" />
          )}
        </View>
      </Pressable>

      <Pressable className="p-2">
        <Text className="text-text-muted text-lg">⚙</Text>
      </Pressable>
    </View>
  );
}