import React, { memo } from 'react';
import { View, Text } from 'react-native';
import { PrivateMessage } from '../types';

interface PrivateMessageItemProps {
  message: PrivateMessage;
}

const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

function PrivateMessageItem({ message }: PrivateMessageItemProps) {
  return (
    <View className={`py-1 px-4 ${message.isOwn ? 'items-end' : 'items-start'}`}>
      <View 
        className={`max-w-[75%] px-4 py-2 rounded-xl ${
          message.isOwn 
            ? 'bg-accent/20' 
            : 'bg-bg-elevated'
        }`}
      >
        <Text 
          className={`text-sm ${
            message.isOwn 
              ? 'text-white' 
              : 'text-text-secondary'
          }`}
        >
          {message.text}
        </Text>
      </View>
      <Text className="text-text-muted text-xs mt-1">
        {formatTimestamp(message.timestamp)}
      </Text>
    </View>
  );
}

export default memo(PrivateMessageItem);