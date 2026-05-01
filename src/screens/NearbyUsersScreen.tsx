import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, User, formatDistance } from '../types';
import { useChatStore } from '../store/chatStore';

type NearbyUsersScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'NearbyUsers'>;
};

interface UserCardProps {
  user: User;
  onPress: () => void;
}

const UserCard = ({ user, onPress }: UserCardProps) => {
  const getDistanceColor = () => {
    if (!user.distance) return '#71717A';
    if (user.distance < 50) return '#A3FF12';
    if (user.distance < 200) return '#2DD4BF';
    return '#4F46E5';
  };

  return (
    <Pressable 
      onPress={onPress}
      className="mx-4 my-1.5 bg-bg-elevated p-4 rounded-2xl active:opacity-90"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-4 flex-1">
          <View 
            className="w-14 h-14 rounded-xl items-center justify-center"
            style={{ backgroundColor: user.color + '20' }}
          >
            <Text className="text-text-primary font-bold text-xl">
              {user.username.slice(0, 2).toUpperCase()}
            </Text>
          </View>

          <View className="flex-1">
            <Text className="text-text-primary text-lg font-semibold">
              {user.username}
            </Text>
            <View className="flex-row items-center gap-3 mt-1">
              <View className={`w-2 h-2 rounded-full ${user.isOnline ? 'bg-accent' : 'bg-text-muted'}`} />
              <Text className="text-text-secondary text-xs">
                {user.isOnline ? 'Active now' : 'Offline'}
              </Text>
              {user.distance && (
                <>
                  <Text className="text-text-muted text-xs">•</Text>
                  <Text className="text-xs" style={{ color: getDistanceColor() }}>
                    {formatDistance(user.distance)}
                  </Text>
                </>
              )}
            </View>
          </View>
        </View>
        <Text className="text-text-muted text-xl">›</Text>
      </View>
    </Pressable>
  );
};

export default function NearbyUsersScreen({ navigation }: NearbyUsersScreenProps) {
  const insets = useSafeAreaInsets();
  const nearbyUsers = useChatStore((state) => state.nearbyUsers);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = React.useMemo(() => {
    if (!searchQuery) return nearbyUsers;
    return nearbyUsers.filter(user =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [nearbyUsers, searchQuery]);

  const handleUserPress = useCallback((user: User) => {
    navigation.navigate('PrivateChat', {
      userId: user.id,
      username: user.username,
      color: user.color,
    });
  }, [navigation]);

  const renderItem = useCallback(({ item }: { item: User }) => (
    <UserCard user={item} onPress={() => handleUserPress(item)} />
  ), [handleUserPress]);

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
        data={filteredUsers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 8, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View className="items-center mt-20">
            <Text className="text-text-secondary">No users nearby</Text>
          </View>
        )}
      />

      <Pressable
        onPress={() => navigation.navigate('Map')}
        className="absolute bottom-10 right-6 w-14 h-14 bg-accent rounded-full items-center justify-center shadow-2xl active:scale-95"
      >
        <Text className="text-black text-2xl">🗺️</Text>
      </Pressable>
    </View>
  );
}
