import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TopBarProps {
  nearbyCount: number;
}

export default function TopBar({ nearbyCount }: TopBarProps) {
  const insets = useSafeAreaInsets();
  
  return (
    <View 
      className="flex-row items-center justify-between px-4 pb-3 bg-bg-secondary border-b border-white/5"
      style={{ paddingTop: insets.top + 12 }}
    >
      <View className="flex-row items-center gap-2">
        <View className="w-2 h-2 bg-accent rounded-full" />
        <Text className="text-text-primary text-sm">
          {nearbyCount > 0 ? `${nearbyCount} people nearby` : '~500m radius'}
        </Text>
      </View>
      
      <Pressable className="p-2">
        <Text className="text-text-muted text-lg">⚙</Text>
      </Pressable>
    </View>
  );
}