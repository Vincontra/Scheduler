
import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import TaskCreateForm from '@/components/dashboard/TaskCreateForm';
import { TaskProps } from '@/components/dashboard/TaskCard';

interface Event {
  id: string;
  title: string;
  date: Date;
  type: 'task' | 'meeting' | 'reminder';
}

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Team Meeting',
      date: addDays(new Date(), 1),
      type: 'meeting'
    },
    {
      id: '2',
      title: 'Project Deadline',
      date: addDays(new Date(), 3),
      type: 'task'
    },
    {
      id: '3',
      title: 'Study Group',
      date: addDays(new Date(), -1),
      type: 'meeting'
    },
    {
      id: '4',
      title: 'Assignment Due',
      date: addDays(new Date(), 5),
      type: 'task'
    },
    {
      id: '5',
      title: 'Exam Preparation',
      date: addDays(new Date(), 2),
      type: 'reminder'
    }
  ]);

  // Helper to get events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      isSameDay(event.date, date)
    );
  };

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleCreateTask = (data: any) => {
    // Add the new task as an event
    const newEvent: Event = {
      id: `event-${events.length + 1}`,
      title: data.title,
      date: data.dueDate,
      type: 'task'
    };
    
    setEvents(prev => [...prev, newEvent]);
    setCreateDialogOpen(false);
  };

  // Generate the calendar grid
  const renderCalendarGrid = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    // Add header row with days of week
    const daysOfWeek = [];
    for (let i = 0; i < 7; i++) {
      daysOfWeek.push(
        <div key={`header-${i}`} className="font-medium text-center py-2">
          {format(addDays(startOfWeek(new Date()), i), 'EEE')}
        </div>
      );
    }
    rows.push(<div key="header" className="grid grid-cols-7">{daysOfWeek}</div>);

    // Add date cells
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        const dayEvents = getEventsForDate(day);
        
        days.push(
          <div 
            key={day.toString()} 
            className={`min-h-[120px] p-2 border hover:bg-accent/50 transition-colors cursor-pointer
              ${!isSameMonth(day, monthStart) ? "text-muted-foreground bg-muted/50" : ""}
              ${isSameDay(day, new Date()) ? "bg-accent text-accent-foreground" : ""}
              ${isSameDay(day, selectedDate as Date) ? "ring-2 ring-primary" : ""}
            `}
            onClick={() => handleDateSelect(cloneDay)}
          >
            <div className="font-medium">{formattedDate}</div>
            <div className="mt-1 space-y-1 overflow-y-auto max-h-[80px]">
              {dayEvents.map(event => (
                <div 
                  key={event.id}
                  className={`text-xs rounded px-1 py-0.5 truncate
                    ${event.type === 'task' ? 'bg-blue-100 text-blue-800' : 
                      event.type === 'meeting' ? 'bg-purple-100 text-purple-800' : 
                      'bg-amber-100 text-amber-800'}
                  `}
                >
                  {event.title}
                </div>
              ))}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 border-t">
          {days}
        </div>
      );
      days = [];
    }

    return <div>{rows}</div>;
  };

  // Display events for selected date
  const renderSelectedDateEvents = () => {
    if (!selectedDate) return null;
    
    const dateEvents = getEventsForDate(selectedDate);
    
    return (
      <div className="bg-card rounded-xl p-4 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-lg">
            {format(selectedDate, 'MMMM d, yyyy')}
          </h3>
          <Button size="sm" onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-1" /> Add Task
          </Button>
        </div>
        
        {dateEvents.length > 0 ? (
          <div className="space-y-3">
            {dateEvents.map(event => (
              <div key={event.id} className="flex items-start p-3 bg-background rounded-lg border">
                <Badge variant={
                  event.type === 'task' ? 'default' : 
                  event.type === 'meeting' ? 'secondary' : 
                  'outline'
                }>
                  {event.type}
                </Badge>
                <div className="ml-3">
                  <h4 className="font-medium">{event.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {format(event.date, 'h:mm a')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-8 text-muted-foreground">
            No events scheduled for this day
          </p>
        )}
      </div>
    );
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <DashboardHeader 
        title="Calendar" 
        subtitle="Manage your schedule and deadlines" 
      />
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar Section */}
        <div className="flex-1">
          <div className="bg-card rounded-xl p-4 shadow-sm mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={handlePrevMonth}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleNextMonth}>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {renderCalendarGrid()}
          </div>
        </div>
        
        {/* Selected Date Events */}
        <div className="w-full lg:w-80">
          {renderSelectedDateEvents()}
        </div>
      </div>

      {/* Create Task Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <TaskCreateForm 
            onSubmit={handleCreateTask}
            onCancel={() => setCreateDialogOpen(false)}
            initialDate={selectedDate}
          />
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default CalendarPage;
