import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthState } from '../../types';
import { storageService, apiClient } from '../../services';

interface AuthContextType extends AuthState {
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    loadStoredToken();
  }, []);

  const loadStoredToken = async () => {
    try {
      const storedToken = await storageService.getToken();
      if (storedToken) {
        setAuthState({
          token: storedToken,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        setAuthState({
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Error loading stored token:', error);
      setAuthState({
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  const login = async (token: string) => {
    try {
      await storageService.setToken(token);
      setAuthState({
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await storageService.removeToken();
      setAuthState({
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};