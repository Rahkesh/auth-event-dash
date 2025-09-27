import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { CalendarEvent, EventFormData } from '@/types/event';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  selectedDate: Date | null;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onAddEvent,
  selectedDate
}) => {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    startTime: '09:00',
    endTime: '10:00'
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: '',
        description: '',
        startTime: '09:00',
        endTime: '10:00'
      });
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !formData.title.trim()) return;

    const newEvent: Omit<CalendarEvent, 'id'> = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      date: selectedDate,
      startTime: formData.startTime,
      endTime: formData.endTime,
      color: '#3b82f6'
    };

    onAddEvent(newEvent);
  };

  const handleInputChange = (field: keyof EventFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Add New Event
            {selectedDate && (
              <span className="text-sm font-normal text-muted-foreground block">
                {selectedDate.toLocaleDateString()}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter event title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter event description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.title.trim()}>
              Add Event
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};