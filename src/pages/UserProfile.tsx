
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Save, Eye, EyeOff, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useUser } from '@/contexts/UserContext';

const UserProfile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, updateUser, logout } = useUser();
  
  // User profile state
  const [profileData, setProfileData] = useState({
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    phone: user.phone,
    bio: user.bio,
    avatarUrl: user.avatarUrl,
    notifications: {
      email: true,
      app: true,
      marketingEmails: false
    }
  });
  
  // Password state
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  
  // UI states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Random avatar selection
  const avatarOptions = [
    'https://i.pravatar.cc/150?img=1',
    'https://i.pravatar.cc/150?img=5',
    'https://i.pravatar.cc/150?img=10',
    'https://i.pravatar.cc/150?img=15',
    'https://i.pravatar.cc/150?img=20',
    'https://i.pravatar.cc/150?img=25',
    'https://i.pravatar.cc/150?img=30',
    'https://i.pravatar.cc/150?img=35',
    'https://i.pravatar.cc/150?img=40',
    'https://i.pravatar.cc/150?img=45',
  ];
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle notification toggle
  const handleNotificationToggle = (key: keyof typeof profileData.notifications) => {
    setProfileData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };
  
  // Handle password changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setPasswords(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Update the context with the new user data
    updateUser({
      fullName: profileData.fullName,
      email: profileData.email,
      role: profileData.role,
      phone: profileData.phone,
      bio: profileData.bio,
      avatarUrl: profileData.avatarUrl
    });
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    }, 1000);
  };
  
  // Change avatar
  const handleChangeAvatar = (url: string) => {
    setProfileData(prev => ({
      ...prev,
      avatarUrl: url
    }));
    
    // Update the context with the new avatar
    updateUser({
      avatarUrl: url
    });
    
    toast({
      title: "Avatar updated",
      description: "Your profile picture has been updated.",
    });
  };
  
  // Handle password form submission
  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwords.new !== passwords.confirm) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation password must match.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      });
      
      // Reset password fields
      setPasswords({
        current: '',
        new: '',
        confirm: ''
      });
    }, 1000);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
    navigate('/login');
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <DashboardHeader 
        title="Profile" 
        subtitle="Manage your personal information and preferences" 
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your profile information and how others see you
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleProfileUpdate}>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center space-y-2">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={profileData.avatarUrl} alt="Profile" />
                      <AvatarFallback>
                        {profileData.fullName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Camera className="mr-2 h-4 w-4" />
                          Change Avatar
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-64 grid grid-cols-5 gap-1 p-2">
                        {avatarOptions.map((url, index) => (
                          <DropdownMenuItem key={index} className="p-0 cursor-pointer">
                            <button 
                              className="w-full h-full p-1" 
                              onClick={() => handleChangeAvatar(url)}
                            >
                              <Avatar>
                                <AvatarImage src={url} />
                              </Avatar>
                            </button>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input 
                          id="fullName" 
                          name="fullName"
                          value={profileData.fullName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email"
                          name="email" 
                          type="email"
                          value={profileData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Input 
                          id="role"
                          name="role"
                          value={profileData.role}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input 
                          id="phone"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={profileData.bio}
                        onChange={handleInputChange}
                        rows={4}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
          
          {/* Password Section */}
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <form onSubmit={handlePasswordUpdate}>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <div className="relative">
                      <Input 
                        id="current-password" 
                        name="current"
                        type={showCurrentPassword ? "text" : "password"} 
                        placeholder="••••••••"
                        value={passwords.current}
                        onChange={handlePasswordChange}
                      />
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="icon" 
                        className="absolute right-0 top-0 h-full"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative">
                      <Input 
                        id="new-password" 
                        name="new"
                        type={showNewPassword ? "text" : "password"} 
                        placeholder="••••••••"
                        value={passwords.new}
                        onChange={handlePasswordChange}
                      />
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="icon" 
                        className="absolute right-0 top-0 h-full"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Password must be at least 8 characters including a number and a special character
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <div className="relative">
                      <Input 
                        id="confirm-password" 
                        name="confirm"
                        type={showConfirmPassword ? "text" : "password"} 
                        placeholder="••••••••"
                        value={passwords.confirm}
                        onChange={handlePasswordChange}
                      />
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="icon" 
                        className="absolute right-0 top-0 h-full"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSubmitting || !passwords.current || !passwords.new || !passwords.confirm}>
                  {isSubmitting ? 'Updating...' : 'Update Password'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
        
        {/* Right column - Notification preferences */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Control how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium leading-none">Email Notifications</h3>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-tasks">Task Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email reminders for upcoming and overdue tasks
                    </p>
                  </div>
                  <Switch 
                    id="email-tasks" 
                    checked={profileData.notifications.email}
                    onCheckedChange={() => handleNotificationToggle('email')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-marketing">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive promotional emails and newsletters
                    </p>
                  </div>
                  <Switch 
                    id="email-marketing" 
                    checked={profileData.notifications.marketingEmails}
                    onCheckedChange={() => handleNotificationToggle('marketingEmails')}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium leading-none">In-App Notifications</h3>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="app-notifications">App Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications within the application
                    </p>
                  </div>
                  <Switch 
                    id="app-notifications" 
                    checked={profileData.notifications.app}
                    onCheckedChange={() => handleNotificationToggle('app')}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="button" onClick={handleProfileUpdate} disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Preferences'}
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
              <CardDescription>
                Manage your account settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                Export My Data
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Linked Accounts
              </Button>
              <Button variant="destructive" className="w-full justify-start" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserProfile;
