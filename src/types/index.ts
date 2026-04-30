// Core Message Types
export interface Message {
  id: string;
  username: string;
  text: string;
  timestamp: number;
  isOwn?: boolean;
  isSystem?: boolean;
}

export interface PrivateMessage {
  id: string;
  text: string;
  senderId: string;
  timestamp: number;
  isOwn: boolean;
  read?: boolean;
  delivered?: boolean;
}

// Enhanced User Types with Proximity Data
export interface User {
  id: string;
  username: string;
  color: string;
  isOnline?: boolean;
  lastSeen?: number;
  location?: Location;
  distance?: number; // in meters
  signalStrength?: SignalStrength;
}

export interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
}

export type SignalStrength = 'strong' | 'medium' | 'weak' | 'none';

// Distance-based enums
export enum ProximityZone {
  WHISPER = 'whisper',    // <10m - very close
  NEAR = 'near',          // 10-100m
  MEDIUM = 'medium',      // 100-500m
  FAR = 'far',            // 500-1000m
  OUT_OF_RANGE = 'out'    // >1000m
}

export interface ProximityData {
  distance: number;
  zone: ProximityZone;
  signalStrength: SignalStrength;
  color: string; // Hex color based on zone
}

// Connection State
export type ConnectionState = 'idle' | 'connecting' | 'connected' | 'disconnected' | 'reconnecting';

export interface ConnectionMetadata {
  latency?: number;
  lastPing?: number;
  reconnectAttempts?: number;
}

// Navigation Types (Enhanced)
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  NearbyUsers: undefined;
  Map: undefined;
  PrivateChat: {
    userId: string;
    username: string;
    color?: string;
    distance?: number;
  };
  Profile: undefined;
};

// Additional UI State Types
export interface ThemeColors {
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  textSecondary: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

// Utility type for distance formatting
export interface DistanceFormatter {
  (meters: number): string;
}

// Helper function to get proximity zone from distance
export const getProximityZone = (distanceMeters: number): ProximityZone => {
  if (distanceMeters < 10) return ProximityZone.WHISPER;
  if (distanceMeters < 100) return ProximityZone.NEAR;
  if (distanceMeters < 500) return ProximityZone.MEDIUM;
  if (distanceMeters < 1000) return ProximityZone.FAR;
  return ProximityZone.OUT_OF_RANGE;
};

// Helper function to get color based on distance
export const getProximityColor = (distanceMeters: number): string => {
  const zone = getProximityZone(distanceMeters);
  switch (zone) {
    case ProximityZone.WHISPER: return '#2DD4BF'; // Mint
    case ProximityZone.NEAR: return '#4F46E5';    // Indigo
    case ProximityZone.MEDIUM: return '#64748B';  // Slate
    case ProximityZone.FAR: return '#71717A';     // Muted
    default: return '#3F3F46';                   // Dark
  }
};

// Helper function to format distance for display
export const formatDistance = (meters: number): string => {
  if (meters < 10) return '<10m';
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
};

// Helper function to get signal strength based on distance
export const getSignalStrength = (distanceMeters: number): SignalStrength => {
  if (distanceMeters < 50) return 'strong';
  if (distanceMeters < 200) return 'medium';
  if (distanceMeters < 1000) return 'weak';
  return 'none';
};