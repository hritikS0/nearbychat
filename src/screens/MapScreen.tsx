import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  View, 
  Text, 
  Pressable, 
  Animated, 
  StyleSheet, 
  Modal,
  Dimensions,
  Platform,
  ActivityIndicator
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import Animated as Reanimated, { 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  useSharedValue,
  interpolate,
  Extrapolate,
  FadeIn,
  SlideInUp
} from 'react-native-reanimated';
import { RootStackParamList, User, getProximityZone, formatDistance } from '../types';
import { useChatStore } from '../store/chatStore';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

// Fallback Map component
const MapFallback = ({ children, style }: any) => (
  <View style={[style, { backgroundColor: '#121212', alignItems: 'center', justifyContent: 'center' }]}>
    <View className="items-center px-10">
      <Text className="text-accent text-6xl mb-4">🗺️</Text>
      <Text className="text-text-primary text-xl font-bold text-center">Radar View</Text>
      <Text className="text-text-secondary text-center mt-2">
        Install on a physical device for interactive map
      </Text>
    </View>
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {Array.from({ length: 15 }).map((_, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: 8 + Math.random() * 12,
            height: 8 + Math.random() * 12,
            borderRadius: 999,
            backgroundColor: i % 3 === 0 ? '#A3FF12' : i % 3 === 1 ? '#2DD4BF' : '#4F46E5',
            opacity: 0.3 + Math.random() * 0.5,
          }}
        />
      ))}
    </View>
  </View>
);

const SafeMapView = (props: any) => {
  try {
    if (!MapView) return <MapFallback {...props} />;
    return <MapView {...props} />;
  } catch (e) {
    return <MapFallback {...props} />;
  }
};

type MapScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Map'>;
};

// Enhanced Pulsing Marker with proximity rings
const PulsingMarker = ({ user, onPress, isSelected }: { user: User; onPress: () => void; isSelected: boolean }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.6)).current;
  const ringScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Pulsing animation for the marker
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 2.2,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.6,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(ringScale, {
            toValue: 1.5,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(ringScale, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, []);

  if (!user.location) return null;

  // Get color based on distance
  const getMarkerColor = () => {
    if (user.distance && user.distance < 50) return '#A3FF12';
    if (user.distance && user.distance < 200) return '#2DD4BF';
    return user.color || '#4F46E5';
  };

  const markerColor = getMarkerColor();
  const size = user.distance && user.distance < 50 ? 16 : 12;

  return (
    <Marker
      coordinate={user.location}
      onPress={onPress}
      tracksViewChanges={false}
    >
      <View className="items-center justify-center">
        {/* Outer pulsing ring */}
        <Animated.View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: markerColor,
            transform: [{ scale: ringScale }],
            opacity: opacityAnim,
            position: 'absolute',
          }}
        />
        {/* Middle ring */}
        <Animated.View
          style={{
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: markerColor + '40',
            transform: [{ scale: scaleAnim }],
            position: 'absolute',
          }}
        />
        {/* Core marker */}
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: markerColor,
            borderWidth: isSelected ? 3 : 2,
            borderColor: 'white',
            shadowColor: markerColor,
            shadowOpacity: 0.5,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 0 },
          }}
        />
      </View>
    </Marker>
  );
};

// Animated radar line component
const RadarLine = ({ rotation }: { rotation: Animated.Value }) => {
  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: width * 0.8,
        height: 2,
        backgroundColor: '#A3FF12',
        opacity: 0.3,
        transform: [
          { translateX: -width * 0.4 },
          { rotate: rotation.interpolate({
              inputRange: [0, 360],
              outputRange: ['0deg', '360deg']
            })
          }
        ],
      }}
    />
  );
};

export default function MapScreen({ navigation }: MapScreenProps) {
  const insets = useSafeAreaInsets();
  const nearbyUsers = useChatStore((state) => state.nearbyUsers);
  const user = useChatStore((state) => state.user);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [currentRadius, setCurrentRadius] = useState(500);
  const radarRotation = useRef(new Animated.Value(0)).current;
  const modalTranslateY = useSharedValue(height);
  
  // Animate radar continuously
  useEffect(() => {
    Animated.loop(
      Animated.timing(radarRotation, {
        toValue: 360,
        duration: 8000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  // Animate modal entrance
  useEffect(() => {
    if (selectedUser) {
      modalTranslateY.value = withSpring(0, { damping: 20 });
    } else {
      modalTranslateY.value = withSpring(height);
    }
  }, [selectedUser]);

  const modalAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: modalTranslateY.value }],
  }));

  const initialRegion: Region = {
    latitude: user?.location?.latitude || 37.78825,
    longitude: user?.location?.longitude || -122.4324,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const handleMessage = () => {
    if (selectedUser) {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      const u = selectedUser;
      setSelectedUser(null);
      navigation.navigate('PrivateChat', {
        userId: u.id,
        username: u.username,
        color: u.color,
        distance: u.distance,
      });
    }
  };

  const handleUserSelect = (user: User) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedUser(user);
  };

  const getNearbyStats = () => {
    const online = nearbyUsers.filter(u => u.isOnline).length;
    const veryNear = nearbyUsers.filter(u => u.distance && u.distance < 50).length;
    return { total: nearbyUsers.length, online, veryNear };
  };

  const stats = getNearbyStats();

  return (
    <View className="flex-1 bg-bg-primary">
      <SafeMapView
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFill}
        customMapStyle={darkMapStyle}
        initialRegion={initialRegion}
        onMapReady={() => setMapReady(true)}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {/* Radar overlay (simulated on map) */}
        {user?.location && (
          <Marker coordinate={user.location} flat>
            <View className="items-center justify-center">
              <View className="w-6 h-6 rounded-full bg-accent border-2 border-white shadow-lg" />
              <Reanimated.View 
                entering={FadeIn}
                className="absolute -top-8 bg-black/80 px-2 py-1 rounded-full"
              >
                <Text className="text-accent text-xs">You</Text>
              </Reanimated.View>
            </View>
          </Marker>
        )}

        {nearbyUsers.map((u) => (
          <PulsingMarker 
            key={u.id} 
            user={u} 
            isSelected={selectedUser?.id === u.id}
            onPress={() => handleUserSelect(u)} 
          />
        ))}
      </SafeMapView>

      {/* Radar Scanner Overlay */}
      {mapReady && (
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <RadarLine rotation={radarRotation} />
          <View 
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 4,
              height: 4,
              borderRadius: 2,
              backgroundColor: '#A3FF12',
              transform: [{ translateX: -2 }, { translateY: -2 }],
            }}
          />
        </View>
      )}

      {/* Top Overlay with Radar Info */}
      <Reanimated.View 
        entering={FadeIn.delay(200)}
        className="absolute w-full px-4 flex-row justify-between items-start"
        style={{ top: insets.top + 16 }}
      >
        <LinearGradient
          colors={['rgba(10,10,10,0.9)', 'rgba(10,10,10,0.7)']}
          className="rounded-2xl p-4 border border-white/10"
          style={{ backdropFilter: 'blur(10px)' }}
        >
          <View className="flex-row items-center gap-2 mb-1">
            <View className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <Text className="text-text-primary text-sm font-medium">RADAR ACTIVE</Text>
          </View>
          <Text className="text-text-primary text-2xl font-bold">
            {stats.total} nearby
          </Text>
          <View className="flex-row gap-3 mt-2">
            <Text className="text-text-secondary text-xs">🟢 {stats.online} online</Text>
            <Text className="text-text-secondary text-xs">⚡ {stats.veryNear} &lt;50m</Text>
          </View>
        </LinearGradient>
        
        <Pressable 
          onPress={() => navigation.navigate('Profile')}
          className="w-12 h-12 rounded-full bg-black/80 backdrop-blur-md border border-white/10 items-center justify-center"
        >
          <Text className="text-text-primary text-xl">👤</Text>
        </Pressable>
      </Reanimated.View>

      {/* Range Indicator at Bottom */}
      <Reanimated.View 
        entering={FadeIn.delay(400)}
        className="absolute bottom-24 left-4 right-4"
      >
        <View className="bg-black/80 backdrop-blur-md rounded-full px-4 py-2 border border-white/10">
          <View className="flex-row justify-between mb-1">
            <Text className="text-text-secondary text-xs">Range: 1000m</Text>
            <Text className="text-text-secondary text-xs">📡 Signal: {stats.online > 5 ? 'Strong' : 'Weak'}</Text>
          </View>
          <View className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <View 
              className="h-full rounded-full bg-gradient-to-r from-accent to-proximity-mint"
              style={{ width: `${(stats.online / 20) * 100}%` }}
            />
          </View>
        </View>
      </Reanimated.View>

      {/* View Switcher FAB */}
      <Pressable
        onPress={() => navigation.navigate('NearbyUsers')}
        className="absolute bottom-10 right-6 w-14 h-14 bg-accent rounded-full items-center justify-center shadow-2xl"
        style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
      >
        <Text className="text-black text-2xl font-bold">👥</Text>
      </Pressable>

      {/* Enhanced User Detail Bottom Sheet */}
      <Modal
        visible={!!selectedUser}
        transparent
        animationType="none"
        onRequestClose={() => setSelectedUser(null)}
      >
        <View className="flex-1 justify-end">
          <Pressable 
            className="flex-1 bg-black/60" 
            onPress={() => setSelectedUser(null)} 
          />
          <Reanimated.View 
            style={modalAnimatedStyle}
            className="bg-bg-elevated rounded-t-[40px] overflow-hidden"
          >
            {/* Drag Indicator */}
            <View className="w-12 h-1 bg-white/20 rounded-full self-center my-3" />
            
            {/* User Header */}
            <View className="px-6 pt-2 pb-6">
              <View className="flex-row items-center justify-between mb-6">
                <View className="flex-1">
                  <Text className="text-text-primary text-3xl font-bold mb-1">
                    {selectedUser?.username}
                  </Text>
                  <View className="flex-row items-center gap-2">
                    <View className={`w-2 h-2 rounded-full ${selectedUser?.isOnline ? 'bg-accent' : 'bg-text-muted'}`} />
                    <Text className="text-text-secondary text-sm">
                      {selectedUser?.isOnline ? 'Active now' : 'Offline'}
                    </Text>
                    {selectedUser?.distance && (
                      <>
                        <Text className="text-text-muted">•</Text>
                        <Text 
                          className="text-sm font-medium"
                          style={{ 
                            color: selectedUser.distance < 50 ? '#A3FF12' : 
                                   selectedUser.distance < 200 ? '#2DD4BF' : '#71717A'
                          }}
                        >
                          {formatDistance(selectedUser.distance)} away
                        </Text>
                      </>
                    )}
                  </View>
                </View>
                <View 
                  className="w-20 h-20 rounded-2xl items-center justify-center"
                  style={{ backgroundColor: (selectedUser?.color || '#FFF') + '20' }}
                >
                  <Text className="text-text-primary text-3xl font-bold">
                    {selectedUser?.username.slice(0, 2).toUpperCase()}
                  </Text>
                </View>
              </View>

              {/* Proximity Badge */}
              {selectedUser?.distance && (
                <View className="flex-row items-center gap-2 mb-6 p-3 rounded-xl bg-white/5">
                  <Text className="text-2xl">
                    {selectedUser.distance < 10 ? '🔊' : 
                     selectedUser.distance < 50 ? '📍' : '📡'}
                  </Text>
                  <View className="flex-1">
                    <Text className="text-text-secondary text-xs">Signal strength</Text>
                    <View className="h-1.5 bg-white/10 rounded-full mt-1 overflow-hidden">
                      <View 
                        className="h-full rounded-full"
                        style={{ 
                          width: `${Math.max(10, 100 - (selectedUser.distance / 10))}%`,
                          backgroundColor: selectedUser.distance < 100 ? '#A3FF12' :
                                         selectedUser.distance < 500 ? '#2DD4BF' : '#4F46E5'
                        }}
                      />
                    </View>
                  </View>
                </View>
              )}

              {/* Action Buttons */}
              <View className="flex-row gap-3">
                <Pressable
                  onPress={handleMessage}
                  className="flex-1 bg-accent h-14 rounded-xl items-center justify-center"
                  style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
                >
                  <Text className="text-black font-bold text-base">
                    💬 Message
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    if (Platform.OS !== 'web') {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                    // Optional: Add wave/hello feature
                  }}
                  className="w-14 h-14 rounded-xl bg-white/10 items-center justify-center"
                >
                  <Text className="text-text-primary text-xl">👋</Text>
                </Pressable>
              </View>
            </View>

            {/* Safe area bottom padding */}
            <View style={{ height: insets.bottom }} />
          </Reanimated.View>
        </View>
      </Modal>
    </View>
  );
}

const darkMapStyle = [
  {
    "elementType": "geometry",
    "stylers": [{ "color": "#0A0A0A" }]
  },
  {
    "elementType": "labels.icon",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#757575" }]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [{ "color": "#0A0A0A" }]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [{ "color": "#1A1A1A" }]
  },
  {
    "featureType": "administrative.country",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#9e9e9e" }]
  },
  {
    "featureType": "landscape",
    "elementType": "geometry",
    "stylers": [{ "color": "#0A0A0A" }]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [{ "color": "#0A0A0A" }]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [{ "color": "#1A1A1A" }]
  },
  {
    "featureType": "road",
    "elementType": "geometry.stroke",
    "stylers": [{ "color": "#2A2A2A" }]
  },
  {
    "featureType": "transit",
    "elementType": "geometry",
    "stylers": [{ "color": "#1A1A1A" }]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{ "color": "#000000" }]
  }
];