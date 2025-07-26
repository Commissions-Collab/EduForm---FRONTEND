import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "./pages/auth/authLayout";
import SignIn from "./pages/auth/signIn";
import SignUp from "./pages/auth/signUp";
import NotFound from "./pages/NotFound";

import SuperAdminRoutes from "./routes/superAdminRoutes";
import AdminRoutes from "./routes/adminRoutes";
import UserRoutes from "./routes/userRoutes";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<AuthLayout />}>
            <Route index element={<SignIn />} />
            <Route path="sign-in" element={<SignIn />} />
            <Route path="sign-up" element={<SignUp />} />
          </Route>

          {/* Role-based Routes */}
          {SuperAdminRoutes}
          {AdminRoutes}
          {UserRoutes}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
