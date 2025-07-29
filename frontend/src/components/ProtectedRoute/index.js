// src/components/ProtectedRoute.js
import { Navigate, useLocation } from "react-router-dom";
import Cookie from "js-cookie";

const ProtectedRoute = ({ children }) => {
  const token = Cookie.get("jwt_token");
  const location = useLocation();

  // Parse user object from localStorage
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  const role = user?.role;

  // Redirect to login if not authenticated
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Restrict access to /admin routes for non-admin users
  if (location.pathname.startsWith("/admin") && role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  // Allow access
  return children;
};

export default ProtectedRoute;
