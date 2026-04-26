import React, { useState } from 'react';
import { View, TextInput, Pressable, Text } from 'react-native';

interface MessageInputProps {
  onSend: (text: string) => void;
}

export default function MessageInput({ onSend }: MessageInputProps) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText('');
  };

  return (
    <View className="flex-row items-center gap-3 px-4 py-3 bg-bg-secondary border-t border-white/5">
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="say something..."
        placeholderTextColor="#71717A"
        className="flex-1 bg-bg-elevated text-text-primary text-sm px-4 py-3 rounded-xl"
        onSubmitEditing={handleSend}
        returnKeyType="send"
      />
      <Pressable
        onPress={handleSend}
        disabled={!text.trim()}
        className={`p-3 rounded-xl ${text.trim() ? 'bg-accent' : 'bg-bg-elevated'}`}
      >
        <Text className={text.trim() ? 'text-black' : 'text-text-muted'}>
          ➤
        </Text>
      </Pressable>
    </View>
  );
}