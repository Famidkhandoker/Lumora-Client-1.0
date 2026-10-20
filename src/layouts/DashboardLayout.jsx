// src/layouts/DashboardLayout.jsx
import { Outlet, Link, NavLink } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import { useAuth } from "../contexts/AuthContext";
import { useSiteSettings } from "../contexts/SiteSettingsContext";
import { motion } from "framer-motion";
import { Logo } from "../components/Logo";
import {
  FiHome,
  FiUser,
  FiCalendar,
  FiCreditCard,
  FiGrid,
  FiPackage,
  FiUsers,
  FiBarChart2,
  FiMenu,
  FiX,
  FiBriefcase,
  FiClock,
  FiDollarSign,
  FiSettings,
  FiGift,
  FiLogOut,
} from "react-icons/fi";
import { useState } from "react";

const DashboardLayout = () => {
  const { user, userRole, logoutUser } = useAuth();
  const { settings } = useSiteSettings();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // User Navigation Links
  const userLinks = [
    { to: "/dashboard", label: "Overview", icon: FiGrid, end: true },
    { to: "/dashboard/my-profile", label: "My Profile", icon: FiUser },
    { to: "/dashboard/my-bookings", label: "My Bookings", icon: FiCalendar },
    {
      to: "/dashboard/payment-history",
      label: "Payment History",
      icon: FiCreditCard,
    },
  ];

  // Admin Navigation Links
  const adminLinks = [
    {
      to: "/dashboard/admin",
      label: "Admin Dashboard",
      icon: FiGrid,
      end: true,
    },
    {
      to: "/dashboard/admin/services",
      label: "Manage Services",
      icon: FiPackage,
    },
    {
      to: "/dashboard/admin/bookings",
      label: "Manage Bookings",
      icon: FiCalendar,
    },
    {
      to: "/dashboard/admin/decorators",
      label: "Manage Decorators",
      icon: FiUsers,
    },
    { to: "/dashboard/admin/analytics", label: "Analytics", icon: FiBarChart2 },
    { to: "/dashboard/admin/settings", label: "Site Appearance", icon: FiSettings },
    { to: "/dashboard/admin/promotions", label: "Offers & Events", icon: FiGift },
  ];

  // Decorator Navigation Links
  const decoratorLinks = [
    {
      to: "/dashboard/decorator",
      label: "Decorator Dashboard",
      icon: FiGrid,
      end: true,
    },
    {
      to: "/dashboard/decorator/projects",
      label: "My Projects",
      icon: FiBriefcase,
    },
    {
      to: "/dashboard/decorator/schedule",
      label: "Today's Schedule",
      icon: FiClock,
    },
    {
      to: "/dashboard/decorator/earnings",
      label: "Earnings",
      icon: FiDollarSign,
    },
  ];

  // Select appropriate links based on user role
  let links = userLinks;
  if (userRole === "admin") links = adminLinks;
  if (userRole === "decorator") links = decoratorLinks;

  return (
    <div className="min-h-screen bg-base-200">
      <ScrollToTop />
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-20 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="btn btn-circle bg-base-100 shadow-lg"
        >
          {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: sidebarOpen || window.innerWidth >= 1024 ? 0 : -300 }}
          className={`
            fixed lg:sticky top-0 left-0 h-screen w-64 bg-base-100 shadow-xl z-40 pt-24 lg:pt-24
            ${sidebarOpen ? "block" : "hidden lg:block"}
          `}
        >
          <div className="p-6 overflow-y-auto h-full flex flex-col">
            {/* Brand — Lumora logo (same as navbar) */}
            <div className="flex items-center justify-center mb-8 px-1">
              <Logo />
            </div>

            {/* User Info */}
            <div
              className="flex items-center space-x-3 mb-8 p-3 rounded-xl"
              style={{ background: "var(--lum-skysoft)", border: "1px solid color-mix(in srgb, var(--lum-primary) 35%, transparent)" }}
            >
              <img
                src={user?.photoURL || "https://i.ibb.co/3YRjQxv/user.png"}
                alt={user?.displayName}
                className="w-11 h-11 rounded-full object-cover flex-shrink-0"
                style={{ border: "2px solid var(--lum-primary)" }}
              />
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">{user?.displayName}</p>
                <p className="text-xs capitalize" style={{ color: "var(--lum-text)" }}>
                  {userRole === "user" ? "Customer" : userRole}
                </p>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-2">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.end}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${isActive
                        ? "text-white shadow-sm"
                        : "text-base-content hover:bg-base-200"
                      }`
                    }
                    style={({ isActive }) =>
                      isActive
                        ? { background: "linear-gradient(135deg, var(--lum-primary), var(--lum-accent))" }
                        : undefined
                    }
                  >
                    <Icon size={20} />
                    <span className="font-medium">{link.label}</span>
                  </NavLink>
                );
              })}
            </nav>

            {/* Back to Home Link */}
            <div className="mt-8 pt-6 border-t border-base-200">
              <Link
                to="/"
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-base-content hover:bg-base-200 transition-all"
              >
                <FiHome size={20} />
                <span className="font-medium">Back to Home</span>
              </Link>
            </div>

            {/* Logout (bottom) */}
            <div className="mt-auto pt-6 border-t border-base-200">
              <button
                onClick={() => {
                logoutUser();
                window.location.href = "/";
              }}
                className="flex w-full items-center space-x-3 px-4 py-3 rounded-xl text-base-content hover:bg-base-200 transition-all"
              >
                <FiLogOut size={20} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 pt-24 lg:pt-28">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
