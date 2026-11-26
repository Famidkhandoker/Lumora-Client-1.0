import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiCalendar,
  FiCreditCard,
  FiPackage,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiArrowRight,
} from "react-icons/fi";
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
  const [userBookings, setUserBookings] = useState([]);

  const fetchUserStats = useCallback(async () => {
    try {
      const token = localStorage.getItem("lumora-token");
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/bookings/user/${user.email}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const bookings = data.bookings || [];
      setUserBookings(bookings);
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

      {/* My Service Decorator Section (Matching Reference Screenshot) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-xl p-6 mt-8"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 text-amber-500 text-sm shadow-sm">
              ⭐
            </span>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              My Service Decorator
            </h2>
          </div>
          <Link
            to="/dashboard/my-bookings"
            className="text-sm font-semibold text-[#0070e0] hover:text-[#005bb5] flex items-center gap-1.5 transition-colors"
          >
            <span>View All</span>
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {userBookings.length === 0 ? (
          <div className="p-10 text-center bg-gray-50/70 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500 font-medium">No bookings found yet.</p>
            <Link to="/services" className="btn btn-sm btn-primary mt-3">
              Browse Services
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {userBookings.map((b) => {
              const hasDecorator = Boolean(b.decorator && !b.noDecoratorAvailable);
              const decorator = b.decorator;

              // Format date nicely e.g. Oct 25, 2026
              const formattedDate = (() => {
                if (!b.bookingDate) return "Oct 25, 2026";
                try {
                  const d = new Date(b.bookingDate);
                  return isNaN(d.getTime())
                    ? b.bookingDate
                    : d.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                } catch {
                  return b.bookingDate;
                }
              })();

              return (
                <div
                  key={b._id}
                  className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  {hasDecorator && decorator ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
                      {/* 1. Decorator Profile Info */}
                      <div className="flex items-center gap-4">
                        <img
                          src={decorator.photoURL || "/images/decorators/ryin.jpg"}
                          alt={decorator.displayName}
                          className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-gray-200 shadow-sm"
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces";
                          }}
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-base text-gray-900 flex items-center gap-1.5 truncate">
                            <span>{decorator.displayName || "Assigned Decorator"}</span>
                            <span
                              className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#0070e0] text-white text-[10px] shrink-0"
                              title="Verified Decorator"
                            >
                              ✓
                            </span>
                          </h4>
                          <p className="flex items-center gap-1.5 text-xs text-gray-600 mt-1.5 truncate">
                            <FiMail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span className="truncate">{decorator.email}</span>
                          </p>
                          <p className="flex items-center gap-1.5 text-xs text-gray-600 mt-1">
                            <FiPhone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span>{decorator.phone || "+880 1712 345678"}</span>
                          </p>
                        </div>
                      </div>

                      {/* 2. Services Provided */}
                      <div className="lg:border-l lg:border-gray-100 lg:pl-6">
                        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2.5">
                          Services Provided
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {(decorator.servicesProvided || [b.serviceName]).map((srv, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 rounded-full text-xs font-medium bg-sky-50 text-sky-700 border border-sky-100"
                            >
                              {srv}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* 3. Booking Details */}
                      <div className="lg:border-l lg:border-gray-100 lg:pl-6">
                        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2.5">
                          Booking Details
                        </p>
                        <p className="flex items-center gap-2 text-xs font-medium text-gray-700">
                          <FiCalendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>{formattedDate}</span>
                        </p>
                        <p className="flex items-center gap-2 text-xs font-medium text-gray-700 mt-2 truncate">
                          <FiBriefcase className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="truncate">
                            {b.serviceName || "Wedding Package"}
                          </span>
                        </p>
                      </div>

                      {/* 4. Status */}
                      <div className="lg:border-l lg:border-gray-100 lg:pl-6 flex flex-col justify-center">
                        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2.5">
                          Status
                        </p>
                        <div>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Assigned
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg border border-amber-200 shrink-0">
                          ⏳
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-gray-900">
                            {b.noDecoratorAvailable
                              ? "No decorator available for this service"
                              : "Decorator Not Assigned Yet"}
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5">
                            For <strong className="text-gray-700">{b.serviceName}</strong> ({formattedDate})
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                        {b.noDecoratorAvailable ? "No Decorator" : "Pending Assignment"}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default UserDashboard;
