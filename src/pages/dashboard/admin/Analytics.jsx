// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import axios from 'axios';
// import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// const Analytics = () => {
//   const [analytics, setAnalytics] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchAnalytics();
//   }, []);

//   const fetchAnalytics = async () => {
//     try {
//       const token = localStorage.getItem('lumora-token');
//       const { data } = await axios.get(
//         `${import.meta.env.VITE_API_URL}/api/analytics/dashboard`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setAnalytics(data);
//     } catch (error) {
//       console.error('Error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Custom Tooltip
//   const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
//           <p className="font-semibold text-gray-800">{label}</p>
//           <p className="text-[var(--lum-accent)] font-bold">
//             {payload[0].name}: {payload[0].value}
//           </p>
//         </div>
//       );
//     }
//     return null;
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center py-20">
//         <span className="loading loading-spinner loading-lg text-[var(--lum-accent)]"></span>
//       </div>
//     );
//   }

//   // Transform service demand data for better display
//   const serviceDemandData = analytics?.serviceDemand?.map(item => ({
//     name: item._id.length > 20 ? item._id.substring(0, 20) + '...' : item._id,
//     bookings: item.count
//   })) || [];

//   // Transform monthly revenue data
//   const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//   const revenueData = analytics?.monthlyRevenue?.map(item => ({
//     month: monthNames[item._id.month - 1],
//     revenue: item.revenue
//   })) || [];

//   return (
//     <div>
//       <motion.h1
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="text-4xl font-bold mb-8"
//       >
//         <span className="bg-gradient-to-r from-[var(--lum-primary)] to-[var(--lum-accent)] bg-clip-text text-transparent">Analytics</span>
//       </motion.h1>

//       <div className="space-y-8">
//         {/* Service Demand Chart */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white rounded-2xl shadow-xl p-6"
//         >
//           <h2 className="text-2xl font-bold mb-6 text-gray-800">Service Demand</h2>
//           {serviceDemandData.length > 0 ? (
//             <ResponsiveContainer width="100%" height={400}>
//               <BarChart data={serviceDemandData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                 <XAxis
//                   dataKey="name"
//                   angle={-45}
//                   textAnchor="end"
//                   height={100}
//                   tick={{ fill: "var(--lum-text)", fontSize: 12 }}
//                 />
//                 <YAxis tick={{ fill: 'var(--lum-text)' }} />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Bar
//                   dataKey="bookings"
//                   fill="url(#colorGradient)"
//                   radius={[8, 8, 0, 0]}
//                   label={{ position: 'top', fill: 'var(--lum-accent)', fontSize: 12, fontWeight: 'bold' }}
//                 />
//                 <defs>
//                   <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="0%" stopColor="var(--lum-accent)" stopOpacity={1} />
//                     <stop offset="100%" stopColor="var(--lum-primary)" stopOpacity={0.8} />
//                   </linearGradient>
//                 </defs>
//               </BarChart>
//             </ResponsiveContainer>
//           ) : (
//             <div className="text-center py-20 text-gray-500">
//               <p className="text-xl">No booking data available yet</p>
//               <p className="text-sm mt-2">Data will appear once services are booked</p>
//             </div>
//           )}
//         </motion.div>

//         {/* Monthly Revenue Chart */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="bg-white rounded-2xl shadow-xl p-6"
//         >
//           <h2 className="text-2xl font-bold mb-6 text-gray-800">Monthly Revenue Trend</h2>
//           {revenueData.length > 0 ? (
//             <ResponsiveContainer width="100%" height={400}>
//               <LineChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                 <XAxis
//                   dataKey="month"
//                   tick={{ fill: 'var(--lum-text)' }}
//                 />
//                 <YAxis
//                   tick={{ fill: 'var(--lum-text)' }}
//                   tickFormatter={(value) => `৳${value.toLocaleString()}`}
//                 />
//                 <Tooltip
//                   content={({ active, payload }) => {
//                     if (active && payload && payload.length) {
//                       return (
//                         <div className="bg-base-100 p-4 rounded-lg shadow-xl border border-base-300">
//                           <p className="font-semibold text-gray-800">{payload[0].payload.month}</p>
//                           <p className="text-[var(--lum-accent)] font-bold text-lg">
//                             ৳{payload[0].value.toLocaleString()}
//                           </p>
//                         </div>
//                       );
//                     }
//                     return null;
//                   }}
//                 />
//                 <Legend />
//                 <Line
//                   type="monotone"
//                   dataKey="revenue"
//                   stroke="var(--lum-accent)"
//                   strokeWidth={3}
//                   dot={{ fill: 'var(--lum-accent)', r: 6 }}
//                   activeDot={{ r: 8, fill: 'var(--lum-primary)' }}
//                   name="Revenue (৳)"
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           ) : (
//             <div className="text-center py-20 text-gray-500">
//               <p className="text-xl">No revenue data available yet</p>
//               <p className="text-sm mt-2">Data will appear once payments are received</p>
//             </div>
//           )}
//         </motion.div>

//         {/* Summary Stats */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.4 }}
//           className="grid md:grid-cols-3 gap-6"
//         >
//           <div className="bg-gradient-to-br from-[var(--lum-skysoft)] to-[var(--lum-primary)] rounded-2xl p-6 text-white">
//             <p className="text-sm opacity-90 mb-2">Total Bookings</p>
//             <p className="text-4xl font-bold">{analytics?.totalBookings || 0}</p>
//           </div>
//           <div className="bg-gradient-to-br from-[var(--lum-accent)] to-[#5B9BD5] rounded-2xl p-6 text-white">
//             <p className="text-sm opacity-90 mb-2">Paid Bookings</p>
//             <p className="text-4xl font-bold">{analytics?.paidBookings || 0}</p>
//           </div>
//           <div className="bg-gradient-to-br from-[var(--lum-primary)] to-[var(--lum-accent)] rounded-2xl p-6 text-white">
//             <p className="text-sm opacity-90 mb-2">Total Revenue</p>
//             <p className="text-4xl font-bold">৳{(analytics?.totalRevenue || 0).toLocaleString()}</p>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default Analytics


import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("lumora-token");
        const apiUrl = import.meta.env.VITE_API_URL;

        if (!apiUrl) {
          throw new Error(
            "VITE_API_URL is missing. Please check your client .env file."
          );
        }

        const { data } = await axios.get(
          `${apiUrl}/api/analytics/dashboard`,
          {
            headers: token
              ? { Authorization: `Bearer ${token}` }
              : {},
          }
        );

        setAnalytics(data ?? {});
      } catch (err) {
        console.error(
          "Error fetching analytics:",
          err.response?.data || err.message || err
        );

        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load analytics data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // Service Demand Data
  const serviceDemandData = (
    Array.isArray(analytics?.serviceDemand)
      ? analytics.serviceDemand
      : []
  )
    .filter((item) => item && item._id != null)
    .map((item) => {
      const serviceName = String(item._id);

      return {
        name:
          serviceName.length > 20
            ? `${serviceName.substring(0, 20)}...`
            : serviceName,
        bookings: Number(item.count) || 0,
      };
    });

  // Monthly Revenue Data
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const revenueData = (
    Array.isArray(analytics?.monthlyRevenue)
      ? analytics.monthlyRevenue
      : []
  )
    .filter((item) => {
      const month = Number(item?._id?.month);

      return (
        item &&
        item._id &&
        Number.isInteger(month) &&
        month >= 1 &&
        month <= 12
      );
    })
    .map((item) => ({
      month: monthNames[Number(item._id.month) - 1],
      revenue: Number(item.revenue) || 0,
    }));

  // Custom Tooltip for Service Demand
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !Array.isArray(payload) || payload.length === 0) {
      return null;
    }

    return (
      <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
        <p className="font-semibold text-gray-800">
          {label ?? "Unknown service"}
        </p>

        <p className="text-[var(--lum-accent)] font-bold">
          {payload[0]?.name || "Bookings"}: {payload[0]?.value ?? 0}
        </p>
      </div>
    );
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg text-[var(--lum-accent)]" />
      </div>
    );
  }

  // API Error State
  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-3">
          Unable to Load Analytics
        </h1>

        <p className="text-gray-600 break-words">{error}</p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="btn mt-5 text-white border-none"
          style={{
            background:
              "linear-gradient(135deg, var(--lum-primary), var(--lum-accent))",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Page Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-8"
      >
        <span className="bg-gradient-to-r from-[var(--lum-primary)] to-[var(--lum-accent)] bg-clip-text text-transparent">
          Analytics
        </span>
      </motion.h1>

      <div className="space-y-8">
        {/* Service Demand Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6"
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Service Demand
          </h2>

          {serviceDemandData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={serviceDemandData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 60,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f0f0f0"
                />

                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  tick={{
                    fill: "var(--lum-text)",
                    fontSize: 12,
                  }}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "var(--lum-text)" }}
                />

                <Tooltip content={<CustomTooltip />} />

                <Bar
                  dataKey="bookings"
                  name="Bookings"
                  fill="var(--lum-accent)"
                  radius={[8, 8, 0, 0]}
                  label={{
                    position: "top",
                    fill: "var(--lum-accent)",
                    fontSize: 12,
                    fontWeight: "bold",
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-20 text-gray-500">
              <p className="text-xl">No booking data available yet</p>
              <p className="text-sm mt-2">
                Data will appear once services are booked
              </p>
            </div>
          )}
        </motion.div>

        {/* Monthly Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-6"
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Monthly Revenue Trend
          </h2>

          {revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={revenueData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 20,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f0f0f0"
                />

                <XAxis
                  dataKey="month"
                  tick={{ fill: "var(--lum-text)" }}
                />

                <YAxis
                  tick={{ fill: "var(--lum-text)" }}
                  tickFormatter={(value) =>
                    `৳${Number(value).toLocaleString()}`
                  }
                />

                <Tooltip
                  formatter={(value) => [
                    `৳${Number(value ?? 0).toLocaleString()}`,
                    "Revenue",
                  ]}
                  labelFormatter={(label) => `Month: ${label}`}
                />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue (৳)"
                  stroke="var(--lum-accent)"
                  strokeWidth={3}
                  dot={{
                    fill: "var(--lum-accent)",
                    r: 6,
                  }}
                  activeDot={{
                    r: 8,
                    fill: "var(--lum-primary)",
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-20 text-gray-500">
              <p className="text-xl">No revenue data available yet</p>
              <p className="text-sm mt-2">
                Data will appear once payments are received
              </p>
            </div>
          )}
        </motion.div>

        {/* Summary Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {/* Total Bookings */}
          <div className="bg-gradient-to-br from-[var(--lum-skysoft)] to-[var(--lum-primary)] rounded-2xl p-6 text-white">
            <p className="text-sm opacity-90 mb-2">
              Total Bookings
            </p>

            <p className="text-4xl font-bold">
              {Number(analytics?.totalBookings) || 0}
            </p>
          </div>

          {/* Paid Bookings */}
          <div className="bg-gradient-to-br from-[var(--lum-accent)] to-[#5B9BD5] rounded-2xl p-6 text-white">
            <p className="text-sm opacity-90 mb-2">
              Paid Bookings
            </p>

            <p className="text-4xl font-bold">
              {Number(analytics?.paidBookings) || 0}
            </p>
          </div>

          {/* Total Revenue */}
          <div className="bg-gradient-to-br from-[var(--lum-primary)] to-[var(--lum-accent)] rounded-2xl p-6 text-white">
            <p className="text-sm opacity-90 mb-2">
              Total Revenue
            </p>

            <p className="text-4xl font-bold">
              ৳{(Number(analytics?.totalRevenue) || 0).toLocaleString()}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;

