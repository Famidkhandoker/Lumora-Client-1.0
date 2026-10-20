
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import UserDashboard from "../pages/dashboard/user/UserDashboard";

const DashboardRedirect = () => {
  const { userRole, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

 
  if (userRole === "admin") {
    return <Navigate to="/dashboard/admin" replace />;
  }

  if (userRole === "decorator") {
    return <Navigate to="/dashboard/decorator" replace />;
  }

  return <UserDashboard />;
};

export default DashboardRedirect;

