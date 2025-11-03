import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import Modal from "../components/Modal";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const usersPerPage = 8;

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    role: "user",
  });

  // ─────────────────────────────────────────────
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error loading users:", err);
      setMessage("❌ Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ─────────────────────────────────────────────
  const handleRoleChange = async (id, role) => {
    try {
      await axiosClient.put(`/admin/users/${id}`, { role });
      setMessage("✅ Role updated successfully");
      fetchUsers();
    } catch {
      setMessage("❌ Failed to update role");
    }
  };

  const handleVerify = async (id) => {
    try {
      await axiosClient.put(`/admin/verify/${id}`);
      setMessage("✅ Provider verified successfully");
      fetchUsers();
    } catch {
      setMessage("❌ Verification failed");
    }
  };

  const confirmDelete = (user) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    try {
      await axiosClient.delete(`/admin/users/${selectedUser.id}`);
      setMessage("🗑️ User deleted successfully");
      fetchUsers();
    } catch {
      setMessage("❌ Failed to delete user");
    } finally {
      setIsDeleteOpen(false);
      setSelectedUser(null);
    }
  };

  const openAddUserModal = () => {
    setForm({
      full_name: "",
      email: "",
      role: "user",
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post("/admin/users", form);
      setMessage("✅ New user added successfully!");
      fetchUsers();
    } catch (err) {
      setMessage("❌ Failed to add user");
    } finally {
      setIsFormOpen(false);
    }
  };

  // ─────────────────────────────────────────────
  const filteredUsers = users
    .filter((u) => (filter === "all" ? true : u.role === filter))
    .filter(
      (u) =>
        u.full_name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const currentUsers = filteredUsers.slice(
    (page - 1) * usersPerPage,
    page * usersPerPage
  );

  // ─────────────────────────────────────────────
  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
          User Management
        </h2>

        <div className="flex space-x-3">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded p-2 text-sm w-full sm:w-64 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
          />
          <button
            onClick={openAddUserModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
          >
            + Add User
          </button>
        </div>
      </div>

      {message && (
        <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded shadow-sm">
          {message}
        </div>
      )}

      {/* Filter Buttons */}
      <div className="flex space-x-3 mb-6">
        {["all", "admin", "provider", "user"].map((r) => (
          <button
            key={r}
            onClick={() => {
              setFilter(r);
              setPage(1);
            }}
            className={`px-4 py-2 rounded font-medium transition ${
              filter === r
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-800 border text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            {r.charAt(0).toUpperCase() + r.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-600 dark:text-gray-400 animate-pulse">
          Loading users...
        </p>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow rounded-xl overflow-x-auto">
          <table className="min-w-full text-sm border-collapse text-left text-gray-800 dark:text-gray-100">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
              <tr>
                <th className="p-3 border dark:border-gray-700">Full Name</th>
                <th className="p-3 border dark:border-gray-700">Email</th>
                <th className="p-3 border dark:border-gray-700">Role</th>
                <th className="p-3 border dark:border-gray-700">Verified</th>
                <th className="p-3 border dark:border-gray-700">Created</th>
                <th className="p-3 border dark:border-gray-700 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((u) => (
                <tr
                  key={u.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <td className="p-3 border dark:border-gray-700">
                    {u.full_name}
                  </td>
                  <td className="p-3 border dark:border-gray-700">{u.email}</td>
                  <td className="p-3 border dark:border-gray-700">
                    <select
                      value={u.role}
                      onChange={(e) =>
                        handleRoleChange(u.id, e.target.value)
                      }
                      className="border dark:border-gray-700 p-1 rounded text-gray-700 dark:text-gray-200 dark:bg-gray-800"
                    >
                      <option value="user">User</option>
                      <option value="provider">Provider</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="p-3 border dark:border-gray-700">
                    {u.role === "provider" ? (
                      u.verified ? (
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          Verified
                        </span>
                      ) : (
                        <button
                          onClick={() => handleVerify(u.id)}
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Verify
                        </button>
                      )
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="p-3 border dark:border-gray-700">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 border dark:border-gray-700 text-center">
                    <button
                      onClick={() => confirmDelete(u)}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {currentUsers.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 p-6">
              No users found.
            </p>
          )}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 space-x-3">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className={`px-3 py-1 rounded ${
            page === 1
              ? "bg-gray-200 dark:bg-gray-700 text-gray-500"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Prev
        </button>
        <span className="text-gray-700 dark:text-gray-300 text-sm">
          Page {page} of {totalPages || 1}
        </span>
        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage(page + 1)}
          className={`px-3 py-1 rounded ${
            page === totalPages || totalPages === 0
              ? "bg-gray-200 dark:bg-gray-700 text-gray-500"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Next
        </button>
      </div>

      {/* ─────────────────────────────── */}
      {/* Add User Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Add New User"
      >
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            required
            className="border dark:border-gray-700 p-2 rounded dark:bg-gray-800 dark:text-gray-200"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="border dark:border-gray-700 p-2 rounded dark:bg-gray-800 dark:text-gray-200"
          />
          <select
            name="role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="border dark:border-gray-700 p-2 rounded dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="user">User</option>
            <option value="provider">Provider</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded col-span-2"
          >
            Add User
          </button>
        </form>
      </Modal>

      {/* ─────────────────────────────── */}
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Confirm Delete"
        variant="danger"
        confirmText="Delete"
        cancelText="Cancel"
        showActions
      >
        <p className="text-gray-700 dark:text-gray-300">
          Are you sure you want to delete{" "}
          <strong>{selectedUser?.full_name}</strong>?
        </p>
      </Modal>
    </div>
  );
}
