import React, { useEffect, useCallback } from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import { useChatStore } from '../store/chatStore';
import TopBar from '../components/TopBar';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import EmptyState from '../components/EmptyState';

const DEMO_MESSAGES = [
  { id: 'demo_1', username: 'void_88', text: 'anyone here?', timestamp: Date.now() - 120000, isOwn: false },
  { id: 'demo_2', username: 'ghost_42', text: 'yeah bro', timestamp: Date.now() - 60000, isOwn: false },
  { id: 'demo_3', username: 'pixel_21', text: 'quiet night', timestamp: Date.now() - 30000, isOwn: false },
];

export default function ChatScreen() {
  const user = useChatStore((state) => state.user);
  const messages = useChatStore((state) => state.messages);
  const nearbyCount = useChatStore((state) => state.nearbyCount);
  const addMessage = useChatStore((state) => state.addMessage);
  const setNearbyCount = useChatStore((state) => state.setNearbyCount);

  const handleSend = useCallback((text: string) => {
    addMessage(text);
  }, [addMessage]);

  const displayMessages = messages.length === 0 && DEMO_MESSAGES.length > 0
    ? DEMO_MESSAGES
    : messages;

  const isEmpty = displayMessages.length === 0;

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-bg-primary"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      <TopBar nearbyCount={nearbyCount} />
      
      {isEmpty ? (
        <EmptyState />
      ) : (
        <MessageList messages={displayMessages} />
      )}
      
      <MessageInput onSend={handleSend} />
    </KeyboardAvoidingView>
  );
}