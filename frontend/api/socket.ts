import { useEffect } from 'react';
import { io } from 'socket.io-client';

// Use your backend URL here (local IP or Render URL)
export const socket = io('http://192.168.110.75:4000'); // or your Render URL

export function useSocket(eventId: string, onUpdate: () => void) {
  useEffect(() => {
    if (!eventId) return;
    socket.emit('joinRoom', eventId);
    socket.on('attendeesUpdated', onUpdate);

    return () => {
      socket.emit('leaveRoom', eventId);
      socket.off('attendeesUpdated', onUpdate);
    };
  }, [eventId, onUpdate]);
}