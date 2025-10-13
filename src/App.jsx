import "./App.css";
import { Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout.jsx";
import Login from "./components/auth/Login.jsx";
import Register from "./components/auth/Register.jsx";
import DashboardPage from "./components/pages/Dashboard.jsx";
import NotFound from "./components/404.jsx";
import ActiveRide from "./components/pages/ActiveRide.jsx";
import Earnings from "./components/pages/Earnings.jsx";
import Profile from "./components/pages/Profile.jsx";
import Settings from "./components/pages/Settings.jsx";
import MyRides from "./components/pages/MyRides.jsx"; 

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="active-ride" element={<ActiveRide />} />
          <Route path="earnings" element={<Earnings />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="rides" element={<MyRides />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
