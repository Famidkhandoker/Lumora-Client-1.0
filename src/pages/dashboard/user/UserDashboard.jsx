import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiCalendar, FiCreditCard, FiPackage } from "react-icons/fi";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../../../contexts/AuthContext";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const UserDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
  });
  const [chartData, setChartData] = useState([]);

  const fetchUserStats = useCallback(async () => {
    try {
      const token = localStorage.getItem("lumora-token");
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/bookings/user/${user.email}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const bookings = data.bookings || [];
      const pending = bookings.filter((b) => !b.isPaid).length;
      const completed = bookings.filter((b) => b.status === "completed").length;
      const cancelled = bookings.filter((b) => b.status === "cancelled").length;

      setStats({
        totalBookings: bookings.length,
        pendingBookings: pending,
        completedBookings: completed,
        cancelledBookings: cancelled,
      });

      setChartData([
        { name: "Pending", value: pending },
        { name: "Completed", value: completed },
        { name: "Cancelled", value: cancelled },
      ]);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, [user.email]);

  useEffect(() => {
    fetchUserStats();
  }, [fetchUserStats]);

  const statCards = [
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: FiCalendar,
      color: "from-[var(--lum-skysoft)] to-[var(--lum-primary)]",
    },
    {
      title: "Pending Payment",
      value: stats.pendingBookings,
      icon: FiCreditCard,
      color: "from-[var(--lum-primary)] to-[var(--lum-accent)]",
    },
    {
      title: "Completed",
      value: stats.completedBookings,
      icon: FiPackage,
      color: "from-[var(--lum-accent)] to-[#5B9BD5]",
    },
  ];

  const COLORS = ["var(--lum-primary)", "var(--lum-accent)", "#ef4444"];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">
          Welcome back,{" "}
          <span className="bg-gradient-to-r from-[var(--lum-primary)] to-[var(--lum-accent)] bg-clip-text text-transparent">
            {user?.displayName?.split(" ")[0]}
          </span>
        </h1>
        <p className="text-gray-600">
          Here&apos;s an overview of your bookings and activities
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white`}
            >
              <div className="flex items-center justify-between mb-4">
                <Icon size={32} />
                <span className="text-4xl font-bold">{stat.value}</span>
              </div>
              <p className="text-lg font-medium opacity-90">{stat.title}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-base-100 rounded-2xl shadow-xl p-6"
        >
          <h3 className="text-xl font-bold mb-6">Booking Status</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="var(--lum-primary)"
                  dataKey="value"
                  label={({ name, percent }) =>
                    percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ""
                  }
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-base-100 rounded-2xl shadow-xl p-6 flex flex-col justify-center items-center text-center"
        >
          <div className="p-4 bg-[var(--lum-cream)] rounded-full mb-4">
            <FiPackage className="text-[var(--lum-accent)] text-4xl" />
          </div>
          <h3 className="text-xl font-bold mb-2">Need Help?</h3>
          <p className="text-gray-600 mb-6">
            Have questions about your bookings? Our support team is here to help
            you 24/7.
          </p>
          <Link to="/contact" className="btn btn-primary w-full max-w-xs">
            Contact Support
          </Link>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-xl p-6"
      >
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link
            to="/services"
            className="btn btn-lg bg-gradient-to-r from-[var(--lum-primary)] to-[var(--lum-accent)] text-white border-none"
          >
            Browse Services
          </Link>
          <Link to="/dashboard/my-bookings" className="btn btn-lg btn-outline">
            View My Bookings
          </Link>
          <Link
            to="/dashboard/payment-history"
            className="btn btn-lg btn-outline"
          >
            Payment History
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default UserDashboard;
