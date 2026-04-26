import React from 'react';
import { View, Text } from 'react-native';

export default function EmptyState() {
  return (
    <View className="flex-1 items-center justify-center px-6">
      <Text className="text-text-secondary text-xl mb-2">
        It's quiet here...
      </Text>
      <Text className="text-text-muted text-sm">
        Start something.
      </Text>
    </View>
  );
}