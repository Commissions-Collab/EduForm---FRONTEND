import SchoolImage from "../../assets/images/CandaBg2.svg";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <>
      <img
        src={SchoolImage}
        alt="sample img"
        className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
      />
      <section className="flex flex-1 justify-center items-center flex-col">
        <Outlet />
      </section>
    </>
  );
};

export default AuthLayout;
