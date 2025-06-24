import { Navigate } from "react-router-dom";
import React from "react";

interface Props {
  element: JSX.Element;
  allowedRoles: string[];
}

export const ProtectedRoute: React.FC<Props> = ({ element, allowedRoles }) => {
  const userRole = localStorage.getItem("rol") || "";

if (!allowedRoles.includes(userRole)) {
  return <Navigate to="/notFound" replace />;
}

  return element;
};
