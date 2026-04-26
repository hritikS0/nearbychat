import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useChatStore } from '../store/chatStore';

type EntryScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Entry'>;
};

export default function EntryScreen({ navigation }: EntryScreenProps) {
  const setUser = useChatStore((state) => state.setUser);

  const handleEnableLocation = () => {
    setUser();
    
    setTimeout(() => {
      navigation.replace('Connecting');
    }, 100);
  };

  return (
    <View className="flex-1 bg-bg-primary items-center justify-center px-6">
      <View className="absolute bottom-24">
        <Pressable
          onPress={handleEnableLocation}
          className="bg-accent px-8 py-4 rounded-xl"
        >
          <Text className="text-black font-semibold text-base">
            Enable Location
          </Text>
        </Pressable>
      </View>

      <View className="items-center mb-32">
        <Text className="text-text-primary text-3xl font-semibold text-center mb-3">
          Who's around you?
        </Text>
        <Text className="text-text-secondary text-base text-center">
          See what people nearby are saying.
        </Text>
      </View>
    </View>
  );
}