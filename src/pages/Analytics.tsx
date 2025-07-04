
import React from 'react';
import { format, subDays, startOfDay } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

const Analytics = () => {
  // Generate some sample data for task completion over time
  const generateTaskCompletionData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      data.push({
        date: format(date, 'MMM d'),
        completed: Math.floor(Math.random() * 8) + 2,
        added: Math.floor(Math.random() * 10) + 5,
      });
    }
    return data;
  };

  const taskCompletionData = generateTaskCompletionData();
  
  // Sample data for the pie charts
  const taskStatusData = [
    { name: 'Completed', value: 53, color: '#10B981' },
    { name: 'In Progress', value: 32, color: '#3B82F6' },
    { name: 'Pending', value: 15, color: '#F59E0B' },
  ];
  
  const taskPriorityData = [
    { name: 'High', value: 35, color: '#EF4444' },
    { name: 'Medium', value: 45, color: '#F59E0B' },
    { name: 'Low', value: 20, color: '#10B981' },
  ];

  // Sample metrics for the summary cards
  const taskMetrics = {
    completionRate: 72,
    completionRateChange: 8,
    avgCompletionTime: '2.4 days',
    avgCompletionTimeChange: -0.3,
    overdueRate: 12,
    overdueRateChange: -5,
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <DashboardHeader 
        title="Analytics" 
        subtitle="Track your task performance and productivity" 
      />
      
      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Task Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">{taskMetrics.completionRate}%</div>
              <div className={`flex items-center ${taskMetrics.completionRateChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {taskMetrics.completionRateChange >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                <span className="text-sm">{Math.abs(taskMetrics.completionRateChange)}%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">compared to last week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Completion Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-500" />
                {taskMetrics.avgCompletionTime}
              </div>
              <div className={`flex items-center ${taskMetrics.avgCompletionTimeChange <= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {taskMetrics.avgCompletionTimeChange <= 0 ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                <span className="text-sm">{Math.abs(taskMetrics.avgCompletionTimeChange)} days</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">compared to last week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overdue Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                {taskMetrics.overdueRate}%
              </div>
              <div className={`flex items-center ${taskMetrics.overdueRateChange <= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {taskMetrics.overdueRateChange <= 0 ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                <span className="text-sm">{Math.abs(taskMetrics.overdueRateChange)}%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">compared to last week</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Task Completion Over Time */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Task Completion Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={taskCompletionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="added" name="Tasks Added" fill="#9b87f5" />
                  <Bar dataKey="completed" name="Tasks Completed" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Task Distribution */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Task Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="status">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="status" className="flex-1">Status</TabsTrigger>
                <TabsTrigger value="priority" className="flex-1">Priority</TabsTrigger>
              </TabsList>
              
              <TabsContent value="status" className="mt-0">
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={taskStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {taskStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              
              <TabsContent value="priority" className="mt-0">
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={taskPriorityData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {taskPriorityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
