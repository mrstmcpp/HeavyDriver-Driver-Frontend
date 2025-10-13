import { Link } from "react-router-dom";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import DriverStatusButton from "./reusables/DriverStatusButton.jsx";

const SidebarComponent = ({ sidebarVisible, onHide }) => {
  return (
    <Sidebar
      visible={sidebarVisible}
      onHide={onHide}
      position="left"
      className="w-64 bg-gray-900 text-white"
    >
      <div className="flex flex-col h-full">
        <div>
          <div className="flex items-center justify-center h-20 bg-yellow-500 mb-4">
            <h1 className="text-2xl font-bold text-gray-900">HeavyDriver</h1>
          </div>

          <div className="px-4 py-2 mb-4">
            <DriverStatusButton />
          </div>

          <h2 className="text-xl font-semibold mb-4 px-4 text-gray-300">
            Menu
          </h2>
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                onClick={onHide}
                className="flex items-center px-4 py-3 rounded-lg mx-2 hover:bg-yellow-600 hover:text-black transition-colors duration-200"
              >
                <i className="pi pi-th-large mr-4 text-xl"></i>Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/rides"
                onClick={onHide}
                className="flex items-center px-4 py-3 rounded-lg mx-2 hover:bg-yellow-600 hover:text-black transition-colors duration-200"
              >
                <i className="pi pi-car mr-4 text-xl"></i>My Rides
              </Link>
            </li>
            <li>
              <Link
                to="/earnings"
                onClick={onHide}
                className="flex items-center px-4 py-3 rounded-lg mx-2 hover:bg-yellow-600 hover:text-black transition-colors duration-200"
              >
                <i className="pi pi-dollar mr-4 text-xl"></i>Earnings
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                onClick={onHide}
                className="flex items-center px-4 py-3 rounded-lg mx-2 hover:bg-yellow-600 hover:text-black transition-colors duration-200"
              >
                <i className="pi pi-cog mr-4 text-xl"></i>Settings
              </Link>
            </li>
          </ul>
        </div>

        <div className="mt-auto p-4 border-t border-gray-700">
          <Link
            to="/profile"
            onClick={onHide}
            className="flex items-center space-x-3 p-3 rounded-lg bg-gray-800 hover:bg-yellow-600 hover:text-black transition-colors duration-200"
          >
            <i className="pi pi-user text-3xl"></i>
            <div>
              <h3 className="font-semibold text-lg">Satyam Prajapati</h3>
              <p className="text-sm text-gray-400">Driver</p>
            </div>
          </Link>

          <Button
            label="Logout"
            icon="pi pi-sign-out"
            className="w-full mt-3 p-button-text p-button-danger justify-content-center"
          />
        </div>
      </div>
    </Sidebar>
  );
};

export default SidebarComponent;
