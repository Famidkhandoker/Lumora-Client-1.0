
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

export const DecoratorRoute = ({ children }) => {
  const { user, userRole, loading } = useAuth();


  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }


  if (userRole === "decorator" || userRole === "admin") {
    return children;
  }

  if (userRole === "admin") {
    return <Navigate to="/dashboard/admin" replace />;
  }

  return <Navigate to="/dashboard" replace />;
};

export default DecoratorRoute;
