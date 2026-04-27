import React, { useCallback } from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, User } from '../types';
import { useChatStore } from '../store/chatStore';

type NearbyUsersScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'NearbyUsers'>;
};

export default function NearbyUsersScreen({ navigation }: NearbyUsersScreenProps) {
  const insets = useSafeAreaInsets();
  const nearbyUsers = useChatStore((state) => state.nearbyUsers);

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
      className="flex-row items-center justify-between px-6 py-5 bg-bg-secondary border-b border-white/5 active:bg-bg-elevated"
    >
      <View className="flex-row items-center gap-4">
        <View 
          className="w-12 h-12 rounded-2xl items-center justify-center"
          style={{ backgroundColor: item.color + '20' }}
        >
          <Text className="text-text-primary font-bold text-lg">
            {item.username.slice(0, 1).toUpperCase()}
          </Text>
        </View>
        <View>
          <Text className="text-text-primary text-lg font-semibold">{item.username}</Text>
          <View className="flex-row items-center gap-2 mt-0.5">
            <View className={`w-2 h-2 rounded-full ${item.isOnline ? 'bg-accent' : 'bg-text-muted'}`} />
            <Text className="text-text-muted text-xs">
              {item.isOnline ? 'online' : 'offline'}
            </Text>
          </View>
        </View>
      </View>
      <Text className="text-text-muted text-xl">›</Text>
    </Pressable>
  ), [handleUserPress]);

  const keyExtractor = useCallback((item: User) => item.id, []);

  return (
    <View className="flex-1 bg-bg-primary">
      <View 
        className="flex-row items-center justify-between px-6 pb-6 bg-bg-secondary border-b border-white/5"
        style={{ paddingTop: insets.top + 20 }}
      >
        <View>
          <Text className="text-text-primary text-3xl font-bold">
            Nearby
          </Text>
          <Text className="text-text-secondary text-base mt-1">
            ~500m radius · {nearbyUsers.length} people
          </Text>
        </View>
        <Pressable 
          onPress={() => navigation.navigate('Profile')}
          className="w-10 h-10 rounded-full bg-bg-elevated items-center justify-center"
        >
          <Text className="text-text-primary text-lg">⚙</Text>
        </Pressable>
      </View>

      <FlatList
        data={nearbyUsers}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerClassName="py-2"
        showsVerticalScrollIndicator={false}
      />

      {/* Map Switcher FAB */}
      <Pressable
        onPress={() => navigation.navigate('Map')}
        className="absolute bottom-10 right-6 w-14 h-14 bg-accent rounded-full items-center justify-center shadow-2xl active:scale-95"
      >
        <Text className="text-black text-2xl">🗺️</Text>
      </Pressable>
    </View>
  );
}