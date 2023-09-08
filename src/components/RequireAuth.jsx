import { Navigate } from "react-router-dom";

export const RequireAuth = ({ children }) => {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    return <Navigate to="/login" />;
  }
  return children;
};
