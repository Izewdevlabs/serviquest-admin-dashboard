import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, LayoutDashboard, Briefcase } from "lucide-react"; // optional icons (npm install lucide-react)

export default function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { path: "/services", label: "Services", icon: <Briefcase size={18} /> },
  ];

  return (
    <div className="h-screen w-64 bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="text-2xl font-bold px-6 py-4 border-b border-gray-700">
        ServiQuest Admin
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-6 py-3 text-sm hover:bg-gray-700 transition ${
              location.pathname === item.path ? "bg-gray-800" : ""
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={logout}
        className="flex items-center px-6 py-3 text-sm hover:bg-red-600 border-t border-gray-700"
      >
        <LogOut size={18} className="mr-3" />
        Logout
      </button>
    </div>
  );
}
