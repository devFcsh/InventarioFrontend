import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  attributes?: Record<string, any>;
  authenticatedAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Usuario quemado para desarrollo
  const hardcodedUser: User = {
    id: "1",
    username: "devuser",
    authenticatedAt: new Date().toISOString(),
    attributes: { email: "devuser@ejemplo.com", displayName: "Usuario Dev" }
  };

  const [user, setUser] = useState<User | null>(hardcodedUser);
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = !!user;

  // checkAuth solo setea el usuario quemado
  const checkAuth = async () => {
    setIsLoading(true);
    setUser(hardcodedUser);
    setIsLoading(false);
  };

  const login = () => {
    // Solo simula login en desarrollo
    setUser(hardcodedUser);
  };

  const logout = async () => {
    setUser(null);
    window.location.href = '/login';
  };

  useEffect(() => {
    setUser(hardcodedUser);
    setIsLoading(false);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;