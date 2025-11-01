import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

export default function Disputes() {
  const [disputes, setDisputes] = useState([]);

  useEffect(() => {
    axiosClient.get("/admin/disputes").then((res) => setDisputes(res.data));
  }, []);

  const resolve = async (id) => {
    const notes = prompt("Enter resolution notes:");
    await axiosClient.put(`/admin/disputes/${id}/resolve`, { resolution_notes: notes });
    setDisputes((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "resolved", resolution_notes: notes } : d))
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Disputes</h2>
      {disputes.map((d) => (
        <div key={d.id} className="bg-white p-4 mb-4 rounded shadow">
          <p><strong>Issue:</strong> {d.issue}</p>
          <p><strong>Status:</strong> {d.status}</p>
          <p><strong>Raised by:</strong> {d.raised_by?.full_name}</p>
          {d.status !== "resolved" && (
            <button onClick={() => resolve(d.id)} className="bg-green-600 text-white px-3 py-1 mt-2 rounded">
              Resolve
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
