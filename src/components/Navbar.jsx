import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-700 text-white flex items-center justify-between px-6 py-3 shadow">
      <h1 className="font-bold text-lg tracking-wide">ServiQuest Admin</h1>

      <div className="flex items-center space-x-6">
        <Link to="/dashboard" className="hover:text-gray-200 transition">
          Dashboard
        </Link>

        <Link to="/services" className="hover:text-gray-200 transition">
          Services
        </Link>

        {/* ✅ Show only for admin users */}
        {user?.role === "admin" && (
          <Link to="/users" className="hover:text-gray-200 transition">
            Users
          </Link>
        )}

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
