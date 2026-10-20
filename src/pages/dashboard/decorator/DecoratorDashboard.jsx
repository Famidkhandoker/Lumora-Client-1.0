import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../contexts/AuthContext";
import {
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
} from "react-icons/fi";

const DecoratorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activeProjects: 0,
    completedProjects: 0,
    todaySchedule: 0,
    totalEarnings: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("lumora-token");
      const [projectsRes, earningsRes] = await Promise.all([
        axios.get(
          `${import.meta.env.VITE_API_URL}/api/bookings/decorator/${user.email
          }`,
          { headers: { Authorization: `Bearer ${token}` } }
        ),
        axios.get(
          `${import.meta.env.VITE_API_URL}/api/payments/decorator/${user.email
          }`,
          { headers: { Authorization: `Bearer ${token}` } }
        ),
      ]);

      const projects = projectsRes.data;
      const today = new Date().toDateString();

      setStats({
        activeProjects: projects.filter((p) => p.status !== "completed").length,
        completedProjects: projects.filter((p) => p.status === "completed")
          .length,
        todaySchedule: projects.filter(
          (p) => new Date(p.bookingDate).toDateString() === today
        ).length,
        totalEarnings: earningsRes.data.totalEarnings,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const statCards = [
    {
      icon: FiBriefcase,
      label: "Active Projects",
      value: stats.activeProjects,
      color: "from-[var(--lum-skysoft)] to-[var(--lum-primary)]",
      link: "/dashboard/decorator/projects",
    },
    {
      icon: FiCheckCircle,
      label: "Completed",
      value: stats.completedProjects,
      color: "from-[var(--lum-accent)] to-[#5B9BD5]",
      link: "/dashboard/decorator/projects",
    },
    {
      icon: FiClock,
      label: "Today's Schedule",
      value: stats.todaySchedule,
      color: "from-[var(--lum-primary)] to-[var(--lum-accent)]",
      link: "/dashboard/decorator/schedule",
    },
    {
      icon: FiDollarSign,
      label: "Total Earnings",
      value: `৳${stats.totalEarnings}`,
      color: "from-[var(--lum-primary)] to-[var(--lum-accent)]",
      link: "/dashboard/decorator/earnings",
    },
  ];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">
          Welcome,{" "}
          <span className="bg-gradient-to-r from-[var(--lum-primary)] to-[var(--lum-accent)] bg-clip-text text-transparent">
            {user?.displayName?.split(" ")[0]}
          </span>
        </h1>
        <p className="text-gray-600">
          Here's an overview of your projects and activities
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={stat.link}>
                <div
                  className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white hover:scale-105 transition-transform cursor-pointer`}
                >
                  <Icon size={32} className="mb-4" />
                  <p className="text-3xl font-bold mb-2">{stat.value}</p>
                  <p className="opacity-90">{stat.label}</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-base-100 rounded-2xl shadow-xl p-6"
      >
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link
            to="/dashboard/decorator/projects"
            className="btn btn-lg btn-outline"
          >
            View All Projects
          </Link>
          <Link
            to="/dashboard/decorator/schedule"
            className="btn btn-lg bg-gradient-to-r from-[var(--lum-primary)] to-[var(--lum-accent)] text-white border-none"
          >
            Today's Schedule
          </Link>
          <Link
            to="/dashboard/decorator/earnings"
            className="btn btn-lg btn-outline"
          >
            View Earnings
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default DecoratorDashboard;
