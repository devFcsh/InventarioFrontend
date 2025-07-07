import { useUser } from '@context/userContext';
import React from 'react';
import { Navigate } from 'react-router-dom';

interface Props {
  element: JSX.Element;
  allowedRoles: string[];
}

export const ProtectedRoute: React.FC<Props> = ({ element, allowedRoles }) => {
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

  if (!allowedRoles.includes(rol)) {
    return <Navigate to="/notFound" replace />;
  }

  return element;
};