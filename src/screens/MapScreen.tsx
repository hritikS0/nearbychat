import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, User } from '../types';
import { useChatStore } from '../store/chatStore';

const { width, height } = Dimensions.get('window');

type MapScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Map'>;
};

const MapFallback = ({ style }: any) => (
  <View style={[style, { backgroundColor: '#121212', alignItems: 'center', justifyContent: 'center' }]}>
    <View className="items-center px-10">
      <Text className="text-accent text-5xl mb-4">📍</Text>
      <Text className="text-text-primary text-xl font-bold text-center">Interactive Map Preview</Text>
      <Text className="text-text-secondary text-center mt-2">
        Install the app on a physical device or rebuild with development clients to see the full map.
      </Text>
    </View>
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={{ position: 'absolute', top: '40%', left: '30%', width: 12, height: 12, borderRadius: 6, backgroundColor: '#A3FF12', opacity: 0.5 }} />
      <View style={{ position: 'absolute', top: '60%', left: '70%', width: 10, height: 10, borderRadius: 5, backgroundColor: '#F472B6', opacity: 0.4 }} />
      <View style={{ position: 'absolute', top: '25%', left: '55%', width: 8, height: 8, borderRadius: 4, backgroundColor: '#60A5FA', opacity: 0.3 }} />
    </View>
  </View>
);

export default function MapScreen({ navigation }: MapScreenProps) {
  const insets = useSafeAreaInsets();
  const nearbyUsers = useChatStore((state) => state.nearbyUsers);
  const user = useChatStore((state) => state.user);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleMessage = () => {
    if (selectedUser) {
      const u = selectedUser;
      setSelectedUser(null);
      navigation.navigate('PrivateChat', {
        userId: u.id,
        username: u.username,
        color: u.color,
      });
    }
  };

  return (
    <View className="flex-1 bg-bg-primary">
      <MapFallback
        style={StyleSheet.absoluteFill}
      />

      {/* Top Overlay */}
      <View
        className="absolute w-full px-6 flex-row justify-between items-start"
        style={{ top: insets.top + 20 }}
      >
        <View className="bg-bg-primary/80 backdrop-blur-md rounded-2xl p-4 border border-white/10">
          <Text className="text-text-primary text-xl font-bold">Nearby</Text>
          <Text className="text-text-secondary text-sm">within 500m</Text>
        </View>
        <Pressable
          onPress={() => navigation.navigate('Profile')}
          className="w-12 h-12 rounded-full bg-bg-primary/80 backdrop-blur-md border border-white/10 items-center justify-center"
        >
          <Text className="text-text-primary text-lg">⚙</Text>
        </Pressable>
      </View>

      {/* View Switcher FAB */}
      <Pressable
        onPress={() => navigation.navigate('NearbyUsers')}
        className="absolute bottom-10 right-6 w-14 h-14 bg-accent rounded-full items-center justify-center shadow-2xl active:scale-95"
      >
        <Text className="text-black text-2xl">≡</Text>
      </Pressable>

      {/* User Detail Bottom Sheet (Mocked with Modal) */}
      <Modal
        visible={!!selectedUser}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedUser(null)}
      >
        <View className="flex-1 justify-end">
          <Pressable
            className="flex-1"
            onPress={() => setSelectedUser(null)}
          />
          <View className="bg-bg-elevated p-8 rounded-t-[40px] border-t border-white/10">
            <View className="w-12 h-1 bg-white/20 rounded-full self-center mb-6" />

            <View className="flex-row items-center justify-between mb-8">
              <View>
                <Text className="text-text-primary text-3xl font-bold">
                  {selectedUser?.username}
                </Text>
                <Text className="text-text-secondary text-base mt-1">
                  120m away · active now
                </Text>
              </View>
              <View
                className="w-16 h-16 rounded-3xl items-center justify-center"
                style={{ backgroundColor: (selectedUser?.color || '#FFF') + '20' }}
              >
                <Text className="text-text-primary text-2xl font-bold">
                  {selectedUser?.username.slice(0, 1).toUpperCase()}
                </Text>
              </View>
            </View>

            <Pressable
              onPress={handleMessage}
              className="bg-accent h-16 rounded-2xl items-center justify-center active:scale-[0.98]"
            >
              <Text className="text-black font-bold text-lg">Message</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
