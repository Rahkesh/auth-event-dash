import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Clock, Calendar } from 'lucide-react';
import { CalendarEvent } from '@/types/event';

interface EventListProps {
  events: CalendarEvent[];
  onDeleteEvent: (id: string) => void;
}

export const EventList: React.FC<EventListProps> = ({ events, onDeleteEvent }) => {
  const upcomingEvents = events
    .filter(event => event.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  if (events.length === 0) {
    return (
      <Card className="shadow-card border-0 bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-900 dark:to-blue-900/20 overflow-hidden">
        <CardHeader className="bg-gradient-secondary border-b text-center">
          <CardTitle className="text-xl font-bold bg-gradient-accent bg-clip-text text-transparent">
            Your Events
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <div>
              <p className="text-muted-foreground text-lg mb-2">
                No events yet
              </p>
              <p className="text-sm text-muted-foreground">
                Click on a date to add your first event and get started!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card border-0 bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-900 dark:to-blue-900/20 overflow-hidden">
      <CardHeader className="bg-gradient-secondary border-b">
        <CardTitle className="text-xl font-bold bg-gradient-accent bg-clip-text text-transparent">
          Upcoming Events ({upcomingEvents.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {upcomingEvents.map((event, index) => {
            const gradients = [
              'from-purple-500 to-purple-600',
              'from-blue-500 to-blue-600', 
              'from-green-500 to-green-600',
              'from-orange-500 to-orange-600',
              'from-pink-500 to-pink-600',
            ];
            return (
              <div
                key={event.id}
                className="group relative overflow-hidden rounded-xl border border-border/50 bg-white dark:bg-gray-800 p-4 shadow-card hover:shadow-elegant transition-all duration-300 hover:scale-[1.02] animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${gradients[index % gradients.length]}`} />
                <div className="flex items-center justify-between">
                  <div className="flex-1 ml-3">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-lg group-hover:text-primary transition-colors">{event.title}</h4>
                      <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                        {event.date.toLocaleDateString()}
                      </Badge>
                    </div>
                    {event.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {event.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="font-medium">{event.startTime} - {event.endTime}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteEvent(event.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200 hover:scale-110"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
          
          {events.length > 5 && (
            <p className="text-sm text-muted-foreground text-center pt-2">
              And {events.length - 5} more events...
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};