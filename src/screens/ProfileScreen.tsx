import React from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useChatStore } from '../store/chatStore';

type ProfileScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'>;
};

const OPTIONS = [
  { id: 'edit_username', label: 'Edit Username', arrow: true },
  { id: 'privacy', label: 'Privacy Info', arrow: true },
  { id: 'theme', label: 'Change Theme', arrow: true },
  { id: 'logout', label: 'Logout', arrow: false, danger: true },
];

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const insets = useSafeAreaInsets();
  const user = useChatStore((state) => state.user);
  const logout = useChatStore((state) => state.logout);

  const handleOptionPress = (id: string) => {
    if (id === 'logout') {
      logout();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  };

  const renderOption = ({ item }: { item: typeof OPTIONS[0] }) => (
    <Pressable 
      onPress={() => handleOptionPress(item.id)}
      className="flex-row items-center justify-between px-4 py-4 bg-bg-secondary border-b border-white/5 active:bg-bg-elevated"
    >
      <Text className={`text-base ${item.danger ? 'text-red-400' : 'text-text-primary'}`}>
        {item.label}
      </Text>
      {item.arrow && <Text className="text-text-muted">›</Text>}
    </Pressable>
  );

  return (
    <View className="flex-1 bg-bg-primary">
      <View 
        className="px-4 pb-4 bg-bg-secondary border-b border-white/5"
        style={{ paddingTop: insets.top + 12 }}
      >
        <Pressable onPress={() => navigation.goBack()} className="mb-4">
          <Text className="text-accent text-lg">‹ Back</Text>
        </Pressable>
        <Text className="text-text-primary text-xl font-semibold">Profile</Text>
      </View>

      <View className="items-center py-12">
        <View className="w-20 h-20 rounded-full bg-bg-elevated items-center justify-center mb-4">
          <Text className="text-text-primary text-3xl font-bold">
            {user?.username.slice(0, 2).toUpperCase() || '??'}
          </Text>
        </View>
        <Text className="text-text-primary text-xl font-semibold">
          {user?.username || 'guest'}
        </Text>
        <Text className="text-text-muted text-sm mt-1">
          anonymous user
        </Text>
      </View>

      <View className="flex-1">
        <FlatList
          data={OPTIONS}
          renderItem={renderOption}
          keyExtractor={(item) => item.id}
          contentContainerClassName="py-2"
        />
      </View>
    </View>
  );
}