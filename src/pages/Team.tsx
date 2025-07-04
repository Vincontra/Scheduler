
import React from 'react';
import { Mail, Phone, MoreHorizontal, UserPlus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar?: string;
  tasks: number;
  status: 'active' | 'inactive' | 'busy';
}

const Team = () => {
  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'John Smith',
      role: 'Team Lead',
      email: 'john@example.com',
      phone: '(123) 456-7890',
      tasks: 12,
      status: 'active'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      role: 'Designer',
      email: 'sarah@example.com',
      phone: '(234) 567-8901',
      avatar: 'https://i.pravatar.cc/150?img=5',
      tasks: 8,
      status: 'active'
    },
    {
      id: '3',
      name: 'Michael Brown',
      role: 'Developer',
      email: 'michael@example.com',
      phone: '(345) 678-9012',
      avatar: 'https://i.pravatar.cc/150?img=8',
      tasks: 10,
      status: 'busy'
    },
    {
      id: '4',
      name: 'Emily Davis',
      role: 'Researcher',
      email: 'emily@example.com',
      phone: '(456) 789-0123',
      avatar: 'https://i.pravatar.cc/150?img=2',
      tasks: 5,
      status: 'inactive'
    },
    {
      id: '5',
      name: 'David Wilson',
      role: 'Analyst',
      email: 'david@example.com',
      phone: '(567) 890-1234',
      tasks: 7,
      status: 'active'
    },
    {
      id: '6',
      name: 'Jennifer Taylor',
      role: 'Project Manager',
      email: 'jennifer@example.com',
      phone: '(678) 901-2345',
      avatar: 'https://i.pravatar.cc/150?img=6',
      tasks: 15,
      status: 'busy'
    }
  ];

  const getStatusColor = (status: TeamMember['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'inactive':
        return 'bg-gray-400';
      case 'busy':
        return 'bg-orange-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('');
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <DashboardHeader 
        title="Team" 
        subtitle="Manage your team members and their tasks" 
      />
      
      {/* Team Actions */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search team members..."
            className="w-full"
          />
        </div>
        
        <Button>
          <UserPlus className="mr-2 h-4 w-4" /> Add Team Member
        </Button>
      </div>
      
      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teamMembers.map(member => (
          <div 
            key={member.id} 
            className="bg-card rounded-xl p-5 shadow-sm border hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  {member.avatar ? (
                    <AvatarImage src={member.avatar} alt={member.name} />
                  ) : null}
                  <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                </Avatar>
                
                <div>
                  <h3 className="font-medium text-lg flex items-center gap-2">
                    {member.name}
                    <span className={`w-2.5 h-2.5 rounded-full ${getStatusColor(member.status)}`} />
                  </h3>
                  <p className="text-muted-foreground">{member.role}</p>
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>View Profile</DropdownMenuItem>
                  <DropdownMenuItem>Assign Task</DropdownMenuItem>
                  <DropdownMenuItem>Send Message</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    Remove from Team
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{member.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{member.phone}</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t flex justify-between items-center">
              <span className="text-sm font-medium">Assigned Tasks</span>
              <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-medium">
                {member.tasks}
              </span>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Team;
