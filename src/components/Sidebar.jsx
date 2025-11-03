import { Link, useNavigate } from "react-router-dom";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import DriverStatusButton from "./reusables/DriverStatusButton.jsx";
import useAuthStore from "../contexts/AuthContext.jsx";
import axios from "axios";

const SidebarComponent = ({ sidebarVisible, onHide }) => {
  const { authUser, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_AUTH_BACKEND_URL}/signout`, {}, { withCredentials: true });
      window.location.href = "/login"; // redirect after logout
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (loading) return <div className="text-center text-gray-500 mt-10">Loading...</div>;

  return (
    <Sidebar
      visible={sidebarVisible}
      onHide={onHide}
      position="left"
      className="w-64 bg-gray-900 text-white"
    >
      <div className="flex flex-col h-full">
        <div>
          <div className="flex items-center justify-center h-20 bg-yellow-400 mb-4 rounded-2xl" onClick={() => navigate("/")}>
            <h1 className="text-2xl font-bold text-gray-900 cursor-pointer">HeavyDriver</h1>
          </div>


          {authUser ? (
            <>
              <div className="px-4 py-2 mb-4">
                <DriverStatusButton />
              </div>

              <h2 className="text-xl font-semibold mb-4 px-4 text-gray-300">Menu</h2>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/dashboard"
                    onClick={onHide}
                    className="flex items-center px-4 py-3 rounded-lg mx-2 hover:bg-yellow-400 hover:text-black transition-colors duration-200"
                  >
                    <i className="pi pi-th-large mr-4 text-xl"></i>Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/rides/all"
                    onClick={onHide}
                    className="flex items-center px-4 py-3 rounded-lg mx-2 hover:bg-yellow-400 hover:text-black transition-colors duration-200"
                  >
                    <i className="pi pi-car mr-4 text-xl"></i>My Rides
                  </Link>
                </li>
                <li>
                  <Link
                    to="/earnings"
                    onClick={onHide}
                    className="flex items-center px-4 py-3 rounded-lg mx-2 hover:bg-yellow-400 hover:text-black transition-colors duration-200"
                  >
                    <i className="pi pi-dollar mr-4 text-xl"></i>Earnings
                  </Link>
                </li>
                <li>
                  <Link
                    to="/settings"
                    onClick={onHide}
                    className="flex items-center px-4 py-3 rounded-lg mx-2 hover:bg-yellow-400 hover:text-black transition-colors duration-200"
                  >
                    <i className="pi pi-cog mr-4 text-xl"></i>Settings
                  </Link>
                </li>

                <li>
                  <Link
                    to="/verification"
                    onClick={onHide}
                    className="flex items-center px-4 py-3 rounded-lg mx-2 hover:bg-yellow-400 hover:text-black transition-colors duration-200"
                  >
                    <i className="pi pi-verified mr-4 text-xl"></i>Verification
                  </Link>
                </li>
              </ul>
            </>
          ) : (
            /*Guest (Not Logged In) View */
            <div className="flex flex-col items-center justify-center mt-10 space-y-4">
              <p className="text-gray-400 text-center px-4">
                Please log in to access your dashboard and driver tools.
              </p>
              <Link to="/login" onClick={onHide}>
                <Button label="Login" icon="pi pi-sign-in" className="w-40 !bg-yellow-400 hover:bg-yellow-600" />
              </Link>
              <Link to="/register" onClick={onHide}>
                <Button label="Register" icon="pi pi-user-plus" className="w-40 !bg-yellow-400 hover:bg-yellow-600" />
              </Link>
            </div>
          )}
        </div>

        {/* Footer Section*/}
        {authUser && (
          <div className="mt-auto px-4 py-8 border-t border-gray-700">
            <Link
              to="/profile"
              onClick={onHide}
              className="flex items-center space-x-3 p-3 rounded-lg bg-gray-800 hover:bg-gray-600 hover:text-white transition-colors duration-200"
            >
              <i className="pi pi-user text-3xl"></i>
              <div>
                <h3 className="font-semibold text-lg">{authUser.name || "Driver"}</h3>
                <p className="text-sm text-gray-400">{authUser.role || "Driver"}</p>
              </div>
            </Link>

            <Button
              label="Logout"
              icon="pi pi-sign-out"
              className="w-full !mt-4 p-button-text !text-red-500 justify-content-center"
              onClick={handleLogout}
            />
          </div>
        )}
      </div>
    </Sidebar>
  );
};

export default SidebarComponent;
