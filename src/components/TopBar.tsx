import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  withRepeat, 
  withSequence,
  useSharedValue,
  withTiming,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';

interface TopBarProps {
  nearbyCount: number;
  onProfilePress?: () => void;
  showRadar?: boolean;
  currentRadius?: number; // 0-1000m
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function TopBar({ 
  nearbyCount, 
  onProfilePress, 
  showRadar = false,
  currentRadius = 500 
}: TopBarProps) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const radarPulse = useSharedValue(0);
  const countScale = useSharedValue(1);

  // Animation for radar pulse
  React.useEffect(() => {
    if (showRadar) {
      radarPulse.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1500 }),
          withTiming(0, { duration: 1500 })
        ),
        -1,
        false
      );
    }
  }, [showRadar]);

  // Animate count when it changes
  React.useEffect(() => {
    countScale.value = withSequence(
      withSpring(1.5),
      withSpring(1)
    );
  }, [nearbyCount]);

  const radarStyle = useAnimatedStyle(() => ({
    opacity: interpolate(radarPulse.value, [0, 1], [0.3, 1], Extrapolate.CLAMP),
    transform: [{ scale: 1 + radarPulse.value * 0.3 }],
  }));

  const countStyle = useAnimatedStyle(() => ({
    transform: [{ scale: countScale.value }],
  }));

  // Format distance radius display
  const getRadiusText = () => {
    if (currentRadius >= 1000) return '1km';
    return `${currentRadius}m`;
  };

  // Get proximity color based on count
  const getProximityColor = () => {
    if (nearbyCount > 20) return '#A3FF12'; // Acne - active area
    if (nearbyCount > 5) return '#2DD4BF';  // Mint - moderate
    return '#4F46E5'; // Indigo - quiet
  };

  return (
    <LinearGradient
      colors={['rgba(10,10,10,0.95)', 'rgba(18,18,18,0.98)']}
      className="border-b border-white/10"
      style={{ paddingTop: insets.top + 12 }}
    >
      <View className="flex-row items-center justify-between px-4 pb-3">
        {/* Left: Radar/Proximity Status */}
        <Pressable 
          onPress={() => navigation.navigate('Map' as never)}
          className="flex-row items-center gap-2"
        >
          <View className="relative">
            <View className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getProximityColor() }} />
            {showRadar && (
              <Animated.View 
                className="absolute w-2.5 h-2.5 rounded-full bg-accent"
                style={[radarStyle]}
              />
            )}
          </View>
          
          <Animated.Text 
            className="text-text-primary text-sm font-medium"
            style={countStyle}
          >
            {nearbyCount > 0 
              ? `${nearbyCount} nearby` 
              : `Searching ${getRadiusText()} radius`}
          </Animated.Text>
        </Pressable>

        {/* Center: Range Indicator (Visual Bar) */}
        <View className="flex-1 mx-4 max-w-[120px]">
          <View className="h-1 bg-white/10 rounded-full overflow-hidden">
            <Animated.View 
              className="h-full rounded-full"
              style={{
                width: `${(currentRadius / 1000) * 100}%`,
                backgroundColor: getProximityColor(),
              }}
            />
          </View>
        </View>

        {/* Right: Profile & Settings */}
        <View className="flex-row items-center gap-3">
          {/* Signal Strength Indicator */}
          <View className="flex-row gap-0.5">
            {[0, 1, 2].map((bar) => {
              const intensity = nearbyCount > 10 ? 1 : nearbyCount > 5 ? 0.6 : 0.3;
              return (
                <View
                  key={bar}
                  className="w-0.5 rounded-full"
                  style={{
                    height: 8 + bar * 4,
                    backgroundColor: bar < Math.ceil(nearbyCount / 10) 
                      ? getProximityColor() 
                      : '#27272A',
                    opacity: intensity,
                  }}
                />
              );
            })}
          </View>

          <AnimatedPressable
            onPress={() => {
              if (onProfilePress) {
                onProfilePress();
              } else {
                navigation.navigate('Profile' as never);
              }
            }}
            className="p-2 rounded-full bg-white/5"
            whileTap={{ scale: 0.95 }}
          >
            <Text className="text-text-secondary text-lg">👤</Text>
          </AnimatedPressable>
        </View>
      </View>

      {/* Optional: Active Radar Scanner Line */}
      {showRadar && (
        <Animated.View 
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent"
          style={{
            transform: [{ translateX: radarPulse.value * 100 }],
            opacity: radarPulse.value,
          }}
        />
      )}
    </LinearGradient>
  );
}