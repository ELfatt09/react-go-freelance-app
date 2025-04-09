import { useAuth } from "./authContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { auth } = useAuth();

  return auth ? children : <Navigate to="/auth/login" />;
};

export default ProtectedRoute;
