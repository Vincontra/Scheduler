
import React, { useState } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { 
  CheckSquare, 
  Clock, 
  ListTodo, 
  Users,
  Plus
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatCard from '@/components/dashboard/StatCard';
import TaskCard, { TaskProps, TaskStatus } from '@/components/dashboard/TaskCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import TaskCreateForm from '@/components/dashboard/TaskCreateForm';

const Dashboard = () => {
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
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
  ]);

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

  // Dashboard statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  
  // Task filter tabs
  const allTasks = tasks;
  const todayTasks = tasks.filter(task => 
    format(task.dueDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  );
  const upcomingTasks = tasks.filter(task => 
    task.dueDate > new Date() && 
    format(task.dueDate, 'yyyy-MM-dd') !== format(new Date(), 'yyyy-MM-dd')
  );
  const overdueTasks = tasks.filter(task => 
    task.dueDate < new Date() && task.status !== 'completed'
  );

  return (
    <DashboardLayout>
      {/* Header */}
      <DashboardHeader 
        title="Dashboard" 
        subtitle={`Welcome back, today is ${format(new Date(), 'EEEE, MMMM d')}`} 
      />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Total Tasks"
          value={totalTasks}
          icon={ListTodo}
          trend={{ value: 5, positive: true }}
          className="border-l-4 border-l-blue"
        />
        <StatCard 
          title="In Progress"
          value={inProgressTasks}
          icon={Clock}
          trend={{ value: 3, positive: true }}
          className="border-l-4 border-l-teal"
        />
        <StatCard 
          title="Completed"
          value={completedTasks}
          icon={CheckSquare}
          trend={{ value: 2, positive: true }}
          className="border-l-4 border-l-task-low"
        />
        <StatCard 
          title="Team Members"
          value={4}
          icon={Users}
          className="border-l-4 border-l-blue-dark"
        />
      </div>
      
      {/* Tasks */}
      <div className="bg-card rounded-xl shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-xl font-semibold">Your Tasks</h2>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add New Task
          </Button>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All ({allTasks.length})</TabsTrigger>
            <TabsTrigger value="today">Today ({todayTasks.length})</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming ({upcomingTasks.length})</TabsTrigger>
            <TabsTrigger value="overdue" className="text-task-high">Overdue ({overdueTasks.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allTasks.length > 0 ? (
                allTasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onStatusChange={handleStatusChange}
                  />
                ))
              ) : (
                <p className="col-span-full text-center py-8 text-muted-foreground">
                  No tasks found
                </p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="today" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {todayTasks.length > 0 ? (
                todayTasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onStatusChange={handleStatusChange}
                  />
                ))
              ) : (
                <p className="col-span-full text-center py-8 text-muted-foreground">
                  No tasks due today
                </p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="upcoming" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingTasks.length > 0 ? (
                upcomingTasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onStatusChange={handleStatusChange}
                  />
                ))
              ) : (
                <p className="col-span-full text-center py-8 text-muted-foreground">
                  No upcoming tasks
                </p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="overdue" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {overdueTasks.length > 0 ? (
                overdueTasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onStatusChange={handleStatusChange}
                  />
                ))
              ) : (
                <p className="col-span-full text-center py-8 text-muted-foreground">
                  No overdue tasks
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
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

export default Dashboard;
