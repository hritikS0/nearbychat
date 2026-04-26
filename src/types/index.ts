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
}

export interface User {
  id: string;
  username: string;
  color: string;
  isOnline?: boolean;
}

export type ConnectionState = 'idle' | 'connecting' | 'connected' | 'disconnected';

export type RootStackParamList = {
  Entry: undefined;
  Connecting: undefined;
  NearbyUsers: undefined;
  PrivateChat: {
    userId: string;
    username: string;
    color?: string;
  };
};