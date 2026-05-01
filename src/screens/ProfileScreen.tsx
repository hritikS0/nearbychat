import React, { useState } from 'react';
import { View, Text, Pressable, FlatList, Alert, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useChatStore } from '../store/chatStore';

type ProfileScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'>;
};

const OPTIONS = [
  { id: 'privacy', label: 'Privacy Info', icon: '🔒' },
  { id: 'theme', label: 'Change Theme', icon: '🎨' },
  { id: 'logout', label: 'Logout', icon: '🚪', danger: true },
];

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const insets = useSafeAreaInsets();
  const user = useChatStore((state) => state.user);
  const logout = useChatStore((state) => state.logout);
  const [incognitoMode, setIncognitoMode] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        }
      ]
    );
  };

  const renderOption = ({ item }: { item: typeof OPTIONS[0] }) => (
    <Pressable
      onPress={() => {
        if (item.id === 'logout') handleLogout();
      }}
      className="flex-row items-center justify-between px-6 py-4 bg-bg-secondary border-b border-white/5 active:bg-bg-elevated"
    >
      <View className="flex-row items-center gap-4">
        <Text className="text-xl">{item.icon}</Text>
        <Text className={`text-base ${item.danger ? 'text-red-400' : 'text-text-primary'}`}>
          {item.label}
        </Text>
      </View>
      {item.id === 'incognito' ? (
        <Switch
          value={incognitoMode}
          onValueChange={setIncognitoMode}
          trackColor={{ false: '#27272A', true: '#A3FF12' }}
          thumbColor={incognitoMode ? '#FFFFFF' : '#A1A1AA'}
        />
      ) : (
        <Text className="text-text-muted text-xl">›</Text>
      )}
    </Pressable>
  );

  return (
    <View className="flex-1 bg-bg-primary">
      <View
        className="px-6 pb-4 bg-bg-secondary border-b border-white/5"
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
