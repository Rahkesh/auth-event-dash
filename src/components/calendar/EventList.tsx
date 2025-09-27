import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Clock } from 'lucide-react';
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
      <Card>
        <CardHeader>
          <CardTitle>Your Events</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No events yet. Click on a date to add your first event!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Events ({upcomingEvents.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {upcomingEvents.map(event => (
            <div
              key={event.id}
              className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium">{event.title}</h4>
                  <Badge variant="outline" className="text-xs">
                    {event.date.toLocaleDateString()}
                  </Badge>
                </div>
                {event.description && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {event.description}
                  </p>
                )}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {event.startTime} - {event.endTime}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDeleteEvent(event.id)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
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