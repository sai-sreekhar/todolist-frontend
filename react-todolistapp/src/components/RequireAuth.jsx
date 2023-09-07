import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export const RequireAuth = ({ children }) => {
  const auth = useAuth();
  const userId = localStorage.getItem("userId");
  if (!userId) {
    return <Navigate to="/login" />;
  }
  return children;
};
