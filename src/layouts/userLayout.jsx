import Header from "../components/Header";
import { Outlet } from "react-router-dom";
const UserLayout = () => {
  return (
    <div className="w-full">
      <Header />
      <Outlet />
    </div>
  );
};

export default UserLayout;
