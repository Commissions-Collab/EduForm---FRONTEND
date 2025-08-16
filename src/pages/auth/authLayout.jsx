import SchoolImage from "../../assets/images/CastanasBg.svg";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Left Side - Image (fixed, not scrollable) */}
      <div className="hidden xl:block w-1/2 h-full flex-shrink-0">
        <img
          src={SchoolImage}
          alt="School"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side - Scrollable Form Area */}
      <div className="flex flex-1 overflow-y-auto justify-center items-center bg-gray-50 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
