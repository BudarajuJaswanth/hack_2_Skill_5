import { useContext } from 'react';
import { EventContext } from './EventContextInstance';

export function useEventContext() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEventContext must be used within an EventProvider');
  }
  return context;
}
