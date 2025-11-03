import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiTool,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiChevronLeft,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { Outlet } from "react-router-dom"; // ✅ import this

export default function AdminLayout({ children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Sidebar collapsed state
  const [collapsed, setCollapsed] = useState(() => {
    const stored = localStorage.getItem("sidebar-collapsed");
    return stored ? JSON.parse(stored) : false;
  });

  // Theme (light/dark)
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("theme");
    return stored === "dark";
  });

  // Apply dark mode to document root
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleSidebar = () => setCollapsed((prev) => !prev);
  const toggleTheme = () => setDarkMode((prev) => !prev);

  const navLinks = [
    { path: "/dashboard", label: "Dashboard", icon: <FiHome /> },
    { path: "/services", label: "Services", icon: <FiTool /> },
    { path: "/users", label: "Users", icon: <FiUsers /> },
    { path: "/settings", label: "Settings", icon: <FiSettings /> },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? "w-20" : "w-64"
        } bg-gray-900 dark:bg-gray-800 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h1
            className={`font-bold text-lg tracking-wide transition-all duration-300 ${
              collapsed ? "opacity-0 hidden" : "opacity-100"
            }`}
          >
            ServiQuest
          </h1>
          <button
            onClick={toggleSidebar}
            className="text-gray-300 hover:text-white text-xl"
          >
            {collapsed ? <FiMenu /> : <FiChevronLeft />}
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 mt-4 space-y-1">
          {navLinks.map(({ path, label, icon }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center ${
                  collapsed ? "justify-center" : "justify-start"
                } px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <span className="text-lg">{icon}</span>
                {!collapsed && <span className="ml-3">{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Theme + Logout */}
        <div className="p-4 border-t border-gray-800 flex flex-col space-y-3">
          <button
            onClick={toggleTheme}
            className={`flex items-center justify-center ${
              collapsed ? "justify-center" : "justify-start"
            } px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white`}
          >
            {darkMode ? <FiSun /> : <FiMoon />}
            {!collapsed && (
              <span className="ml-3">{darkMode ? "Light Mode" : "Dark Mode"}</span>
            )}
          </button>

          <button
            onClick={handleLogout}
            className={`flex items-center ${
              collapsed ? "justify-center" : "justify-start"
            } px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition`}
          >
            <FiLogOut className="text-lg" />
            {!collapsed && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />   {/* ✅ This renders the active child route */}
      </main>
    </div>
  );
}
