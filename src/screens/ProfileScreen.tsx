import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Pressable, 
  FlatList, 
  Alert,
  Switch,
  Modal,
  Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  useSharedValue,
  FadeIn,
  SlideInRight
} from 'react-native-reanimated';
import { RootStackParamList } from '../types';
import { useChatStore } from '../store/chatStore';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';

type ProfileScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'>;
};

interface Option {
  id: string;
  label: string;
  icon: string;
  arrow?: boolean;
  danger?: boolean;
  action?: () => void;
}

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const insets = useSafeAreaInsets();
  const user = useChatStore((state) => state.user);
  const logout = useChatStore((state) => state.logout);
  const [incognitoMode, setIncognitoMode] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  
  const avatarScale = useSharedValue(1);
  const logoutScale = useSharedValue(1);

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
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            logoutScale.value = withSpring(0.9);
            setTimeout(() => {
              logout();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            }, 200);
          }
        }
      ]
    );
  };

  const handleCopyUsername = async () => {
    if (user?.username) {
      await Clipboard.setStringAsync(user.username);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Copied!', 'Username copied to clipboard');
    }
  };

  const OPTIONS: Option[] = [
    { 
      id: 'stats', 
      label: 'Chat Stats', 
      icon: '📊',
      action: () => setShowStatsModal(true)
    },
    { 
      id: 'incognito', 
      label: 'Incognito Mode', 
      icon: '👻',
      action: () => setIncognitoMode(!incognitoMode)
    },
    { 
      id: 'privacy', 
      label: 'Privacy Settings', 
      icon: '🔒',
      action: () => Alert.alert('Privacy', 'Location sharing is required for NearbyChat to work')
    },
    { 
      id: 'theme', 
      label: 'Theme', 
      icon: '🎨',
      action: () => Alert.alert('Theme', 'Dark mode only for now')
    },
    { 
      id: 'share', 
      label: 'Share Profile', 
      icon: '📤',
      action: () => Alert.alert('Share', 'Share your profile link with friends')
    },
    { 
      id: 'logout', 
      label: 'Logout', 
      icon: '🚪',
      danger: true,
      action: handleLogout
    },
  ];

  const avatarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: avatarScale.value }],
  }));

  const renderOption = ({ item, index }: { item: Option; index: number }) => (
    <Animated.View
      entering={SlideInRight.delay(index * 50).springify()}
    >
      <Pressable 
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          item.action?.();
        }}
        className="flex-row items-center justify-between px-6 py-4 bg-bg-secondary border-b border-white/5 active:bg-bg-elevated"
      >
        <View className="flex-row items-center gap-4">
          <Text className="text-xl">{item.icon}</Text>
          <Text className={`text-base ${item.danger ? 'text-error' : 'text-text-primary'}`}>
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
          item.arrow !== false && <Text className="text-text-muted text-xl">›</Text>
        )}
      </Pressable>
    </Animated.View>
  );

  // Mock stats data
  const stats = {
    totalChats: 47,
    messagesSent: 892,
    averageDistance: 234,
    longestStreak: 12,
  };

  return (
    <View className="flex-1 bg-bg-primary">
      {/* Header */}
      <LinearGradient
        colors={['rgba(10,10,10,0.98)', 'rgba(10,10,10,0.95)']}
        className="border-b border-white/10"
        style={{ paddingTop: insets.top + 12 }}
      >
        <View className="px-4 pb-4">
          <Pressable 
            onPress={() => navigation.goBack()} 
            className="mb-4"
          >
            <Text className="text-accent text-lg">← Back</Text>
          </Pressable>
        </View>
      </LinearGradient>

      {/* Profile Header */}
      <Animated.View 
        entering={FadeIn}
        className="items-center py-8"
      >
        <Pressable onPress={handleCopyUsername}>
          <Animated.View 
            style={avatarAnimatedStyle}
            className="relative"
          >
            <LinearGradient
              colors={['#A3FF12', '#2DD4BF']}
              className="w-24 h-24 rounded-full items-center justify-center"
            >
              <Text className="text-black text-4xl font-bold">
                {user?.username?.slice(0, 2).toUpperCase() || '??'}
              </Text>
            </LinearGradient>
            <View className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-accent items-center justify-center">
              <Text className="text-black text-xs">✏️</Text>
            </View>
          </Animated.View>
        </Pressable>
        
        <Text className="text-text-primary text-2xl font-bold mt-4">
          {user?.username || 'guest'}
        </Text>
        <Text className="text-text-muted text-sm mt-1">
          Member since {new Date().getFullYear()}
        </Text>
        
        {/* Stats Badge */}
        <Pressable 
          onPress={() => setShowStatsModal(true)}
          className="flex-row gap-4 mt-4 bg-white/5 px-4 py-2 rounded-full"
        >
          <View className="items-center">
            <Text className="text-accent font-bold text-lg">47</Text>
            <Text className="text-text-secondary text-xs">Chats</Text>
          </View>
          <View className="w-px bg-white/10" />
          <View className="items-center">
            <Text className="text-accent font-bold text-lg">892</Text>
            <Text className="text-text-secondary text-xs">Messages</Text>
          </View>
          <View className="w-px bg-white/10" />
          <View className="items-center">
            <Text className="text-accent font-bold text-lg">234m</Text>
            <Text className="text-text-secondary text-xs">Avg distance</Text>
          </View>
        </Pressable>
      </Animated.View>

      {/* Options List */}
      <FlatList
        data={OPTIONS}
        renderItem={renderOption}
        keyExtractor={(item) => item.id}
        className="flex-1"
        showsVerticalScrollIndicator={false}
      />

      {/* Version Info */}
      <View className="items-center py-6">
        <Text className="text-text-muted text-xs">
          NearbyChat v1.0.0
        </Text>
        <Text className="text-text-muted text-xs mt-1">
          Connect with people around you
        </Text>
      </View>

      {/* Stats Modal */}
      <Modal
        visible={showStatsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowStatsModal(false)}
      >
        <View className="flex-1 justify-end bg-black/60">
          <Pressable 
            className="flex-1" 
            onPress={() => setShowStatsModal(false)} 
          />
          <Animated.View 
            entering={SlideInRight}
            className="bg-bg-elevated rounded-t-3xl p-6"
          >
            <View className="w-12 h-1 bg-white/20 rounded-full self-center mb-6" />
            
            <Text className="text-text-primary text-2xl font-bold mb-4">
              Your Stats
            </Text>
            
            <View className="gap-4">
              <View className="flex-row justify-between items-center p-4 bg-white/5 rounded-xl">
                <Text className="text-text-secondary">Total chats</Text>
                <Text className="text-accent text-2xl font-bold">{stats.totalChats}</Text>
              </View>
              
              <View className="flex-row justify-between items-center p-4 bg-white/5 rounded-xl">
                <Text className="text-text-secondary">Messages sent</Text>
                <Text className="text-accent text-2xl font-bold">{stats.messagesSent}</Text>
              </View>
              
              <View className="flex-row justify-between items-center p-4 bg-white/5 rounded-xl">
                <Text className="text-text-secondary">Average distance</Text>
                <Text className="text-accent text-2xl font-bold">{stats.averageDistance}m</Text>
              </View>
              
              <View className="flex-row justify-between items-center p-4 bg-white/5 rounded-xl">
                <Text className="text-text-secondary">Longest streak</Text>
                <Text className="text-accent text-2xl font-bold">{stats.longestStreak} days</Text>
              </View>
            </View>
            
            <Pressable
              onPress={() => setShowStatsModal(false)}
              className="mt-6 bg-accent h-12 rounded-xl items-center justify-center"
            >
              <Text className="text-black font-semibold">Close</Text>
            </Pressable>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}