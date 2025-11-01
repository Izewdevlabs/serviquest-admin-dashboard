import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

export default function Providers() {
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    axiosClient.get("/auth/providers").then((res) => setProviders(res.data));
  }, []);

  const verifyProvider = async (id) => {
    await axiosClient.put(`/admin/verify/${id}`);
    setProviders((prev) => prev.map((p) => (p.id === id ? { ...p, verified: true } : p)));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Providers</h2>
      <table className="min-w-full bg-white border rounded">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Status</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {providers.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-3">{p.full_name}</td>
              <td className="p-3">{p.email}</td>
              <td className="p-3">{p.verified ? "✅ Verified" : "❌ Pending"}</td>
              <td className="p-3">
                {!p.verified && (
                  <button
                    onClick={() => verifyProvider(p.id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Verify
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
