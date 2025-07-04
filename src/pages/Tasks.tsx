
import React, { useState, useEffect } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { Filter, Plus, ListFilter } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import TaskCard, { TaskProps, TaskStatus } from '@/components/dashboard/TaskCard';
import TaskCreateForm from '@/components/dashboard/TaskCreateForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Tasks = () => {
  const [searchParams] = useSearchParams();
  const taskId = searchParams.get('id');
  
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedTaskId, setHighlightedTaskId] = useState<string | null>(null);
  
  const [tasks, setTasks] = useState<TaskProps[]>([
    {
      id: '1',
      title: 'Complete Research Paper',
      description: 'Finalize the research paper on renewable energy sources',
      dueDate: addDays(new Date(), 2),
      priority: 'high',
      status: 'in-progress',
      assignee: 'John Smith',
    },
    {
      id: '2',
      title: 'Prepare Presentation Slides',
      description: 'Create slides for the project presentation next week',
      dueDate: addDays(new Date(), 5),
      priority: 'medium',
      status: 'pending',
      assignee: 'Sarah Johnson',
    },
    {
      id: '3',
      title: 'Submit Math Assignment',
      description: 'Complete and submit the calculus assignment',
      dueDate: subDays(new Date(), 1),
      priority: 'high',
      status: 'pending',
    },
    {
      id: '4',
      title: 'Team Meeting',
      description: 'Weekly project sync-up with the team',
      dueDate: addDays(new Date(), 1),
      priority: 'medium',
      status: 'pending',
      assignee: 'Team',
    },
    {
      id: '5',
      title: 'Read Chapter 5',
      description: 'Read and take notes on chapter 5 of the textbook',
      dueDate: addDays(new Date(), 3),
      priority: 'low',
      status: 'completed',
    },
    {
      id: '6',
      title: 'Lab Report',
      description: 'Write and submit the physics lab report',
      dueDate: addDays(new Date(), 4),
      priority: 'high',
      status: 'in-progress',
    },
    {
      id: '7',
      title: 'Group Project Planning',
      description: 'Plan the timeline and tasks for the group project',
      dueDate: addDays(new Date(), 2),
      priority: 'medium',
      status: 'completed',
      assignee: 'Group 3',
    },
    {
      id: '8',
      title: 'Study for Midterm',
      description: 'Review chapters 1-7 for the upcoming midterm exam',
      dueDate: addDays(new Date(), 7),
      priority: 'high',
      status: 'pending',
    },
  ]);

  // Handle task highlighting based on URL params
  useEffect(() => {
    if (taskId) {
      setHighlightedTaskId(taskId);
      
      // Find the task to show in toast notification
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        toast({
          title: "Task Located",
          description: `Viewing task: ${task.title}`,
        });
        
        // Scroll to the task if needed (in a real app you might use a ref)
        setTimeout(() => {
          const element = document.getElementById(`task-${taskId}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 300);
      }
      
      // Clear the highlight after a few seconds
      const timer = setTimeout(() => {
        setHighlightedTaskId(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [taskId, tasks]);

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter(task => {
    // Filter by search query
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by status
    const matchesStatus = 
      filterStatus === 'all' || task.status === filterStatus;
    
    // Filter by priority
    const matchesPriority = 
      filterPriority === 'all' || task.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleStatusChange = (id: string, newStatus: TaskStatus) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  };

  const handleCreateTask = (data: any) => {
    const newTask: TaskProps = {
      id: `task-${tasks.length + 1}`,
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      priority: data.priority,
      status: data.status,
      assignee: data.assignee,
    };
    
    setTasks(prev => [newTask, ...prev]);
    setCreateDialogOpen(false);
  };

  const clearFilters = () => {
    setFilterStatus('all');
    setFilterPriority('all');
    setSearchQuery('');
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <DashboardHeader title="Tasks" subtitle="Manage and organize all your tasks" />
      
      {/* Filters and Actions */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex gap-3">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <ListFilter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>View Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>
                Show Description
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked>
                Show Due Date
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked>
                Show Assignee
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem onClick={clearFilters}>
                Clear Filters
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> New Task
          </Button>
        </div>
      </div>
      
      {/* Tasks Grid */}
      <div className="bg-card rounded-xl shadow-sm p-4 sm:p-6">
        {filteredTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map(task => (
              <div 
                id={`task-${task.id}`} 
                key={task.id}
                className={`transition-all duration-500 ${
                  highlightedTaskId === task.id 
                    ? "ring-2 ring-primary ring-offset-2 scale-105" 
                    : ""
                }`}
              >
                <TaskCard 
                  task={task} 
                  onStatusChange={handleStatusChange}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-muted rounded-full p-3">
                <Filter className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-medium mb-1">No tasks found</h3>
            <p className="text-muted-foreground">
              {searchQuery || filterStatus !== 'all' || filterPriority !== 'all' ? 
                "Try changing your search or filters" : 
                "Create your first task to get started"
              }
            </p>
            
            {(searchQuery || filterStatus !== 'all' || filterPriority !== 'all') && (
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        )}
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
          />
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Tasks;
