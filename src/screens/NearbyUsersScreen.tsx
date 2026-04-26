import React, { useCallback } from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, User } from '../types';

type NearbyUsersScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'NearbyUsers'>;
};

const MOCK_NEARBY_USERS: User[] = [
  { id: '1', username: 'ghost_21', color: '#F472B6', isOnline: true },
  { id: '2', username: 'void_88', color: '#60A5FA', isOnline: true },
  { id: '3', username: 'pixel_42', color: '#34D399', isOnline: false },
  { id: '4', username: 'shadow_99', color: '#FBBF24', isOnline: true },
  { id: '5', username: 'echo_17', color: '#A78BFA', isOnline: true },
  { id: '6', username: 'drift_33', color: '#FB923C', isOnline: false },
];

export default function NearbyUsersScreen({ navigation }: NearbyUsersScreenProps) {
  const insets = useSafeAreaInsets();

  const handleUserPress = useCallback((user: User) => {
    navigation.navigate('PrivateChat', {
      userId: user.id,
      username: user.username,
      color: user.color,
    });
  }, [navigation]);

  const renderItem = useCallback(({ item }: { item: User }) => (
    <Pressable 
      onPress={() => handleUserPress(item)}
      className="flex-row items-center justify-between px-4 py-4 bg-bg-secondary border-b border-white/5"
    >
      <View className="flex-row items-center gap-3">
        <View 
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: item.color + '20' }}
        >
          <Text className="text-text-primary font-medium">
            {item.username.slice(0, 2).toUpperCase()}
          </Text>
        </View>
        <View>
          <Text className="text-text-primary text-base">{item.username}</Text>
          <Text className="text-text-muted text-xs">
            {item.isOnline ? 'online' : 'offline'}
          </Text>
        </View>
      </View>
      <Text className="text-text-muted">›</Text>
    </Pressable>
  ), [handleUserPress]);

  const keyExtractor = useCallback((item: User) => item.id, []);

  return (
    <View className="flex-1 bg-bg-primary">
      <View 
        className="px-4 pb-4 bg-bg-secondary border-b border-white/5"
        style={{ paddingTop: insets.top + 12 }}
      >
        <Text className="text-text-primary text-xl font-semibold">
          Nearby Users
        </Text>
        <Text className="text-text-secondary text-sm mt-1">
          ~500m radius · {MOCK_NEARBY_USERS.length} people
        </Text>
      </View>

      <FlatList
        data={MOCK_NEARBY_USERS}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerClassName="py-2"
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}