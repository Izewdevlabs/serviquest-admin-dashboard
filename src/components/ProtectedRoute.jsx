import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { token } = useAuth();

  // If no token, send user directly to /login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
