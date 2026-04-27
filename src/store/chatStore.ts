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
  isAuthenticated: boolean;
  messages: Message[];
  connectionState: ConnectionState;
  nearbyUsers: User[];
  
  setUser: (username: string) => void;
  login: () => void;
  register: () => void;
  logout: () => void;
  addMessage: (text: string) => void;
  setConnectionState: (state: ConnectionState) => void;
  clearMessages: () => void;
}

const MOCK_LOCATIONS = [
  { latitude: 37.78825, longitude: -122.4324 },
  { latitude: 37.78925, longitude: -122.4334 },
  { latitude: 37.78725, longitude: -122.4314 },
  { latitude: 37.79025, longitude: -122.4344 },
  { latitude: 37.78625, longitude: -122.4304 },
  { latitude: 37.78525, longitude: -122.4294 },
];

export const useChatStore = create<ChatState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  messages: [],
  connectionState: 'idle',
  nearbyUsers: [],

  setUser: (username: string) => {
    const userId = generateUserId();
    const color = USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)];
    
    const nearby = ['ghost_21', 'void_88', 'pixel_42', 'shadow_99', 'echo_17', 'drift_33'].map((name, i) => ({
      id: `mock_${i}`,
      username: name,
      color: USER_COLORS[i % USER_COLORS.length],
      isOnline: true,
      location: MOCK_LOCATIONS[i],
    }));

    set({
      user: { id: userId, username, color },
      isAuthenticated: true,
      nearbyUsers: nearby,
      connectionState: 'connected',
    });
  },

  login: () => {
    // Mock login logic
    get().setUser(generateUsername());
  },

  register: () => {
    // Mock register logic
    get().setUser(generateUsername());
  },

  logout: () => {
    set({ user: null, isAuthenticated: false, connectionState: 'idle' });
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

  clearMessages: () => {
    set({ messages: [] });
  },
}));