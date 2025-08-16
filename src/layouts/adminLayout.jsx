import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";
const AdminLayout = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar - fixed width, full height */}
      <Sidebar />

      {/* Main panel (Header + Page) */}
      <div className="flex flex-col flex-1 h-full">
        {/* Fixed Header */}
        <Header />

        {/* Scrollable content only */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
