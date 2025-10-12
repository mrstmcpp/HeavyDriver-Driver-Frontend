import { Outlet } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-gray-900 dark:text-yellow-400 transition-colors duration-300">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
