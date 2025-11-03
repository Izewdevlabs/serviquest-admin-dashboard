import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";          // ✅ Added
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ServiceManagement from "./pages/ServiceManagement";
import "./index.css";
import UserManagement from "./pages/UserManagement";
import AdminLayout from "./layouts/AdminLayout";  // ✅ <--- ADD THIS LINE
import Settings from "./pages/Settings"; // ✅ Add this import

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        {/* ✅ Global toast notifications */}
        <Toaster position="top-right" reverseOrder={false} />

        <Routes>
  {/* Public routes */}
  <Route path="/" element={<Navigate to="/login" replace />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  {/* Protected routes under AdminLayout */}
  <Route
    element={
      <ProtectedRoute requiredRole="admin">
        <AdminLayout />
      </ProtectedRoute>
    }
  >
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/services" element={<ServiceManagement />} />
    <Route path="/users" element={<UserManagement />} />
    <Route path="/settings" element={<Settings />} /> {/* ✅ Add this */}
  </Route>
  {/* Fallback */}
  <Route path="*" element={<Navigate to="/login" replace />} />
</Routes>

      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
