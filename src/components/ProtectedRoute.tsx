// components/ProtectedRoute.tsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      console.log('🔍 Verificando autenticación para ruta protegida...');
      
      const response = await fetch(`${API_BASE_URL}/auth/status`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log('📊 Estado de autenticación:', data);

      setIsAuthenticated(data.authenticated);
      setIsLoading(false);

    } catch (error) {
      console.error('❌ Error verificando autenticación:', error);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  // Mostrar loading mientras verificamos la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Redirigir al login si no está autenticado
  if (!isAuthenticated) {
    console.log('❌ Usuario no autenticado, redirigiendo al login');
    return <Navigate to="/login" replace />;
  }

  // Mostrar el componente protegido si está autenticado
  console.log('✅ Usuario autenticado, mostrando contenido protegido');
  return <>{children}</>;
};

export default ProtectedRoute;