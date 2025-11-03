import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, requiredRole }) {
  const { token, user } = useAuth();

  // 🔒 If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ⚙️ If role required, enforce it
  if (requiredRole && user?.role !== requiredRole) {
    console.warn("Unauthorized access attempt detected");
    return <Navigate to="/dashboard" replace />;
  }

  // ✅ Authorized — render page
  return children;
}
