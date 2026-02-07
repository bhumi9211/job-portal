import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth(); // ✅ loading add

  // ✅ Loading state handle
  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  // ✅ isAuthenticated boolean check (null/undefined safe)
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  // ✅ Role check (user exists guaranteed now)
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
