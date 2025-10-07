import { Navigate } from "react-router-dom";
import { useAuth } from "../store/useAuth";

export default function AdminRoute({ children }) {
  const { token, user } = useAuth();
  return token ? children : <Navigate to="/login" />;
}
