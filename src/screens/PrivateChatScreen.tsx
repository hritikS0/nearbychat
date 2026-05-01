import React, { useState, useCallback } from 'react';
import { View, Platform, FlatList, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, PrivateMessage } from '../types';
import { useChatStore } from '../store/chatStore';
import PrivateChatTopBar from '../components/PrivateChatTopBar';
import PrivateMessageItem from '../components/PrivateMessageItem';
import PrivateMessageInput from '../components/PrivateMessageInput';

type PrivateChatScreenProps = NativeStackScreenProps<RootStackParamList, 'PrivateChat'>;

const MOCK_INITIAL_MESSAGES: PrivateMessage[] = [
  { id: 'mock_1', text: 'hey', senderId: 'other', timestamp: Date.now() - 60000, isOwn: false },
  { id: 'mock_2', text: 'yo', senderId: 'me', timestamp: Date.now() - 30000, isOwn: true },
];

export default function PrivateChatScreen({ route, navigation }: PrivateChatScreenProps) {
  const { userId, username, color } = route.params;
  const user = useChatStore((state) => state.user);
  const [messages, setMessages] = useState<PrivateMessage[]>(MOCK_INITIAL_MESSAGES);

  const handleSend = useCallback((text: string) => {
    const newMessage: PrivateMessage = {
      id: `msg_${Date.now()}`,
      text: text.trim(),
      senderId: user?.id || 'me',
      timestamp: Date.now(),
      isOwn: true,
    };
    setMessages((prev) => [...prev, newMessage]);
  }, [user]);

  const isEmpty = messages.length === 0;

  return (
    <View className="flex-1 bg-bg-primary">
      <PrivateChatTopBar 
        username={username}
        color={color}
        isOnline={true}
        navigation={navigation}
      />
      
      {isEmpty ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-text-secondary text-xl mb-2">
            Say something to start the conversation
          </Text>
        </View>
      ) : (
        <FlatList
          data={messages}
          renderItem={({ item }) => <PrivateMessageItem message={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 16 }}
          showsVerticalScrollIndicator={false}
        />
      )}
      
      <PrivateMessageInput onSend={handleSend} />
    </View>
  );
}
