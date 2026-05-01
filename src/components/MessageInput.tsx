import React, { useState, useCallback } from 'react';
import { View, TextInput, Pressable, Text, Animated } from 'react-native';

interface MessageInputProps {
  onSend: (text: string) => void;
}

export default function MessageInput({ onSend }: MessageInputProps) {
  const [text, setText] = useState('');
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handleSend = useCallback(() => {
    if (!text.trim()) return;
    onSend(text);
    setText('');
  }, [text, onSend]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
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
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Pressable
          onPress={handleSend}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={!text.trim()}
          className={`p-3 rounded-xl ${text.trim() ? 'bg-accent' : 'bg-bg-elevated'}`}
        >
          <Text className={text.trim() ? 'text-black' : 'text-text-muted'}>
            ➤
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}
