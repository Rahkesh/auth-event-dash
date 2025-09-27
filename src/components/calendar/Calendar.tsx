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
          className={`h-28 p-3 border border-border/30 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:z-10 relative group ${
            isToday 
              ? 'bg-gradient-accent text-white shadow-glow animate-glow' 
              : 'bg-white dark:bg-gray-800 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-700 dark:hover:to-purple-900/30'
          }`}
        >
          <div className={`text-sm font-semibold mb-2 ${
            isToday ? 'text-white' : 'text-foreground group-hover:text-primary transition-colors'
          }`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayEvents.slice(0, 2).map((event, index) => {
              const colors = [
                'bg-gradient-to-r from-purple-500 to-purple-600',
                'bg-gradient-to-r from-blue-500 to-blue-600',
                'bg-gradient-to-r from-green-500 to-green-600',
                'bg-gradient-to-r from-orange-500 to-orange-600',
                'bg-gradient-to-r from-pink-500 to-pink-600',
              ];
              return (
                <div
                  key={event.id}
                  className={`text-xs p-1.5 text-white rounded-md truncate shadow-sm ${colors[index % colors.length]} transition-all hover:shadow-md`}
                  title={event.title}
                >
                  {event.title}
                </div>
              );
            })}
            {dayEvents.length > 2 && (
              <div className="text-xs text-muted-foreground font-medium bg-gray-100 dark:bg-gray-700 px-1.5 py-1 rounded-md">
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
    <div className="space-y-8 animate-fade-in">
      <Card className="shadow-card border-0 bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-900 dark:to-purple-900/20 overflow-hidden">
        <CardHeader className="bg-gradient-primary text-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold text-white">
                {monthNames[currentMonth]} {currentYear}
              </CardTitle>
              <p className="text-white/80 text-sm mt-1">
                {events.length} event{events.length !== 1 ? 's' : ''} this month
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => navigateMonth('prev')}
                className="bg-white/20 backdrop-blur-sm border border-white/10 text-white hover:bg-white/30 transition-all duration-300"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => navigateMonth('next')}
                className="bg-white/20 backdrop-blur-sm border border-white/10 text-white hover:bg-white/30 transition-all duration-300"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="ml-2 bg-white text-primary hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-7 gap-0">
            {weekdays.map(day => (
              <div key={day} className="p-4 bg-gradient-to-r from-gray-50 to-blue-50/50 dark:from-gray-800 dark:to-purple-800/30 font-semibold text-center border-r border-border/50 last:border-r-0 text-muted-foreground">
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