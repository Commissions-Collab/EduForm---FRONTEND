import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
const UserLayout = () => {
  return (
    <main className="flex min-h-screen w-full">
      <Sidebar />
      <section className="flex flex-col flex-1 w-full">
        <Header />
        <div className="main-content flex-1">
          <Outlet />
        </div>
      </section>
    </main>
  );
};

export default UserLayout;
