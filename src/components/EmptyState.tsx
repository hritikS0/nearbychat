import React, { useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  withSequence, 
  withTiming,
  useSharedValue,
  interpolate,
  Extrapolate,
  FadeIn,
  SlideInDown
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  actionText?: string;
  onAction?: () => void;
  type?: 'nearby' | 'chat' | 'search' | 'error';
  nearbyRadius?: number;
}

export default function EmptyState({ 
  title = "It's quiet here...",
  subtitle = "Be the first to start a conversation",
  actionText,
  onAction,
  type = 'nearby',
  nearbyRadius = 500
}: EmptyStateProps) {
  const radarRotation = useSharedValue(0);
  const pingScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.6);

  useEffect(() => {
    // Continuous radar animation
    radarRotation.value = withRepeat(
      withTiming(360, { duration: 4000 }),
      -1,
      false
    );
    
    // Ping animation
    pingScale.value = withRepeat(
      withSequence(
        withTiming(1.5, { duration: 1500 }),
        withTiming(1, { duration: 1500 })
      ),
      -1,
      true
    );
    
    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(0.2, { duration: 1500 }),
        withTiming(0.6, { duration: 1500 })
      ),
      -1,
      true
    );
  }, []);

  const radarStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${radarRotation.value}deg` }],
  }));

  const pingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pingScale.value }],
    opacity: pulseOpacity.value,
  }));

  // Get dynamic content based on type
  const getContent = () => {
    switch (type) {
      case 'nearby':
        return {
          icon: '📍',
          title: title,
          subtitle: `No one found within ${nearbyRadius}m. Expand your radius or check back later.`,
          gradientColors: ['#4F46E5', '#2DD4BF'] as const,
        };
      case 'chat':
        return {
          icon: '💬',
          title: title,
          subtitle: 'Start a conversation by selecting a nearby user',
          gradientColors: ['#A3FF12', '#4F46E5'] as const,
        };
      case 'search':
        return {
          icon: '🔍',
          title: 'No results found',
          subtitle: 'Try adjusting your search or filters',
          gradientColors: ['#64748B', '#71717A'] as const,
        };
      case 'error':
        return {
          icon: '⚠️',
          title: 'Something went wrong',
          subtitle: 'Check your connection and try again',
          gradientColors: ['#EF4444', '#F59E0B'] as const,
        };
      default:
        return {
          icon: '🌍',
          title: title,
          subtitle: subtitle,
          gradientColors: ['#A3FF12', '#2DD4BF'] as const,
        };
    }
  };

  const content = getContent();

  return (
    <Animated.View 
      entering={FadeIn.duration(600)}
      className="flex-1 items-center justify-center px-8"
    >
      {/* Radar Animation Container */}
      <View className="relative w-32 h-32 mb-6">
        {/* Radar Background */}
        <View className="absolute inset-0 rounded-full border border-white/10" />
        
        {/* Pulsing Rings */}
        <Animated.View 
          className="absolute inset-0 rounded-full border-2 border-accent/30"
          style={[pingStyle]}
        />
        
        {/* Rotating Radar Line */}
        <Animated.View 
          className="absolute inset-0 items-center justify-center"
          style={radarStyle}
        >
          <LinearGradient
            colors={[content.gradientColors[0], 'transparent']}
            className="absolute top-0 left-1/2 w-16 h-1/2 rounded-t-full"
            style={{ transform: [{ translateX: -32 }] }}
          />
        </Animated.View>
        
        {/* Center Icon */}
        <View className="absolute inset-0 items-center justify-center">
          <Text className="text-4xl">{content.icon}</Text>
        </View>
      </View>

      {/* Text Content */}
      <Animated.View entering={SlideInDown.delay(200).springify()}>
        <Text className="text-text-primary text-2xl font-semibold text-center mb-2">
          {content.title}
        </Text>
        <Text className="text-text-secondary text-base text-center leading-6">
          {content.subtitle}
        </Text>
      </Animated.View>

      {/* Action Button */}
      {actionText && onAction && (
        <Animated.View 
          entering={FadeIn.delay(400)}
          className="mt-8"
        >
          <Pressable
            onPress={onAction}
            className="px-6 py-3 rounded-xl overflow-hidden"
          >
            <LinearGradient
              colors={content.gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="absolute inset-0"
            />
            <Text className="text-black font-semibold text-base text-center">
              {actionText}
            </Text>
          </Pressable>
        </Animated.View>
      )}

      {/* Tips for nearby */}
      {type === 'nearby' && (
        <Animated.View 
          entering={FadeIn.delay(600)}
          className="mt-12 pt-4 border-t border-white/10 w-full"
        >
          <Text className="text-text-muted text-xs text-center mb-2">
            💡 Pro tip: Enable location services for better results
          </Text>
          <Text className="text-text-muted text-xs text-center">
            🤝 Be the first to say hello!
          </Text>
        </Animated.View>
      )}
    </Animated.View>
  );
}