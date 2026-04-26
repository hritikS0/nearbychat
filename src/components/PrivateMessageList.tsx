import React, { useRef, useCallback, useState } from 'react';
import { FlatList, View, Text, Pressable, ListRenderItem, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { PrivateMessage } from '../types';
import PrivateMessageItem from './PrivateMessageItem';

interface PrivateMessageListProps {
  messages: PrivateMessage[];
}

export default function PrivateMessageList({ messages }: PrivateMessageListProps) {
  const flatListRef = useRef<FlatList<PrivateMessage>>(null);
  const [showNewMessages, setShowNewMessages] = useState(false);
  const prevMessagesLength = useRef(messages.length);

  const handleScrollBeginDrag = useCallback(() => {
    setShowNewMessages(false);
  }, []);

  const renderItem: ListRenderItem<PrivateMessage> = ({ item }) => (
    <PrivateMessageItem message={item} />
  );

  const keyExtractor = useCallback((item: PrivateMessage) => item.id, []);

  React.useEffect(() => {
    if (messages.length > prevMessagesLength.current) {
      const wasAtBottom = true; 
      if (wasAtBottom) {
        flatListRef.current?.scrollToEnd({ animated: true });
      } else {
        setShowNewMessages(true);
      }
    }
    prevMessagesLength.current = messages.length;
  }, [messages.length]);

  return (
    <View className="flex-1">
      {showNewMessages && messages.length > 0 && (
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
        onScrollBeginDrag={handleScrollBeginDrag}
        key="private-message-list"
      />
    </View>
  );
}