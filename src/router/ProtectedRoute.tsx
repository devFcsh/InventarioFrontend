import { useUser } from '@context/userContext';
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

interface Props {
  element: JSX.Element;
  allowedRoles: string[];
}

export const ProtectedRoute: React.FC<Props> = ({ element, allowedRoles }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const { rol, loading } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Verificando autenticación...</div>
      </div>
    );
  }

  if (!rol) {
    return <Navigate to="/" replace />;
  }

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/status`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      const authenticated = data.authenticated || data.isAuth || data.isAuthenticated;
      setIsAuthenticated(authenticated);
      setIsLoading(false);
    } catch (error) {
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Verificando autenticación...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!rol || !allowedRoles.includes(rol)) {
    return <Navigate to="/notFound" replace />;
  }

  return element;
};