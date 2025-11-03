// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import * as jwtDecode from "jwt-decode"; // ✅ works with jwt-decode v4+

// Create Auth Context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // Decode token and set user when token changes
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode.jwtDecode(token);
        setUser(decoded);
        localStorage.setItem("token", token);
      } catch (err) {
        console.error("Invalid or expired token:", err);
        logout();
      }
    } else {
      setUser(null);
      localStorage.removeItem("token");
    }
  }, [token]);

  // ✅ Login helper
  const login = (jwtToken) => {
    try {
      const decoded = jwtDecode.jwtDecode(jwtToken);
      setUser(decoded);
      setToken(jwtToken);
      localStorage.setItem("token", jwtToken);
    } catch (err) {
      console.error("Failed to decode JWT:", err);
    }
  };

  // ✅ Logout helper
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // ✅ Provide everything Login.jsx needs
  return (
    <AuthContext.Provider value={{ user, token, setToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Hook for accessing context
export const useAuth = () => useContext(AuthContext);
