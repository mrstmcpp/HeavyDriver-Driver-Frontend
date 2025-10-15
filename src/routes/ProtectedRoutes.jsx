import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "../contexts/AuthContext.jsx";
import CarLoader from "../components/reusables/CarLoader.jsx";

export default function ProtectedRoutes({ children }) {
    const { authUser, loading } = useAuthStore();

    if (loading) {
        return <CarLoader message="Loading authentication status..."/>;
    }


    if (!authUser) {
        return <Navigate to="/login" replace />;
    }


    return children;
}
