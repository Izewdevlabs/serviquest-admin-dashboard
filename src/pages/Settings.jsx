import { useState, useEffect, useRef } from "react";
import axiosClient from "../api/axiosClient";
import Modal from "../components/Modal";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import zxcvbn from "zxcvbn";
import { FiUpload } from "react-icons/fi";
import { motion } from "framer-motion";
import { validatePassword, getStrengthLabel } from "../utils/passwordUtils";

export default function Settings() {
  const { user, token, logout } = useAuth();
  const [profile, setProfile] = useState({ full_name: "", email: "", avatar_url: "" });
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [strength, setStrength] = useState(0);
  const [pwdRules, setPwdRules] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    symbol: false,
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const fileInputRef = useRef();

  // ─────────────── Theme Persistence ───────────────
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    localStorage.setItem("theme", newMode ? "dark" : "light");
    setDarkMode(newMode);
  };

  // ─────────────── Fetch Profile ───────────────
  const fetchProfile = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axiosClient.get("/users/me");
      setProfile({
        full_name: res.data.full_name || user?.full_name,
        email: res.data.email || user?.email,
        avatar_url: res.data.avatar_url || "",
      });
      if (res.data.avatar_url) {
        setAvatarPreview(`http://localhost:5000${res.data.avatar_url}`);
      }
    } catch (err) {
      console.error("Error loading profile:", err);
      setMessage("❌ Failed to load profile details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ─────────────── Avatar Upload ───────────────
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return toast.error("Please select an image first!");
    try {
      const formData = new FormData();
      formData.append("avatar", avatarFile);
      await axiosClient.post("/users/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("✅ Avatar uploaded successfully!");
      setAvatarFile(null);
      fetchProfile();
    } catch (err) {
      toast.error("❌ Failed to upload avatar.");
    }
  };

  // ─────────────── Update Profile ───────────────
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosClient.put("/users/me", profile);
      toast.success("✅ Profile updated successfully!");
      if (avatarFile) await handleAvatarUpload();
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("❌ Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  // ─────────────── Password Change ───────────────
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error("❌ Passwords do not match!");
    }

    try {
      await axiosClient.put("/users/change-password", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      toast.success("✅ Password updated successfully!");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setIsPasswordModalOpen(false);
    } catch (err) {
      console.error("Error changing password:", err);
      toast.error("❌ Failed to change password.");
    }
  };

  // ─────────────── Render ───────────────
  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
        Admin Settings
      </h2>

      {message && (
        <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 rounded shadow-sm">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
            Profile Information
          </h3>

          {/* Avatar Upload Section */}
          <div className="flex items-center space-x-4 mb-6">
            <motion.img
              key={avatarPreview}
              src={avatarPreview || "/default-avatar.png"}
              alt="Avatar Preview"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 dark:border-gray-700"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            />
            <div className="flex flex-col space-y-2">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current.click()}
                className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded text-sm text-gray-800 dark:text-gray-200"
              >
                <FiUpload /> <span>Select Image</span>
              </button>
              <button
                onClick={handleAvatarUpload}
                disabled={!avatarFile}
                className={`px-3 py-2 rounded text-sm transition ${
                  avatarFile
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
                }`}
              >
                Upload
              </button>
            </div>
          </div>

          {loading ? (
            <p className="text-gray-600 dark:text-gray-400 animate-pulse">
              Loading profile...
            </p>
          ) : (
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.full_name}
                  onChange={(e) =>
                    setProfile({ ...profile, full_name: e.target.value })
                  }
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          )}
        </div>

        {/* Account Security */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
            Account Security
          </h3>

          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition"
          >
            Change Password
          </button>

          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition block"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Preferences */}
      <div className="mt-10 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <div className="flex items-center justify-between">
          <span className="text-gray-700 dark:text-gray-300 font-medium">
            Dark Mode
          </span>
          <button
            onClick={toggleDarkMode}
            className={`px-4 py-2 rounded transition ${
              darkMode
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            }`}
          >
            {darkMode ? "Enabled" : "Disabled"}
          </button>
        </div>
      </div>

      {/* Password Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Change Password"
      >
        <form onSubmit={handlePasswordChange} className="space-y-4 mt-2">
          <input
            type="password"
            placeholder="Current Password"
            value={passwords.currentPassword}
            onChange={(e) =>
              setPasswords({ ...passwords, currentPassword: e.target.value })
            }
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />

          <div>
            <input
              type="password"
              placeholder="New Password"
              value={passwords.newPassword}
              onChange={(e) => {
                const newPwd = e.target.value;
                setPasswords({ ...passwords, newPassword: newPwd });
                const { score, rules } = validatePassword(newPwd);
                setStrength(score);
                setPwdRules(rules);
              }}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />

            {/* Strength Bar */}
            <div className="h-2 rounded bg-gray-300 dark:bg-gray-700 mt-2">
              <div
                className={`h-2 rounded transition-all duration-300 ${
                  ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500", "bg-emerald-600"][strength]
                }`}
                style={{ width: `${(strength + 1) * 20}%` }}
              />
            </div>
            <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
              Strength: {getStrengthLabel(strength)}
            </p>

            {/* Rules Feedback */}
            <ul className="text-xs mt-2 space-y-1 text-gray-600 dark:text-gray-400">
              <li className={pwdRules.length ? "text-green-500" : "text-red-400"}>• At least 8 characters</li>
              <li className={pwdRules.upper ? "text-green-500" : "text-red-400"}>• Uppercase letter</li>
              <li className={pwdRules.lower ? "text-green-500" : "text-red-400"}>• Lowercase letter</li>
              <li className={pwdRules.number ? "text-green-500" : "text-red-400"}>• Number</li>
              <li className={pwdRules.symbol ? "text-green-500" : "text-red-400"}>• Symbol</li>
            </ul>
          </div>

          <input
            type="password"
            placeholder="Confirm New Password"
            value={passwords.confirmPassword}
            onChange={(e) =>
              setPasswords({ ...passwords, confirmPassword: e.target.value })
            }
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsPasswordModalOpen(false)}
              className="bg-gray-300 dark:bg-gray-700 px-3 py-1 rounded text-gray-800 dark:text-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={strength < 3}
              className={`px-4 py-1 rounded ${
                strength < 3
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              Save
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
