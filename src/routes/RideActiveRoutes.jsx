import useAuthStore from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import CarLoader from "../components/reusables/CarLoader";

export default function RideActiveRoutes({ children }) {
  const { activeBooking, loading } = useAuthStore();

  if (loading) {
    return <CarLoader message="Loading ride status..." />;
  }

  if (!activeBooking) {
    return <Navigate to="/" replace />;
  }

  return children;
}
