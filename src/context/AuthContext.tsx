import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AUTH_BASE_URL } from '../data';

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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = !!user;

  const checkAuth = async () => {
    try {
      console.log('🔍 Verificando estado de autenticación...');
      
      const response = await fetch(`${AUTH_BASE_URL}/auth/status`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log('📊 Estado de autenticación:', data);

      if (data.authenticated && data.user) {
        setUser(data.user);
        console.log('✅ Usuario autenticado:', data.user.username);
      } else {
        setUser(null);
        console.log('❌ Usuario no autenticado');
      }
    } catch (error) {
      console.error('❌ Error verificando autenticación:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = () => {
    console.log('🚀 Iniciando proceso de login...');
    window.location.href = `${AUTH_BASE_URL}/auth/cas/login`;
  };

  const logout = async () => {
    try {
      console.log('🚪 Cerrando sesión...');
      
      const response = await fetch(`${AUTH_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setUser(null);
        console.log('✅ Sesión cerrada exitosamente');
        
        // Redirigir al logout de CAS si está disponible
        if (data.casLogoutUrl) {
          window.location.href = data.casLogoutUrl;
        } else {
          window.location.href = '/login';
        }
      }
    } catch (error) {
      console.error('❌ Error cerrando sesión:', error);
      // Aunque haya error, limpiar el estado local
      setUser(null);
      window.location.href = '/login';
    }
  };

  useEffect(() => {
    checkAuth();
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
