import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  element: React.ReactNode;
  isAllowed: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, isAllowed }) => {
  return isAllowed ? <>{element}</> : <Navigate to="/" />;
};

export default ProtectedRoute;
