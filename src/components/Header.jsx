import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../contexts/AuthContext.jsx";
import axios from "axios";

const Header = ({ onMenuClick }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { authUser, loading } = useAuthStore();


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


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
      className={`flex items-center justify-between px-6 py-4 transition-colors duration-300
      bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300
      dark:from-gray-900 dark:via-gray-800 dark:to-gray-700
      text-gray-900 dark:text-yellow-400
      shadow-[0_4px_12px_rgba(255,215,0,0.1)] border-b
      border-gray-400 dark:border-yellow-600/30`}
    >

      <button
        onClick={onMenuClick}
        className="p-2 rounded-md border border-yellow-400 
                  hover:bg-yellow-400/10 
                  dark:border-gray-600 dark:hover:bg-gray-400/20"
      >
        <i className="pi pi-bars text-xl text-yellow-500"></i>
      </button>


      <h1
        className="text-2xl font-bold tracking-wide 
        drop-shadow-[0_1px_3px_rgba(255,255,0,0.3)] 
        dark:drop-shadow-none"
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
                src={
                  authUser.profilePic ||
                  "https://cdn-icons-png.flaticon.com/512/1535/1535791.png"
                }
                alt="Driver DP"
                className="w-10 h-10 rounded-full border-2 border-yellow-400 shadow-[0_0_6px_rgba(255,255,0,0.4)] 
                dark:border-gray-600 dark:shadow-[0_0_6px_rgba(128,128,128,0.4)]"
              />
              <i className="fa-solid fa-chevron-down text-yellow-400 dark:text-gray-900 text-lg"></i>
            </button>

            {open && (
              <div
                className="absolute right-0 top-full mt-2 w-44 
                bg-gray-800 dark:bg-gray-200 
                text-yellow-300 dark:text-gray-900 
                rounded-lg shadow-lg border 
                border-yellow-600/20 dark:border-gray-400 
                overflow-hidden z-50 animate-fadeIn"
              >
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-700/70 dark:hover:bg-gray-300/70 transition"
                >
                  <i className="fa-solid fa-user text-yellow-400 dark:text-gray-900"></i>
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 
                  hover:bg-gray-700/70 dark:hover:bg-gray-300/70 transition"
                >
                  <i className="fa-solid fa-right-from-bracket text-yellow-400 dark:text-gray-900"></i>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (

          <div className="flex gap-3">
            <Link
              to="/login"
              className="px-4 py-2 bg-yellow-500 text-gray-900 font-semibold rounded-lg hover:bg-yellow-600 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 border border-yellow-400 rounded-lg hover:bg-yellow-400/10 transition text-yellow-500"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
