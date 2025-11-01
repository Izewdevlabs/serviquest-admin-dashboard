import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
 

  useEffect(() => {
    axiosClient.get("/admin/stats").then((res) => setStats(res.data));
  }, []);

  const data = [
    { name: "Users", value: stats?.totalUsers },
    { name: "Providers", value: stats?.totalProviders },
    { name: "Bookings", value: stats?.totalBookings },
    { name: "Revenue", value: stats?.totalRevenue }
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {data.map((item) => (
          <div key={item.name} className="bg-white p-4 rounded shadow text-center">
            <h3 className="text-gray-600">{item.name}</h3>
            <p className="text-2xl font-bold text-blue-600">{item.value || 0}</p>
          </div>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#007AFF" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
