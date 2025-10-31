import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import useAuthStore from "../contexts/AuthContext.jsx";
import axios from "axios";
import { useNotification } from "../contexts/NotificationContext.jsx";
import useBookingStore from "../contexts/BookingContext.jsx";
import { useSocket } from "../contexts/SocketContext.jsx";
import profilePic from "../assets/man2.png";
import { Button } from "primereact/button";

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
  const { connected } = useSocket();

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

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_AUTH_BACKEND_URL}/signout`,
        {},
        { withCredentials: true }
      );
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

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
          <div className="flex flex-row items-center gap-4">
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="flex items-center gap-2 focus:outline-none hover:opacity-90 transition"
            >
              <img
                src={authUser.profilePic || profilePic}
                alt="Driver DP"
                className={`h-10 w-10 rounded-full border-3 ${
                  connected ? "border-green-500" : "border-gray-500"
                }`}
              />
              <i className="fa-solid fa-chevron-down text-yellow-400 dark:text-gray-900 text-lg"></i>
            </button>

            {open && (
              <div
                className="absolute right-0 top-full mt-2 w-44 
                 dark:bg-gray-900
                text-yellow-300 dark:text-gray-200 
                rounded-lg shadow-lg border 
                border-yellow-600/20 dark:border-gray-400 
                overflow-hidden z-50 animate-fadeIn"
              >
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-800 dark:hover:bg-gray-800 transition"
                >
                  <i className="fa-solid fa-user text-yellow-400 dark:text-gray-400"></i>
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 
                  hover:bg-gray-800 dark:hover:bg-gray-800 transition"
                >
                  <i className="fa-solid fa-right-from-bracket text-yellow-400 dark:text-gray-400"></i>
                  Logout
                </button>
              </div>
            )}
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
