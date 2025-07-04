
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface UserContextType {
  user: UserData;
  updateUser: (data: Partial<UserData>) => void;
  isLoggedIn: boolean;
  login: (userData: UserData) => void;
  logout: () => void;
}

export interface UserData {
  fullName: string;
  email: string;
  role: string;
  phone: string;
  bio: string;
  avatarUrl: string;
}

const defaultUserData: UserData = {
  fullName: 'John Smith',
  email: 'john@example.com',
  role: 'Student',
  phone: '(123) 456-7890',
  bio: 'Computer Science student with interests in machine learning and web development.',
  avatarUrl: 'https://i.pravatar.cc/150?img=30'
};

// Keys for localStorage
const USER_DATA_KEY = 'taskmaster_user_data';
const USER_AUTH_KEY = 'taskmaster_auth_status';

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state from localStorage if available, otherwise use defaults
  const [user, setUser] = useState<UserData>(() => {
    const savedUser = localStorage.getItem(USER_DATA_KEY);
    return savedUser ? JSON.parse(savedUser) : defaultUserData;
  });
  
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const savedAuthStatus = localStorage.getItem(USER_AUTH_KEY);
    return savedAuthStatus ? JSON.parse(savedAuthStatus) : true; // Default to logged in for this example
  });

  // Save to localStorage whenever user data changes
  useEffect(() => {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
  }, [user]);

  // Save to localStorage whenever auth status changes
  useEffect(() => {
    localStorage.setItem(USER_AUTH_KEY, JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  const updateUser = (data: Partial<UserData>) => {
    setUser(prev => ({ ...prev, ...data }));
  };

  const login = (userData: UserData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
    // We don't reset the user data since we might want to keep it in memory
  };

  return (
    <UserContext.Provider value={{ user, updateUser, isLoggedIn, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
