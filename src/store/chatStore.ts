import { create } from 'zustand';
import { Message, ConnectionState, User } from '../types';

const USER_COLORS = [
  '#F472B6', // pink
  '#60A5FA', // blue
  '#34D399', // green
  '#FBBF24', // amber
  '#A78BFA', // purple
  '#FB923C', // orange
];

const generateUsername = (): string => {
  const prefixes = ['ghost', 'void', 'pixel', 'shadow', 'echo', 'drift'];
  const suffix = Math.floor(Math.random() * 99) + 1;
  return `${prefixes[Math.floor(Math.random() * prefixes.length)]}_${suffix}`;
};

const generateUserId = (): string => {
  return `user_${Math.random().toString(36).substring(2, 9)}`;
};

interface ChatState {
  user: User | null;
  messages: Message[];
  connectionState: ConnectionState;
  nearbyCount: number;
  
  setUser: () => void;
  addMessage: (text: string) => void;
  setConnectionState: (state: ConnectionState) => void;
  setNearbyCount: (count: number) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  user: null,
  messages: [],
  connectionState: 'idle',
  nearbyCount: 0,

  setUser: () => {
    const existingUser = get().user;
    if (existingUser) return;
    
    const userId = generateUserId();
    const username = generateUsername();
    const color = USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)];
    
    set({
      user: { id: userId, username, color },
      connectionState: 'connecting',
    });
  },

  addMessage: (text: string) => {
    const { user } = get();
    if (!text.trim() || !user) return;
    
    const newMessage: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      username: user.username,
      text: text.trim(),
      timestamp: Date.now(),
      isOwn: true,
    };
    
    set((state) => ({
      messages: [...state.messages, newMessage].slice(-50),
    }));
  },

  setConnectionState: (connectionState: ConnectionState) => {
    set({ connectionState });
  },

  setNearbyCount: (nearbyCount: number) => {
    set({ nearbyCount });
  },

  clearMessages: () => {
    set({ messages: [] });
  },
}));