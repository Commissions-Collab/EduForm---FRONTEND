import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
const AdminLayout = () => {
  return (
    <main className="flex min-h-screen w-full">
      <Sidebar />
      <section className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto p-6 ">
          <Outlet />
        </div>
      </section>
    </main>
  );
};

export default AdminLayout;
