
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  userRole: string | null;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  
  // Check if user is already authenticated on mount
  useEffect(() => {
    const storedAuth = sessionStorage.getItem('auth');
    const storedRole = sessionStorage.getItem('userRole');
    
    if (storedAuth) {
      setIsAuthenticated(true);
      if (storedRole) {
        setUserRole(storedRole);
        setIsAdmin(storedRole === 'ADMIN');
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Create basic auth header
      const credentials = btoa(`${username}:${password}`);
      
      console.log('Attempting login with credentials for user:', username);
      const response = await fetch('/admin', {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include'
      });
      
      console.log('Login response status:', response.status);

      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.error('Login error: Server returned non-JSON response');
          setIsAuthenticated(false);
          setUserRole(null);
          setIsAdmin(false);
          return false;
        }
        
        try {
          const data = await response.json();
          console.log('Login response data:', data);
          
          if (data && (data.success === true || (data.success === undefined && response.ok))) {
            setIsAuthenticated(true);
            sessionStorage.setItem('auth', credentials);
            
            const role = username.toLowerCase() === 'admin' ? 'ADMIN' : 'USER';
            setUserRole(role);
            setIsAdmin(role === 'ADMIN');
            sessionStorage.setItem('userRole', role);
            
            return true;
          } else {
            console.error('Authentication failed: Server did not confirm authentication');
            setIsAuthenticated(false);
            setUserRole(null);
            setIsAdmin(false);
            return false;
          }
        } catch (parseError) {
          console.error('Login error: Failed to parse JSON response', parseError);
          setIsAuthenticated(false);
          setUserRole(null);
          setIsAdmin(false);
          return false;
        }
      } else {
        setIsAuthenticated(false);
        setUserRole(null);
        setIsAdmin(false);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear state immediately
    setIsAuthenticated(false);
    setUserRole(null);
    setIsAdmin(false);
    
    // Clear session storage
    sessionStorage.removeItem('auth');
    sessionStorage.removeItem('userRole');
    
    // Show logout toast notification
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
      variant: "default"
    });
    
    // Navigate to home and force a clean state
    navigate('/home', { replace: true });
    
    // Call logout endpoint
    fetch('/logout', {
      method: 'POST',
      credentials: 'include'
    }).catch(console.error);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      login, 
      logout, 
      isLoading, 
      userRole, 
      isAdmin 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
