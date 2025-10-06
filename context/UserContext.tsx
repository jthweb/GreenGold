import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface UserContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  signUp: (email: string, password: string) => boolean;
  logout: () => void;
  isOnboarded: boolean;
  completeOnboarding: () => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isOnboarded, setIsOnboarded] = useState(false);

  useEffect(() => {
    // Check for saved user session
    const savedUser = localStorage.getItem('greengold_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      // Check onboarding status for this user
      const onboardingKey = `greengold_onboarded_${parsedUser.email}`;
      const hasBeenOnboarded = localStorage.getItem(onboardingKey) === 'true';
      setIsOnboarded(hasBeenOnboarded);
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    // Mock login logic
    if (email && password) {
      const loggedInUser: User = { name: 'Jassim Al-Thani', email };
      setUser(loggedInUser);
      localStorage.setItem('greengold_user', JSON.stringify(loggedInUser));
      
      const onboardingKey = `greengold_onboarded_${email}`;
      const hasBeenOnboarded = localStorage.getItem(onboardingKey) === 'true';
      setIsOnboarded(hasBeenOnboarded);
      return true;
    }
    return false;
  };

  const signUp = (email: string, password: string): boolean => {
    // Mock sign-up logic
     if (email && password) {
      const newUser: User = { name: 'New Farmer', email };
      setUser(newUser);
      localStorage.setItem('greengold_user', JSON.stringify(newUser));
      setIsOnboarded(false); // New users always need onboarding
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('greengold_user');
  };

  const completeOnboarding = () => {
      if(user){
        const onboardingKey = `greengold_onboarded_${user.email}`;
        localStorage.setItem(onboardingKey, 'true');
        setIsOnboarded(true);
      }
  };

  const value = { user, login, signUp, logout, isOnboarded, completeOnboarding };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
