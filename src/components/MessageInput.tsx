import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, Pressable, Text, Keyboard, Platform } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  useSharedValue,
  interpolate,
  withSequence
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface MessageInputProps {
  onSend: (text: string) => void;
  isTyping?: boolean;
  maxLength?: number;
  placeholder?: string;
  disabled?: boolean;
  distance?: number; // For range-limited chat
}

export default function MessageInput({ 
  onSend, 
  isTyping = false, 
  maxLength = 500,
  placeholder = "say something...",
  disabled = false,
  distance = 0
}: MessageInputProps) {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const insets = useSafeAreaInsets();
  
  // Animation values
  const buttonScale = useSharedValue(1);
  const inputHeight = useSharedValue(48);
  const glowOpacity = useSharedValue(0);
  const typingOpacity = useSharedValue(0);

  // Handle typing indicator animation
  useEffect(() => {
    if (isTyping) {
      typingOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 500 }),
          withTiming(0.3, { duration: 500 })
        ),
        -1,
        true
      );
    } else {
      typingOpacity.value = withTiming(0, { duration: 300 });
    }
  }, [isTyping]);

  const handleSend = () => {
    if (!text.trim() || disabled) return;
    
    // Haptic feedback (if available)
    if (Platform.OS === 'ios') {
      // You can add actual haptics here
      console.log('Send haptic');
    }
    
    buttonScale.value = withSequence(
      withSpring(0.9),
      withSpring(1)
    );
    
    onSend(text);
    setText('');
    
    // Auto-resize input back
    inputHeight.value = withSpring(48);
  };

  const handleTextChange = (newText: string) => {
    setText(newText);
    
    // Auto-resize based on content
    const lines = newText.split('\n').length;
    const newHeight = Math.min(100, Math.max(48, lines * 24));
    inputHeight.value = withSpring(newHeight);
    
    // Glow effect when typing
    if (newText.length > 0) {
      glowOpacity.value = withTiming(1, { duration: 200 });
    } else {
      glowOpacity.value = withTiming(0, { duration: 200 });
    }
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const inputAnimatedStyle = useAnimatedStyle(() => ({
    height: inputHeight.value,
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const typingAnimatedStyle = useAnimatedStyle(() => ({
    opacity: typingOpacity.value,
  }));

  // Check if user is out of range
  const isOutOfRange = distance > 1000;
  const isNearOutOfRange = distance > 800 && distance <= 1000;

  return (
    <Animated.View 
      className={`border-t px-4 py-2 ${disabled && isOutOfRange ? 'bg-bg-primary/50' : 'bg-bg-secondary'}`}
      style={{ 
        borderColor: isNearOutOfRange ? '#F59E0B20' : '#27272A',
        paddingBottom: insets.bottom + 8,
      }}
    >
      {/* Range Warning */}
      {disabled && isOutOfRange && (
        <Animated.View className="mb-2 items-center">
          <Text className="text-error text-xs">
            ⚠️ Out of range. Move within 1000m to chat.
          </Text>
        </Animated.View>
      )}

      {isNearOutOfRange && !disabled && (
        <Animated.View className="mb-2 items-center">
          <Text className="text-warning text-xs">
            📡 Signal weak. Moving closer improves connection.
          </Text>
        </Animated.View>
      )}

      <View className="flex-row items-end gap-2">
        {/* Typing Indicator Avatar */}
        {isTyping && (
          <Animated.View 
            className="w-8 h-8 rounded-full bg-white/10 items-center justify-center"
            style={typingAnimatedStyle}
          >
            <View className="flex-row gap-0.5">
              <View className="w-1 h-1 rounded-full bg-accent" />
              <View className="w-1 h-1 rounded-full bg-accent" />
              <View className="w-1 h-1 rounded-full bg-accent" />
            </View>
          </Animated.View>
        )}

        {/* Input Container */}
        <Animated.View 
          className="flex-1 relative"
          style={[inputAnimatedStyle]}
        >
          <Animated.View 
            className="absolute inset-0 rounded-xl bg-accent/20"
            style={[glowAnimatedStyle]}
          />
          
          <TextInput
            ref={inputRef}
            value={text}
            onChangeText={handleTextChange}
            placeholder={isOutOfRange ? "Out of range..." : placeholder}
            placeholderTextColor="#71717A"
            className="flex-1 bg-bg-elevated text-text-primary text-base px-4 rounded-xl"
            style={{
              paddingVertical: 12,
              minHeight: 48,
              maxHeight: 100,
            }}
            onSubmitEditing={handleSend}
            returnKeyType="send"
            multiline
            editable={!disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            maxLength={maxLength}
          />
          
          {/* Character Counter */}
          {text.length > 0 && (
            <View className="absolute right-3 bottom-2">
              <Text className="text-text-muted text-[10px]">
                {text.length}/{maxLength}
              </Text>
            </View>
          )}
        </Animated.View>

        {/* Send Button */}
        <Animated.View style={buttonAnimatedStyle}>
          <Pressable
            onPress={handleSend}
            disabled={!text.trim() || disabled}
            className={`w-10 h-10 rounded-xl items-center justify-center ${
              text.trim() && !disabled ? 'bg-accent' : 'bg-bg-elevated'
            }`}
          >
            <Text className={`text-lg ${text.trim() && !disabled ? 'text-black' : 'text-text-muted'}`}>
              {text.trim() ? '➤' : '✏️'}
            </Text>
          </Pressable>
        </Animated.View>
      </View>

      {/* Quick Reply Suggestions (Optional) */}
      {!text.trim() && !isFocused && !disabled && (
        <View className="flex-row gap-2 mt-2">
          {['👋 Hey!', '📍 Nearby?', 'What\'s up?'].map((suggestion) => (
            <Pressable
              key={suggestion}
              onPress={() => {
                setText(suggestion);
                inputRef.current?.focus();
              }}
              className="bg-white/5 px-3 py-1 rounded-full"
            >
              <Text className="text-text-secondary text-xs">{suggestion}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </Animated.View>
  );
}