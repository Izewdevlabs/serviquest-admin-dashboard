import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axiosClient
      .get("/admin/stats")
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Error loading dashboard stats:", err));
  }, []);

  const data = [
    { name: "Users", value: stats?.totalUsers || 0 },
    { name: "Providers", value: stats?.totalProviders || 0 },
    { name: "Bookings", value: stats?.totalBookings || 0 },
    { name: "Revenue", value: stats?.totalRevenue || 0 },
  ];

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <h2 className="text-3xl font-semibold mb-8 text-gray-800 dark:text-gray-100">
        Dashboard Overview
      </h2>

      {/* ✅ Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {data.map((item) => (
          <div
            key={item.name}
            className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 text-center hover:shadow-lg transition"
          >
            <h3 className="text-gray-600 dark:text-gray-300 text-lg font-medium mb-2">
              {item.name}
            </h3>
            <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* ✅ Chart Visualization */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 transition-colors duration-300">
        <h3 className="text-gray-700 dark:text-gray-200 font-semibold mb-4">
          Performance Overview
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis
              dataKey="name"
              stroke="#9CA3AF"
              tick={{ fill: "#9CA3AF" }}
              tickLine={false}
            />
            <YAxis
              stroke="#9CA3AF"
              tick={{ fill: "#9CA3AF" }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                color: "#F9FAFB",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
