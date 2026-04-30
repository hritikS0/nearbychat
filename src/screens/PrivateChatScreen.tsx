import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  View, 
  KeyboardAvoidingView, 
  Platform, 
  FlatList, 
  Text,
  Keyboard,
  EmitterSubscription
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  useSharedValue,
  interpolate,
  FadeIn,
  SlideInUp
} from 'react-native-reanimated';
import { RootStackParamList, PrivateMessage, formatDistance, getProximityZone } from '../types';
import { useChatStore } from '../store/chatStore';
import PrivateChatTopBar from '../components/PrivateChatTopBar';
import PrivateMessageItem from '../components/PrivateMessageItem';
import PrivateMessageInput from '../components/PrivateMessageInput';
import * as Haptics from 'expo-haptics';

type PrivateChatScreenProps = NativeStackScreenProps<RootStackParamList, 'PrivateChat'>;

// Mock real-time simulation
const MOCK_INITIAL_MESSAGES: PrivateMessage[] = [
  { id: 'mock_1', text: 'hey! 👋', senderId: 'other', timestamp: Date.now() - 60000, isOwn: false, read: true, delivered: true },
  { id: 'mock_2', text: 'yo, what\'s up?', senderId: 'me', timestamp: Date.now() - 30000, isOwn: true, read: true, delivered: true },
  { id: 'mock_3', text: 'not much, just checking out nearby people', senderId: 'other', timestamp: Date.now() - 15000, isOwn: false, read: false, delivered: true },
];

export default function PrivateChatScreen({ route, navigation }: PrivateChatScreenProps) {
  const { userId, username, color, distance: initialDistance } = route.params;
  const user = useChatStore((state) => state.user);
  const [messages, setMessages] = useState<PrivateMessage[]>(MOCK_INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const [distance, setDistance] = useState(initialDistance || 120);
  const [isInRange, setIsInRange] = useState(true);
  const flatListRef = useRef<FlatList>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const insets = useSafeAreaInsets();
  
  // Animation values
  const typingIndicatorOpacity = useSharedValue(0);
  const warningTranslateY = useSharedValue(-100);
  
  // Simulate distance changes (in real app, this would come from location updates)
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate distance fluctuation for demo
      setDistance(prev => {
        const newDist = Math.max(50, Math.min(1000, prev + (Math.random() - 0.5) * 10));
        const inRange = newDist <= 1000;
        setIsInRange(inRange);
        
        // Show warning when approaching range limit
        if (newDist > 800 && newDist <= 1000) {
          warningTranslateY.value = withSpring(0);
          setTimeout(() => {
            warningTranslateY.value = withSpring(-100);
          }, 3000);
        }
        
        return newDist;
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Simulate typing indicator from other user
  useEffect(() => {
    const typingInterval = setInterval(() => {
      if (Math.random() > 0.7 && isInRange) {
        setIsTyping(true);
        typingIndicatorOpacity.value = withTiming(1, { duration: 300 });
        
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
          typingIndicatorOpacity.value = withTiming(0, { duration: 300 });
        }, 3000);
      }
    }, 10000);
    
    return () => clearInterval(typingInterval);
  }, [isInRange]);

  const handleSend = useCallback((text: string) => {
    if (!isInRange) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    
    const newMessage: PrivateMessage = {
      id: `msg_${Date.now()}`,
      text: text.trim(),
      senderId: user?.id || 'me',
      timestamp: Date.now(),
      isOwn: true,
      read: false,
      delivered: true,
    };
    
    setMessages((prev) => [...prev, newMessage]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
    
    // Simulate read receipt after 2 seconds
    setTimeout(() => {
      setMessages((prev) => 
        prev.map(msg => 
          msg.id === newMessage.id ? { ...msg, read: true } : msg
        )
      );
    }, 2000);
  }, [user, isInRange]);

  const warningAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: warningTranslateY.value }],
  }));

  const typingAnimatedStyle = useAnimatedStyle(() => ({
    opacity: typingIndicatorOpacity.value,
  }));

  const getProximityStatus = () => {
    if (distance < 10) return { text: 'Whisper mode', icon: '🔊', color: '#A3FF12' };
    if (distance < 50) return { text: 'Very close', icon: '📍', color: '#A3FF12' };
    if (distance < 200) return { text: 'Nearby', icon: '👋', color: '#2DD4BF' };
    if (distance < 500) return { text: 'In range', icon: '📡', color: '#4F46E5' };
    return { text: 'Weak signal', icon: '⚠️', color: '#F59E0B' };
  };

  const proximityStatus = getProximityStatus();

  return (
    <View className="flex-1 bg-bg-primary">
      <PrivateChatTopBar 
        username={username}
        color={color}
        isOnline={true}
        distance={distance}
        navigation={navigation}
      />
      
      {/* Proximity Banner */}
      <Animated.View 
        entering={SlideInUp}
        className="bg-bg-elevated px-4 py-2 border-b border-white/10"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Text className="text-lg">{proximityStatus.icon}</Text>
            <Text className="text-text-secondary text-sm">
              {proximityStatus.text}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <View className="flex-row gap-0.5">
              {[0, 1, 2].map((bar) => (
                <View
                  key={bar}
                  className="w-1 rounded-full"
                  style={{
                    height: 6 + bar * 3,
                    backgroundColor: distance < 100 
                      ? '#A3FF12' 
                      : distance < 500 
                        ? '#2DD4BF' 
                        : '#F59E0B',
                    opacity: distance < 200 ? 1 : 0.5,
                  }}
                />
              ))}
            </View>
            <Text className="text-text-primary text-sm font-medium">
              {formatDistance(distance)}
            </Text>
          </View>
        </View>
        
        {/* Range warning bar */}
        <View className="h-0.5 bg-white/10 rounded-full mt-2 overflow-hidden">
          <View 
            className="h-full rounded-full"
            style={{ 
              width: `${(distance / 1000) * 100}%`,
              backgroundColor: distance < 800 ? '#2DD4BF' : '#F59E0B'
            }}
          />
        </View>
      </Animated.View>

      {/* Out of Range Warning */}
      <Animated.View 
        style={warningAnimatedStyle}
        className="absolute top-24 left-4 right-4 z-10 bg-error/90 rounded-xl p-3"
      >
        <Text className="text-white text-center text-sm">
          ⚠️ Signal weak! Move closer to continue chatting
        </Text>
      </Animated.View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={({ item }) => (
          <PrivateMessageItem 
            message={item} 
            userColor={item.isOwn ? '#A3FF12' : color}
            distance={distance}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 16 }}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-5xl mb-4">💬</Text>
            <Text className="text-text-primary text-xl font-semibold mb-2">
              Say something to start
            </Text>
            <Text className="text-text-secondary text-center px-8">
              Messages are ephemeral and disappear when out of range
            </Text>
          </View>
        )}
      />

      {/* Typing Indicator */}
      <Animated.View 
        style={typingAnimatedStyle}
        className="px-4 py-2"
      >
        <View className="flex-row items-center gap-2">
          <View 
            className="w-6 h-6 rounded-full items-center justify-center"
            style={{ backgroundColor: color + '20' }}
          >
            <Text className="text-xs" style={{ color }}>{username[0]}</Text>
          </View>
          <View className="flex-row gap-1">
            <View className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" />
            <View className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0.2s' }} />
            <View className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0.4s' }} />
          </View>
          <Text className="text-text-secondary text-xs">typing...</Text>
        </View>
      </Animated.View>

      <PrivateMessageInput 
        onSend={handleSend} 
        disabled={!isInRange}
        distance={distance}
      />
    </View>
  );
}