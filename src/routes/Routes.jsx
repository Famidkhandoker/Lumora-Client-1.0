
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Home from "../pages/Home";
import Services from "../pages/Services";
import ServiceDetails from "../pages/ServiceDetails";
import Login from "../pages/Login";
import Register from "../pages/Register";
import About from "../pages/About";
import Contact from "../pages/Contact";
import ServiceCoverageMap from "../pages/ServiceCoverageMap";
import ErrorPage from "../pages/ErrorPage";
import PaymentSuccess from "../pages/PaymentSuccess";
import PaymentCancel from "../pages/PaymentCancel";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import DecoratorRoute from "./DecoratorRoute";

// Dashboard Pages
import UserDashboard from "../pages/dashboard/user/UserDashboard";
import MyBookings from "../pages/dashboard/user/MyBookings";
import PaymentHistory from "../pages/dashboard/user/PaymentHistory";
import MyProfile from "../pages/dashboard/user/MyProfile";

import AdminDashboard from "../pages/dashboard/admin/AdminDashboard";
import ManageServices from "../pages/dashboard/admin/ManageServices";
import ManageBookings from "../pages/dashboard/admin/ManageBookings";
import ManageDecorators from "../pages/dashboard/admin/ManageDecorators";
import Analytics from "../pages/dashboard/admin/Analytics";
import SiteSettings from "../pages/dashboard/admin/SiteSettings";
import ManagePromotions from "../pages/dashboard/admin/ManagePromotions";

import DecoratorDashboard from "../pages/dashboard/decorator/DecoratorDashboard";
import MyProjects from "../pages/dashboard/decorator/MyProjects";
import TodaySchedule from "../pages/dashboard/decorator/TodaySchedule";
import Earnings from "../pages/dashboard/decorator/Earnings";

export const router = createBrowserRouter([
  // Main Website Routes
  {
    path: "/",
    element: <MainLayout />,
    // errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/services",
        element: <Services />,
      },
      {
        path: "/services/:id",
        element: <ServiceDetails />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/coverage-map",
        element: <ServiceCoverageMap />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/payment/success",
        element: (
          <PrivateRoute>
            <PaymentSuccess />
          </PrivateRoute>
        ),
      },
      {
        path: "/payment/cancel",
        element: (
          <PrivateRoute>
            <PaymentCancel />
          </PrivateRoute>
        ),
      },
    ],
  },

  // Dashboard Routes
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      // User Routes (Default - shows UserDashboard at /dashboard)
      {
        index: true,
        element: <UserDashboard />,
      },
      {
        path: "my-profile",
        element: <MyProfile />,
      },
      {
        path: "my-bookings",
        element: <MyBookings />,
      },
      {
        path: "payment-history",
        element: <PaymentHistory />,
      },

      // Admin Routes
      {
        path: "admin",
        element: (
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        ),
      },
      {
        path: "admin/services",
        element: (
          <AdminRoute>
            <ManageServices />
          </AdminRoute>
        ),
      },
      {
        path: "admin/bookings",
        element: (
          <AdminRoute>
            <ManageBookings />
          </AdminRoute>
        ),
      },
      {
        path: "admin/decorators",
        element: (
          <AdminRoute>
            <ManageDecorators />
          </AdminRoute>
        ),
      },
      {
        path: "admin/analytics",
        element: (
          <AdminRoute>
            <Analytics />
          </AdminRoute>
        ),
      },
      {
        path: "admin/settings",
        element: (
          <AdminRoute>
            <SiteSettings />
          </AdminRoute>
        ),
      },
      {
        path: "admin/promotions",
        element: (
          <AdminRoute>
            <ManagePromotions />
          </AdminRoute>
        ),
      },

      // Decorator Routes
      {
        path: "decorator",
        element: (
          <DecoratorRoute>
            <DecoratorDashboard />
          </DecoratorRoute>
        ),
      },
      {
        path: "decorator/projects",
        element: (
          <DecoratorRoute>
            <MyProjects />
          </DecoratorRoute>
        ),
      },
      {
        path: "decorator/schedule",
        element: (
          <DecoratorRoute>
            <TodaySchedule />
          </DecoratorRoute>
        ),
      },
      {
        path: "decorator/earnings",
        element: (
          <DecoratorRoute>
            <Earnings />
          </DecoratorRoute>
        ),
      },
    ],
  },
]);
