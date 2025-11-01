import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import useAuthStore from "../contexts/AuthContext.jsx";
import axios from "axios";
import { useNotification } from "../contexts/NotificationContext.jsx";
import useBookingStore from "../contexts/BookingContext.jsx";
import { useSocket } from "../contexts/SocketContext.jsx";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";

const Header = ({ onMenuClick }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { authUser, userId, loading } = useAuthStore();
  const { showToast } = useNotification();

  const activeBooking = useBookingStore((state) => state.activeBooking);
  const fetchActiveBooking = useBookingStore(
    (state) => state.fetchActiveBooking
  );
  const loadingBooking = useBookingStore((state) => state.loadingBooking);

  const fetchedOnce = useRef(false);
  const { connected, isDriverOnline, goOnline, goOffline } = useSocket();

  useEffect(() => {
    if (
      !loading &&
      userId &&
      !loadingBooking &&
      !activeBooking &&
      !fetchedOnce.current
    ) {
      fetchedOnce.current = true;
      fetchActiveBooking();
    }
  }, [loading, userId, loadingBooking, activeBooking, fetchActiveBooking]);

  useEffect(() => {
    if (activeBooking && location.pathname !== "/ride-active") {
      navigate("/ride-active");
    }
  }, [activeBooking, location.pathname, navigate]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (activeBooking) {
        e.preventDefault();
        e.returnValue = "";
        showToast(
          "warn",
          "Ride In Progress",
          "You cannot leave the page while a ride is active."
        );
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [activeBooking, showToast]);

  const handleProtectedNavigation = (e, path) => {
    if (activeBooking && location.pathname !== "/ride-active") {
      e.preventDefault();
      showToast(
        "warn",
        "Ride In Progress",
        "You cannot change pages while a ride is active."
      );
    } else {
      navigate(path);
    }
  };

  // const handleLogout = async () => {
  //   try {
  //     await axios.post(
  //       `${import.meta.env.VITE_AUTH_BACKEND_URL}/signout`,
  //       {},
  //       { withCredentials: true }
  //     );
  //     window.location.href = "/login";
  //   } catch (err) {
  //     console.error("Logout failed:", err);
  //   }
  // };

  // const handleToggle = (value) => {
  //   if (value) goOnline();
  //   else goOffline();
  // };

  return (
    <header
      className={`sticky top-0 z-50 flex items-center justify-between px-6 py-4 transition-colors duration-300
      bg-gradient-to-r
      dark:from-gray-900 dark:via-gray-800 dark:to-gray-700
       dark:text-yellow-400
      shadow-[0_4px_12px_rgba(255,215,0,0.1)] border-b
      ${connected ? "border-green-400" : "border-yellow-400"}`}
    >
      <button
        onClick={onMenuClick}
        className={`p-2 rounded-md border ${
          connected ? "border-green-400" : "border-yellow-400"
        } 
                hover:bg-yellow-400/10`}
      >
        <i
          className={`pi pi-bars text-xl ${
            connected ? "text-green-400" : "text-yellow-400"
          }`}
        ></i>
      </button>

      <h1
        className={`text-4xl font-bold tracking-wide cursor-pointer ${
          connected ? "text-green-400" : "text-yellow-400"
        }`}
        onClick={() => navigate("/")}
      >
        HeavyDriver
      </h1>

      <div className="relative" ref={dropdownRef}>
        {loading ? (
          <div className="text-gray-400 text-sm">Loading...</div>
        ) : authUser ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-gray-800/40 border border-gray-600 text-xs">
              {/* <InputSwitch
                checked={isDriverOnline}
                onChange={(e) => handleToggle(e.value)}
                disabled={isDriverOnline && !connected}
                className="scale-75"
              /> */}

              <>
                <Tooltip target=".status-indicator" />

                {!isDriverOnline ? (
                  <span
                    className="status-indicator flex items-center gap-1 text-gray-300"
                    data-pr-tooltip="Currently offline. You won’t receive ride requests."
                    data-pr-position="bottom"
                  >
                    <i className="pi pi-times-circle text-gray-400 text-sm"></i>
                    Offline
                  </span>
                ) : connected ? (
                  <span
                    className="status-indicator flex items-center gap-1 text-green-400"
                    data-pr-tooltip="Online — ready to accept new ride requests!"
                    data-pr-position="bottom"
                  >
                    <i className="pi pi-check-circle text-green-400 text-sm"></i>
                    Online
                  </span>
                ) : (
                  <span
                    className="status-indicator flex items-center gap-1 text-yellow-400"
                    data-pr-tooltip="Connecting to server. Please wait..."
                    data-pr-position="bottom"
                  >
                    <i className="pi pi-spinner pi-spin text-yellow-400 text-sm"></i>
                    Connecting...
                  </span>
                )}
              </>
            </div>
          </div>
        ) : (
          <div className="flex gap-3">
            <Button
              label="Login"
              icon="pi pi-sign-in"
              className="p-button-outlined p-button-warning font-semibold "
              onClick={() => navigate("/login")}
            />
            <Button
              label="Sign Up"
              icon="pi pi-user-plus"
              className="p-button-warning font-semibold text-black"
              onClick={() => navigate("/register")}
            />
          </div>
        )}
      </div>
    </header>
  );
};

export default React.memo(Header);
