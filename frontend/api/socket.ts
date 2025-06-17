import { useEffect } from 'react';
import { io } from 'socket.io-client';

const ENDPOINT = 'http://192.168.110.75:4000';
const socket = io(ENDPOINT);

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