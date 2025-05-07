
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LessonProgress } from './types';
import { getApiKey } from './api';

interface AppContextType {
  user: User | null;
  isApiKeySet: boolean;
  updateProgress: (lessonId: string, score: number) => void;
  resetProgress: () => void;
  setApiKeyAndCheck: (key: string) => void;
}

const defaultUser: User = {
  id: 'default-user',
  name: 'Learner',
  progress: [],
  level: 'Beginner',
  streak: 0,
  points: 0
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isApiKeySet, setIsApiKeySet] = useState(false);

  useEffect(() => {
    // Load user data from localStorage
    const savedUser = localStorage.getItem('oromifaUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      setUser(defaultUser);
      localStorage.setItem('oromifaUser', JSON.stringify(defaultUser));
    }
    
    // Check if API key is set
    setIsApiKeySet(!!getApiKey());
  }, []);

  const updateProgress = (lessonId: string, score: number) => {
    if (!user) return;

    const newProgress = [...user.progress];
    const existingProgress = newProgress.findIndex(p => p.lessonId === lessonId);
    
    if (existingProgress >= 0) {
      newProgress[existingProgress] = {
        ...newProgress[existingProgress],
        score: Math.max(score, newProgress[existingProgress].score),
        completed: true,
        lastAttempt: new Date().toISOString()
      };
    } else {
      newProgress.push({
        lessonId,
        score,
        completed: true,
        lastAttempt: new Date().toISOString()
      });
    }

    // Calculate new points
    const newPoints = user.points + score;
    
    const updatedUser = {
      ...user,
      progress: newProgress,
      points: newPoints
    };

    setUser(updatedUser);
    localStorage.setItem('oromifaUser', JSON.stringify(updatedUser));
  };

  const resetProgress = () => {
    setUser(defaultUser);
    localStorage.setItem('oromifaUser', JSON.stringify(defaultUser));
  };
  
  const setApiKeyAndCheck = (key: string) => {
    import('./api').then(({ setApiKey }) => {
      setApiKey(key);
      setIsApiKeySet(!!key);
    });
  };

  return (
    <AppContext.Provider value={{ 
      user, 
      isApiKeySet,
      updateProgress,
      resetProgress,
      setApiKeyAndCheck
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
