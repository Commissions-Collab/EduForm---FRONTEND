import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
const UserLayout = () => {
  return (
    <div className="w-full">
      <Header />
      <Sidebar />
      <Outlet />
    </div>
  );
};

export default UserLayout;
