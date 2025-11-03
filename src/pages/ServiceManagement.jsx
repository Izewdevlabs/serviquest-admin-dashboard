
import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import Modal from "../components/Modal";

export default function ServiceManagement() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    unit: "hour",
    category: "",
    available: true,
  });
  const [editingService, setEditingService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // ─────────────────────────────────────────────
  // Fetch all services
  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/services");
      setServices(res.data);
    } catch (err) {
      console.error("Error loading services:", err);
      setMessage("❌ Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // ─────────────────────────────────────────────
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  // ─────────────────────────────────────────────
  // Open Add/Edit Modal
  const openFormModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setForm({
        title: service.title,
        description: service.description,
        price: service.price,
        unit: service.unit,
        category: service.category,
        available: service.available,
      });
    } else {
      setEditingService(null);
      setForm({
        title: "",
        description: "",
        price: "",
        unit: "hour",
        category: "",
        available: true,
      });
    }
    setIsFormOpen(true);
  };

  // ─────────────────────────────────────────────
  // Create or update service
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        await axiosClient.put(`/services/${editingService.id}`, form);
        setMessage("✅ Service updated successfully!");
      } else {
        await axiosClient.post("/services", form);
        setMessage("✅ Service added successfully!");
      }
      setIsFormOpen(false);
      fetchServices();
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || "Operation failed"}`);
    }
  };

  // ─────────────────────────────────────────────
  // Delete service (confirmed via modal)
  const confirmDelete = (service) => {
    setSelectedService(service);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    try {
      await axiosClient.delete(`/services/${selectedService.id}`);
      setMessage("🗑️ Service deleted successfully");
      fetchServices();
    } catch (err) {
      setMessage("❌ Failed to delete service");
    } finally {
      setIsDeleteOpen(false);
      setSelectedService(null);
    }
  };

  // ─────────────────────────────────────────────
  // Render
  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
          Service Management
        </h2>

        <button
          onClick={() => openFormModal()}
          className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
        >
          + Add Service
        </button>
      </div>

      {message && (
        <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded shadow-sm">
          {message}
        </div>
      )}

      {loading ? (
        <p className="text-gray-600 dark:text-gray-400 animate-pulse">
          Loading services...
        </p>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow rounded-xl overflow-x-auto">
          <table className="min-w-full text-sm border-collapse text-left text-gray-800 dark:text-gray-100">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
              <tr>
                <th className="p-3 border dark:border-gray-700">Title</th>
                <th className="p-3 border dark:border-gray-700">Category</th>
                <th className="p-3 border dark:border-gray-700">Price</th>
                <th className="p-3 border dark:border-gray-700">Unit</th>
                <th className="p-3 border dark:border-gray-700">Available</th>
                <th className="p-3 border dark:border-gray-700 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {services.map((svc) => (
                <tr
                  key={svc.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <td className="p-3 border dark:border-gray-700">{svc.title}</td>
                  <td className="p-3 border dark:border-gray-700">{svc.category}</td>
                  <td className="p-3 border dark:border-gray-700">${svc.price}</td>
                  <td className="p-3 border dark:border-gray-700">{svc.unit}</td>
                  <td className="p-3 border dark:border-gray-700">
                    {svc.available ? "✅" : "❌"}
                  </td>
                  <td className="p-3 border dark:border-gray-700 text-center space-x-2">
                    <button
                      onClick={() => openFormModal(svc)}
                      className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(svc)}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {services.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 p-6">
              No services found.
            </p>
          )}
        </div>
      )}

      {/* ─────────────────────────────── */}
      {/* Add/Edit Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingService ? "Edit Service" : "Add New Service"}
      >
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="title"
            placeholder="Service Title"
            value={form.title}
            onChange={handleChange}
            required
            className="border dark:border-gray-700 p-2 rounded dark:bg-gray-800 dark:text-gray-200"
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            required
            className="border dark:border-gray-700 p-2 rounded dark:bg-gray-800 dark:text-gray-200"
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
            className="border dark:border-gray-700 p-2 rounded dark:bg-gray-800 dark:text-gray-200"
          />
          <input
            type="text"
            name="unit"
            placeholder="Unit"
            value={form.unit}
            onChange={handleChange}
            className="border dark:border-gray-700 p-2 rounded dark:bg-gray-800 dark:text-gray-200"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            rows="2"
            className="border dark:border-gray-700 p-2 rounded col-span-2 dark:bg-gray-800 dark:text-gray-200"
          />
          <label className="flex items-center space-x-2 col-span-2">
            <input
              type="checkbox"
              name="available"
              checked={form.available}
              onChange={handleChange}
            />
            <span className="text-gray-700 dark:text-gray-300">Available</span>
          </label>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded col-span-2"
          >
            {editingService ? "Update Service" : "Add Service"}
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
          <strong>{selectedService?.title}</strong>? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
