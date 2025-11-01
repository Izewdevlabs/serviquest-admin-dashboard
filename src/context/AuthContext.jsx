import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";


// Create Auth Context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // Decode token to extract user info
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
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

  // Login function
  const login = (jwtToken) => {
    try {
      const decoded = jwtDecode(jwtToken);
      setUser(decoded);
      setToken(jwtToken);
      localStorage.setItem("token", jwtToken);
    } catch (err) {
      console.error("Failed to decode JWT:", err);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use Auth Context
export const useAuth = () => useContext(AuthContext);
