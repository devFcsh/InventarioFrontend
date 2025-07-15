import { useUser } from '@context/userContext';
import Loader from '@pages/Loader';
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
      <Loader/>
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