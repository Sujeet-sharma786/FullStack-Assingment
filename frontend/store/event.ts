import { create } from 'zustand';

interface EventState {
  joinedEventId: string | null;
  setJoinedEventId: (id: string) => void;
}

export const useEventStore = create<EventState>(set => ({
  joinedEventId: null,
  setJoinedEventId: id => set({ joinedEventId: id }),
}));