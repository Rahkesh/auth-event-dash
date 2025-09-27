import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/calendar/Calendar';
import { Header } from '@/components/layout/Header';
import { CalendarEvent } from '@/types/event';

const CalendarPage: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  // Load events from localStorage on component mount
  useEffect(() => {
    const savedEvents = localStorage.getItem('calendar-events');
    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents).map((event: any) => ({
          ...event,
          date: new Date(event.date)
        }));
        setEvents(parsedEvents);
      } catch (error) {
        console.error('Failed to load events from localStorage:', error);
      }
    }
  }, []);

  // Save events to localStorage whenever events change
  useEffect(() => {
    localStorage.setItem('calendar-events', JSON.stringify(events));
  }, [events]);

  const handleAddEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: crypto.randomUUID(),
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Calendar
          events={events}
          onAddEvent={handleAddEvent}
          onDeleteEvent={handleDeleteEvent}
        />
      </main>
    </div>
  );
};

export default CalendarPage;