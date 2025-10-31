import "./App.css";
import { useEffect } from "react";
import axios from "axios";
import useAuthStore from "./contexts/AuthContext.jsx";
import { Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout.jsx";
import Login from "./components/auth/Login.jsx";
import Register from "./components/auth/Register.jsx";
import DashboardPage from "./components/pages/Dashboard.jsx";
import NotFound from "./components/404.jsx";
import RideDetailsOnMap from "./components/pages/RideDetailsOnMap.jsx";
import Earnings from "./components/pages/Earnings.jsx";
import Profile from "./components/pages/Profile.jsx";
import Settings from "./components/pages/Settings.jsx";
import MyRides from "./components/pages/MyRides.jsx";
import ProtectedRoutes from "./routes/ProtectedRoutes.jsx";
import RideNotificationManager from "./components/RideNotificationManager.jsx";
import ActiveRide from "./components/pages/ActiveRide.jsx";
import RideManager from "./components/RideManager.jsx";
import RideDetailsPage from "./components/pages/RideDetailsPage.jsx";
import Home from "./components/pages/Homepage.jsx";
import ScrollToTop from "./utils/ScrollToTop.jsx";

axios.defaults.withCredentials = true;
function App() {
  const { initializeAuth  } = useAuthStore();

  useEffect(() => {
    initializeAuth ();
  }, [initializeAuth ]);
  return (
    <>
      <RideNotificationManager />
      <ScrollToTop/>
      <RideManager />

      <Routes>
        <Route path="" element={<Layout />}>

          <Route index element={<Home />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoutes>
                <DashboardPage />
              </ProtectedRoutes>
            }
          />

          <Route
            path="/ride-active"
            element={
              <ProtectedRoutes>
                <ActiveRide />
              </ProtectedRoutes>
            }
          />

          <Route
            path="ride-details"
            element={
              <ProtectedRoutes>
                <RideDetailsOnMap />
              </ProtectedRoutes>
            }
          />
          <Route
            path="earnings"
            element={
              <ProtectedRoutes>
                <Earnings />
              </ProtectedRoutes>
            }
          />

          <Route
            path="rides/details/:bookingId"
            element={
              <ProtectedRoutes>
                <RideDetailsPage />
              </ProtectedRoutes>
            }
          />

          <Route
            path="profile"
            element={
              <ProtectedRoutes>
                <Profile />
              </ProtectedRoutes>
            }
          />
          <Route
            path="settings"
            element={
              <ProtectedRoutes>
                <Settings />
              </ProtectedRoutes>
            }
          />
          <Route
            path="rides/all"
            element={
              <ProtectedRoutes>
                <MyRides />
              </ProtectedRoutes>
            }
          />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
