import React, { createContext, useContext, useState, useEffect, type ReactNode, } from 'react';
import { useNavigate } from 'react-router-dom';

interface SessionContextType {
  isAuthenticated: boolean;
  userRole: string | null;
  login: (token: string, role: string) => void;
  logout: () => void;
  extendSession: () => void;
  timeRemaining: number;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

interface SessionProviderProps {
  children: ReactNode;
}

const SESSION_DURATION = 50 * 60 * 1000; // 5 minutes in milliseconds

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(SESSION_DURATION);
  const [sessionTimeout, setSessionTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const navigate = useNavigate();

  // Initialize session from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');
    const sessionStart = localStorage.getItem('sessionStart');
    
    if (token && role && sessionStart) {
      const elapsed = Date.now() - parseInt(sessionStart);
      const remaining = SESSION_DURATION - elapsed;
      
      if (remaining > 0) {
        setIsAuthenticated(true);
        setUserRole(role);
        setTimeRemaining(remaining);
        startSessionTimer(remaining);
      } else {
        // Session expired, clear storage
        clearSession();
      }
    }
  }, []);

  const startSessionTimer = (duration: number = SESSION_DURATION) => {
    // Clear existing timeout
    if (sessionTimeout) {
      clearTimeout(sessionTimeout);
    }

    const timeout = setTimeout(() => {
      logout();
    }, duration);

    setSessionTimeout(timeout);

    // Update time remaining every second
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1000) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    // Clean up interval when component unmounts or session ends
    return () => clearInterval(interval);
  };

  const login = (token: string, role: string) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setTimeRemaining(SESSION_DURATION);
    
    // Store in localStorage
    localStorage.setItem('authToken', token);
    localStorage.setItem('userRole', role);
    localStorage.setItem('sessionStart', Date.now().toString());
    
    // Start session timer
    startSessionTimer();
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setTimeRemaining(0);
    
    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('sessionStart');
    localStorage.removeItem('keepSignedIn');
    
    // Clear timeout
    if (sessionTimeout) {
      clearTimeout(sessionTimeout);
      setSessionTimeout(null);
    }
    
    // Navigate to home page
    navigate('/');
  };

  const extendSession = () => {
    if (isAuthenticated) {
      setTimeRemaining(SESSION_DURATION);
      localStorage.setItem('sessionStart', Date.now().toString());
      startSessionTimer();
    }
  };

  const clearSession = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('sessionStart');
    localStorage.removeItem('keepSignedIn');
    setIsAuthenticated(false);
    setUserRole(null);
    setTimeRemaining(0);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (sessionTimeout) {
        clearTimeout(sessionTimeout);
      }
    };
  }, [sessionTimeout]);

  const value: SessionContextType = {
    isAuthenticated,
    userRole,
    login,
    logout,
    extendSession,
    timeRemaining,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

// Helper function to format time remaining
export const formatTimeRemaining = (milliseconds: number): string => {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};
