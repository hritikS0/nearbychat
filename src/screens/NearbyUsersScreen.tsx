import React, { useCallback, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  Pressable, 
  FlatList, 
  Animated,
  TextInput,
  Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import Animated as Reanimated, { 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  useSharedValue,
  interpolate,
  FadeIn,
  SlideInRight
} from 'react-native-reanimated';
import { RootStackParamList, User, formatDistance, getProximityZone } from '../types';
import { useChatStore } from '../store/chatStore';
import * as Haptics from 'expo-haptics';

type NearbyUsersScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'NearbyUsers'>;
};

interface UserCardProps {
  user: User;
  onPress: () => void;
  index: number;
}

const UserCard = ({ user, onPress, index }: UserCardProps) => {
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        damping: 12,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        delay: index * 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Get status color based on distance
  const getDistanceColor = () => {
    if (!user.distance) return '#71717A';
    if (user.distance < 50) return '#A3FF12';
    if (user.distance < 200) return '#2DD4BF';
    return '#4F46E5';
  };

  const getSignalBars = () => {
    if (!user.distance) return 1;
    if (user.distance < 50) return 3;
    if (user.distance < 200) return 2;
    return 1;
  };

  const signalBars = getSignalBars();
  const distanceColor = getDistanceColor();

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
        opacity: opacityAnim,
      }}
    >
      <Pressable 
        onPress={() => {
          if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          onPress();
        }}
        className="mx-4 my-1.5 rounded-2xl overflow-hidden active:opacity-90"
      >
        <LinearGradient
          colors={['rgba(26,26,26,0.95)', 'rgba(26,26,26,0.8)']}
          className="p-4"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-4 flex-1">
              {/* Avatar with status ring */}
              <View className="relative">
                <View 
                  className="w-14 h-14 rounded-xl items-center justify-center"
                  style={{ backgroundColor: user.color + '20' }}
                >
                  <Text className="text-text-primary font-bold text-xl">
                    {user.username.slice(0, 2).toUpperCase()}
                  </Text>
                </View>
                <View 
                  className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-bg-elevated ${
                    user.isOnline ? 'bg-accent' : 'bg-text-muted'
                  }`}
                />
              </View>

              {/* User Info */}
              <View className="flex-1">
                <Text className="text-text-primary text-lg font-semibold">
                  {user.username}
                </Text>
                <View className="flex-row items-center gap-3 mt-1">
                  <View className="flex-row items-center gap-1">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <View
                        key={i}
                        className="w-1.5 rounded-full"
                        style={{
                          height: 6 + (i + 1) * 2,
                          backgroundColor: i < signalBars ? distanceColor : '#27272A',
                          opacity: i < signalBars ? 1 : 0.3,
                        }}
                      />
                    ))}
                  </View>
                  <Text className="text-text-secondary text-xs">
                    {user.isOnline ? 'Active now' : 'Offline'}
                  </Text>
                  {user.distance && (
                    <>
                      <Text className="text-text-muted text-xs">•</Text>
                      <Text className="text-xs font-medium" style={{ color: distanceColor }}>
                        {formatDistance(user.distance)}
                      </Text>
                    </>
                  )}
                </View>
              </View>

              {/* Arrow Indicator */}
              <View className="flex-row items-center gap-2">
                {user.distance && user.distance < 10 && (
                  <Text className="text-lg">🔊</Text>
                )}
                <Text className="text-text-muted text-xl">›</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
};

export default function NearbyUsersScreen({ navigation }: NearbyUsersScreenProps) {
  const insets = useSafeAreaInsets();
  const nearbyUsers = useChatStore((state) => state.nearbyUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'distance' | 'online'>('distance');
  const headerHeight = useSharedValue(80);
  const fabScale = useSharedValue(1);

  // Filter and sort users
  const filteredUsers = React.useMemo(() => {
    let filtered = [...nearbyUsers];
    
    if (searchQuery) {
      filtered = filtered.filter(user => 
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (sortBy === 'distance') {
      filtered.sort((a, b) => (a.distance || 999) - (b.distance || 999));
    } else {
      filtered.sort((a, b) => (b.isOnline ? 1 : 0) - (a.isOnline ? 1 : 0));
    }
    
    return filtered;
  }, [nearbyUsers, searchQuery, sortBy]);

  const handleUserPress = useCallback((user: User) => {
    navigation.navigate('PrivateChat', {
      userId: user.id,
      username: user.username,
      color: user.color,
      distance: user.distance,
    });
  }, [navigation]);

  const handleFabPress = () => {
    fabScale.value = withSpring(0.9);
    setTimeout(() => {
      fabScale.value = withSpring(1);
      navigation.navigate('Map');
    }, 100);
  };

  const fabAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fabScale.value }],
  }));

  const getStats = () => {
    const online = nearbyUsers.filter(u => u.isOnline).length;
    const veryNear = nearbyUsers.filter(u => u.distance && u.distance < 50).length;
    return { online, veryNear };
  };

  const stats = getStats();

  const renderItem = useCallback(({ item, index }: { item: User; index: number }) => (
    <UserCard 
      user={item} 
      onPress={() => handleUserPress(item)}
      index={index}
    />
  ), [handleUserPress]);

  const keyExtractor = useCallback((item: User) => item.id, []);

  const ListHeader = () => (
    <View className="px-4 pt-4 pb-2">
      {/* Search Bar */}
      <View className="flex-row items-center bg-bg-elevated rounded-xl px-4 mb-4 border border-white/10">
        <Text className="text-text-muted text-lg mr-2">🔍</Text>
        <TextInput
          className="flex-1 h-12 text-text-primary text-base"
          placeholder="Search nearby..."
          placeholderTextColor="#71717A"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery('')}>
            <Text className="text-text-muted text-lg">✕</Text>
          </Pressable>
        )}
      </View>

      {/* Sort Toggle and Stats */}
      <View className="flex-row justify-between items-center mb-2">
        <View className="flex-row gap-2">
          <Pressable
            onPress={() => setSortBy('distance')}
            className={`px-3 py-1.5 rounded-full ${
              sortBy === 'distance' ? 'bg-accent' : 'bg-white/10'
            }`}
          >
            <Text className={sortBy === 'distance' ? 'text-black' : 'text-text-secondary'}>
              📍 Distance
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setSortBy('online')}
            className={`px-3 py-1.5 rounded-full ${
              sortBy === 'online' ? 'bg-accent' : 'bg-white/10'
            }`}
          >
            <Text className={sortBy === 'online' ? 'text-black' : 'text-text-secondary'}>
              🟢 Online
            </Text>
          </Pressable>
        </View>
        <Text className="text-text-secondary text-xs">
          {stats.veryNear} within 50m
        </Text>
      </View>
    </View>
  );

  const ListEmpty = () => (
    <Reanimated.View 
      entering={FadeIn}
      className="flex-1 items-center justify-center py-20"
    >
      <Text className="text-6xl mb-4">🔍</Text>
      <Text className="text-text-primary text-xl font-semibold mb-2">
        No users nearby
      </Text>
      <Text className="text-text-secondary text-center px-8">
        Move closer to populated areas or check back later
      </Text>
    </Reanimated.View>
  );

  return (
    <View className="flex-1 bg-bg-primary">
      {/* Header */}
      <LinearGradient
        colors={['rgba(10,10,10,0.95)', 'rgba(10,10,10,0.8)']}
        className="border-b border-white/10"
        style={{ paddingTop: insets.top + 16 }}
      >
        <View className="px-6 pb-4">
          <View className="flex-row justify-between items-center mb-2">
            <View>
              <Text className="text-text-primary text-3xl font-bold">
                Nearby
              </Text>
              <Text className="text-text-secondary text-sm mt-1">
                {nearbyUsers.length} people within 1km
              </Text>
            </View>
            <Pressable 
              onPress={() => navigation.navigate('Profile')}
              className="w-10 h-10 rounded-full bg-white/10 items-center justify-center"
            >
              <Text className="text-text-primary text-lg">⚙️</Text>
            </Pressable>
          </View>

          {/* Quick Stats Row */}
          <View className="flex-row gap-3 mt-2">
            <View className="flex-1 bg-white/5 rounded-xl p-2">
              <Text className="text-accent text-lg font-bold">{stats.online}</Text>
              <Text className="text-text-secondary text-xs">Online now</Text>
            </View>
            <View className="flex-1 bg-white/5 rounded-xl p-2">
              <Text className="text-proximity-mint text-lg font-bold">{stats.veryNear}</Text>
              <Text className="text-text-secondary text-xs">&lt;50m away</Text>
            </View>
            <View className="flex-1 bg-white/5 rounded-xl p-2">
              <Text className="text-proximity-indigo text-lg font-bold">
                {nearbyUsers.length}
              </Text>
              <Text className="text-text-secondary text-xs">Total nearby</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* User List */}
      <FlatList
        data={filteredUsers}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />

      {/* Map Switcher FAB */}
      <Reanimated.View style={fabAnimatedStyle}>
        <Pressable
          onPress={handleFabPress}
          className="absolute bottom-10 right-6 w-14 h-14 bg-accent rounded-full items-center justify-center shadow-2xl"
          style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
        >
          <LinearGradient
            colors={['#A3FF12', '#7CCF0E']}
            className="absolute inset-0 rounded-full"
          />
          <Text className="text-black text-2xl font-bold">🗺️</Text>
        </Pressable>
      </Reanimated.View>
    </View>
  );
}