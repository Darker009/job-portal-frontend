import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Forbidden from "../../pages/forbidden/Forbidden"; // Import the Forbidden component

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (!allowedRoles.includes(user.role)) {
    return <Forbidden />;
  }
  return children;
};

export default ProtectedRoute;