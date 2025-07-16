import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";
const SuperAdminLayout = () => {
  return (
    <main className="flex min-h-screen w-full">
      <Sidebar />
      <section className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <div className="main-content flex-1 overflow-y-auto p-6 ">
          <Outlet />
        </div>
      </section>
    </main>
  );
};

export default SuperAdminLayout;
