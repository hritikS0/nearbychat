import React, { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  interpolate,
  useSharedValue,
  FadeIn,
  FadeOut
} from 'react-native-reanimated';
import { Message, getProximityColor, formatDistance } from '../types';

interface MessageItemProps {
  message: Message;
  userColor?: string;
  distance?: number; // Add distance for proximity context
  showDistance?: boolean;
}

const formatTimestamp = (timestamp: number): string => {
  const diff = Math.floor((Date.now() - timestamp) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return new Date(timestamp).toLocaleDateString();
};

function MessageItem({ message, userColor, distance, showDistance = false }: MessageItemProps) {
  const scaleValue = useSharedValue(0);
  const opacityValue = useSharedValue(0);

  // Entrance animation
  React.useEffect(() => {
    scaleValue.value = withSpring(1, { damping: 12, stiffness: 100 });
    opacityValue.value = withTiming(1, { duration: 200 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
    opacity: opacityValue.value,
  }));

  // System message styling
  if (message.isSystem) {
    return (
      <Animated.View 
        entering={FadeIn.duration(300)}
        exiting={FadeOut.duration(200)}
        className="items-center py-3"
      >
        <View className="bg-white/5 px-4 py-1.5 rounded-full">
          <Text className="text-text-muted text-xs text-center">
            {message.text}
          </Text>
        </View>
      </Animated.View>
    );
  }

  // Determine if message is from current user
  const isOwn = message.isOwn || false;
  
  // Get proximity-based colors
  const bubbleColor = isOwn 
    ? '#A3FF12' // Accent green for own messages
    : '#1A1A1A'; // Dark for others
  
  const textColor = isOwn ? '#0A0A0A' : '#FFFFFF';
  const timeColor = isOwn ? '#0A0A0A80' : '#A1A1AA';

  // Get distance indicator color
  const distanceColor = distance ? getProximityColor(distance) : '#71717A';
  const distanceText = distance ? formatDistance(distance) : null;

  return (
    <Animated.View 
      style={[animatedStyle]}
      className={`py-1.5 px-4 ${isOwn ? 'items-end' : 'items-start'}`}
    >
      {/* Header with username and distance */}
      <View className={`flex-row items-center gap-2 mb-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
        {!isOwn && (
          <Text 
            className="text-sm font-semibold"
            style={{ color: userColor || '#A1A1AA' }}
          >
            {message.username}
          </Text>
        )}
        
        {/* Distance indicator pill */}
        {showDistance && distance && distance <= 1000 && (
          <View 
            className="px-2 py-0.5 rounded-full"
            style={{ backgroundColor: `${distanceColor}20` }}
          >
            <Text className="text-xs" style={{ color: distanceColor }}>
              📍 {distanceText}
            </Text>
          </View>
        )}
        
        <Text className="text-xs" style={{ color: timeColor }}>
          {formatTimestamp(message.timestamp)}
        </Text>

        {isOwn && (
          <Text 
            className="text-sm font-semibold"
            style={{ color: userColor || '#A3FF12' }}
          >
            You
          </Text>
        )}
      </View>

      {/* Message Bubble */}
      <View 
        className="max-w-[80%] rounded-2xl overflow-hidden"
        style={{
          backgroundColor: bubbleColor,
          borderTopLeftRadius: !isOwn && distance && distance < 10 ? 0 : 16,
          borderTopRightRadius: isOwn && distance && distance < 10 ? 0 : 16,
        }}
      >
        {/* Whisper mode indicator (very close distance) */}
        {distance && distance < 10 && (
          <View className="absolute -top-1 -right-1 z-10">
            <Text className="text-xs">🔊</Text>
          </View>
        )}
        
        <Text 
          className="text-base py-2.5 px-3"
          style={{ color: textColor, lineHeight: 20 }}
        >
          {message.text}
        </Text>
      </View>

      {/* Read Receipt (for own messages) */}
      {isOwn && message.timestamp && (
        <View className="flex-row items-center gap-1 mt-1">
          <Text className="text-[10px]" style={{ color: timeColor }}>
            {Math.random() > 0.5 ? '✓✓' : '✓'}
          </Text>
        </View>
      )}
    </Animated.View>
  );
}

export default memo(MessageItem);