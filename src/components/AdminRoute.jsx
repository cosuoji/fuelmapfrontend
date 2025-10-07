import { Navigate } from "react-router-dom";
import { useAuth } from "../store/useAuth";

export default function AdminRoute({ children }) {
  const { token, user } = useAuth();
  console.log(user)
  return token ? children : <Navigate to="/login" />;
}
