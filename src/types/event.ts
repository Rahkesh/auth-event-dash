export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;
  startTime: string;
  endTime: string;
  color?: string;
}

export interface EventFormData {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
}