import { useState } from "react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { Outlet } from "react-router-dom";
import SidebarComponent from "../components/Sidebar.jsx";

const Layout = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <div className="flex flex-col min-h-screen transition-colors duration-300 bg-gray-100 dark:bg-gray-900">
      <Header onMenuClick={() => setSidebarVisible(true)} />
      <SidebarComponent sidebarVisible={sidebarVisible} onHide={() => setSidebarVisible(false)} />
      <main className="flex-grow p-6">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
