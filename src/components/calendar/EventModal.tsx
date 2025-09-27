import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
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
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-900 dark:to-blue-900/20 border-0 shadow-elegant animate-scale-in">
        <DialogHeader className="text-center pb-6">
          <DialogTitle className="text-2xl font-bold bg-gradient-accent bg-clip-text text-transparent">
            Add New Event
          </DialogTitle>
          {selectedDate && (
            <div className="mt-2 p-2 bg-primary/10 rounded-lg border border-primary/20">
              <span className="text-sm font-medium text-primary">
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          )}
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

          <DialogFooter className="gap-3 pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="transition-all duration-200 hover:scale-105"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!formData.title.trim()}
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};