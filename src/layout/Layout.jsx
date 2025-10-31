import { useState } from "react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { Outlet } from "react-router-dom";
import SidebarComponent from "../components/Sidebar.jsx";
import { ScrollTop } from "primereact/scrolltop";

const Layout = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <div className="flex flex-col min-h-screen transition-colors duration-300 dark:bg-gray-900">
      <Header onMenuClick={() => setSidebarVisible(true)} />
      <SidebarComponent
        sidebarVisible={sidebarVisible}
        onHide={() => setSidebarVisible(false)}
      />
      <main className="flex-grow">
        <Outlet />
      </main>
      <ScrollTop
        icon={<i className="pi pi-arrow-up text-black text-lg" />}
        className="!bg-yellow-500 hover:!bg-yellow-600 transition-colors duration-300"
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
