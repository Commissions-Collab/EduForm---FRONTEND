import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
const AdminLayout = () => {
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

export default AdminLayout;
