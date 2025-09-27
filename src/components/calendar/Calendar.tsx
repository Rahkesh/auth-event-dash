import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { CalendarEvent } from '@/types/event';
import { EventModal } from './EventModal';
import { EventList } from './EventList';

interface CalendarProps {
  events: CalendarEvent[];
  onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  onDeleteEvent: (id: string) => void;
}

export const Calendar: React.FC<CalendarProps> = ({ events, onAddEvent, onDeleteEvent }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentYear, currentMonth, day);
    setSelectedDate(clickedDate);
    setIsModalOpen(true);
  };

  const handleAddEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    onAddEvent(eventData);
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  const getEventsForDate = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const renderCalendarGrid = () => {
    const days = [];
    
    // Empty cells for days before month starts
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 p-1"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDate(day);
      const isToday = today.getDate() === day && 
                     today.getMonth() === currentMonth && 
                     today.getFullYear() === currentYear;
      
      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(day)}
          className={`h-24 p-1 border border-border cursor-pointer hover:bg-accent transition-colors ${
            isToday ? 'bg-primary/10 border-primary' : ''
          }`}
        >
          <div className={`text-sm font-medium ${isToday ? 'text-primary' : 'text-foreground'}`}>
            {day}
          </div>
          <div className="mt-1 space-y-1">
            {dayEvents.slice(0, 2).map(event => (
              <div
                key={event.id}
                className="text-xs p-1 bg-primary text-primary-foreground rounded truncate"
                title={event.title}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-muted-foreground">
                +{dayEvents.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">
              {monthNames[currentMonth]} {currentYear}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="ml-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-0 border border-border">
            {weekdays.map(day => (
              <div key={day} className="p-2 bg-muted font-medium text-center border-r border-border last:border-r-0">
                {day}
              </div>
            ))}
            {renderCalendarGrid()}
          </div>
        </CardContent>
      </Card>

      <EventList events={events} onDeleteEvent={onDeleteEvent} />

      <EventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDate(null);
        }}
        onAddEvent={handleAddEvent}
        selectedDate={selectedDate}
      />
    </div>
  );
};