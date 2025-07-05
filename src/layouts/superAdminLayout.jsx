import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
const SuperAdminLayout = () => {
  return (
    <div className="w-full">
      <Header />
      <Sidebar />
      <Outlet />
    </div>
  );
};

export default SuperAdminLayout;
