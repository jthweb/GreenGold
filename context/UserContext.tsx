import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, FarmDetails } from '../types';

interface UserContextType {
    user: User | null;
    needsOnboarding: boolean;
    login: (email: string, pass: string) => boolean;
    logout: () => void;
    signUp: (email: string, pass: string) => boolean;
    completeOnboarding: (details: FarmDetails) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

const USERS_DB_KEY = 'greengold_users';
const CURRENT_USER_KEY = 'greengold_currentUser';

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [needsOnboarding, setNeedsOnboarding] = useState(false);

    useEffect(() => {
        const loggedInUserEmail = localStorage.getItem(CURRENT_USER_KEY);
        if (loggedInUserEmail) {
            const users: User[] = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]');
            const foundUser = users.find(u => u.email === loggedInUserEmail);
            if (foundUser) {
                setUser(foundUser);
                if (!foundUser.farmName) {
                    setNeedsOnboarding(true);
                }
            }
        }
    }, []);

    const login = (email: string, pass: string): boolean => {
        const users: User[] = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]');
        const foundUser = users.find(u => u.email === email && u.password === pass);
        if (foundUser) {
            setUser(foundUser);
            localStorage.setItem(CURRENT_USER_KEY, foundUser.email);
            if (!foundUser.farmName) {
                setNeedsOnboarding(true);
            }
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem(CURRENT_USER_KEY);
    };

    const signUp = (email: string, pass: string): boolean => {
        const users: User[] = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]');
        if (users.some(u => u.email === email)) {
            return false; // User already exists
        }
        const newUser: User = { email, password: pass, farmName: '', farmSize: 0, primaryCrops: '' };
        users.push(newUser);
        localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
        setUser(newUser);
        localStorage.setItem(CURRENT_USER_KEY, newUser.email);
        setNeedsOnboarding(true);
        return true;
    };
    
    const completeOnboarding = (details: FarmDetails) => {
        if (!user) return;
        
        const updatedUser = { ...user, ...details };
        setUser(updatedUser);

        const users: User[] = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]');
        const userIndex = users.findIndex(u => u.email === user.email);
        if (userIndex !== -1) {
            users[userIndex] = updatedUser;
            localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
        }
        
        setNeedsOnboarding(false);
    };


    const value = { user, needsOnboarding, login, logout, signUp, completeOnboarding };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};