import React, { memo } from 'react';
import { View, Text } from 'react-native';
import { Message } from '../types';

interface MessageItemProps {
  message: Message;
  userColor?: string;
}

const formatTimestamp = (timestamp: number): string => {
  const diff = Math.floor((Date.now() - timestamp) / 1000);
  if (diff < 60) return `${diff}m`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  return `${Math.floor(diff / 3600)}h`;
};

function MessageItem({ message, userColor }: MessageItemProps) {
  if (message.isSystem) {
    return (
      <View className="items-center py-2">
        <Text className="text-text-muted text-xs">{message.text}</Text>
      </View>
    );
  }

  return (
    <View className="py-1.5 px-4">
      <View className="flex-row items-center gap-2 mb-0.5">
        <Text 
          className="text-sm font-medium"
          style={{ color: message.isOwn ? '#FFFFFF' : (userColor || '#A1A1AA') }}
        >
          {message.username}
        </Text>
        <Text className="text-text-muted text-xs">
          {formatTimestamp(message.timestamp)}
        </Text>
      </View>
      <Text className={`text-sm ${message.isOwn ? 'text-white' : 'text-text-secondary'}`}>
        {message.text}
      </Text>
    </View>
  );
}

export default memo(MessageItem);