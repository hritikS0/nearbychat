import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useChatStore } from '../store/chatStore';

type ConnectingScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Connecting'>;
};

export default function ConnectingScreen({ navigation }: ConnectingScreenProps) {
  const setConnectionState = useChatStore((state) => state.setConnectionState);
  const setNearbyCount = useChatStore((state) => state.setNearbyCount);

  useEffect(() => {
    const connectTimer = setTimeout(() => {
      setConnectionState('connected');
      setNearbyCount(Math.floor(Math.random() * 12) + 1);
      navigation.replace('NearbyUsers');
    }, 1500);

    return () => clearTimeout(connectTimer);
  }, [navigation, setConnectionState, setNearbyCount]);

  return (
    <View className="flex-1 bg-bg-primary items-center justify-center">
      <ActivityIndicator size="large" color="#A3FF12" className="mb-4" />
      <Text className="text-text-secondary text-base">
        Finding people nearby...
      </Text>
    </View>
  );
}