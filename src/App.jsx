import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AuthLayout from "./pages/auth/authLayout";

import SignIn from "./pages/auth/signIn";
import SignUp from "./pages/auth/signUp";
import NotFound from "./pages/NotFound";
import SuperAdminRoutes from "./routes/superAdminRoutes";
import AdminRoutes from "./routes/adminRoutes";
import UserRoutes from "./routes/userRoutes";

function App() {
  return (
    <main className="flex h-screen">
      <BrowserRouter>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route index element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
          </Route>

          {SuperAdminRoutes}
          {AdminRoutes}
          {UserRoutes}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
