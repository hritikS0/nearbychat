import React, { useRef, useEffect, useState } from 'react';
import { FlatList, View, Text, Pressable, ListRenderItem } from 'react-native';
import { Message } from '../types';
import MessageItem from './MessageItem';

interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  const flatListRef = useRef<FlatList<Message>>(null);
  const [showNewMessages, setShowNewMessages] = useState(false);
  const prevMessagesLength = useRef(messages.length);

  useEffect(() => {
    if (messages.length > prevMessagesLength.current) {
      setShowNewMessages(false);
    }
    prevMessagesLength.current = messages.length;
  }, [messages.length]);

  const renderItem: ListRenderItem<Message> = ({ item }) => (
    <MessageItem message={item} />
  );

  const keyExtractor = (item: Message) => item.id;

  return (
    <View className="flex-1">
      {showNewMessages && (
        <Pressable 
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-bg-elevated px-4 py-2 rounded-full z-10"
          onPress={() => {
            flatListRef.current?.scrollToEnd({ animated: true });
            setShowNewMessages(false);
          }}
        >
          <Text className="text-text-secondary text-xs">New messages ↓</Text>
        </Pressable>
      )}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerClassName="py-2"
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={() => setShowNewMessages(false)}
      />
    </View>
  );
}