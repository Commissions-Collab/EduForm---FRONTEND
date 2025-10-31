import React, { useEffect, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import useAuthStore from "./stores/auth";
import AuthLayout from "./pages/auth/authLayout";
import SignIn from "./pages/auth/signIn";
import SignUp from "./pages/auth/signUp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import NotFound from "./pages/NotFound";
import SuperAdminRoutes from "./routes/superAdminRoutes";
import AdminRoutes from "./routes/adminRoutes";
import UserRoutes from "./routes/userRoutes";
import LoadingPage from "./components/common/LoadingPage";
import NotificationsPage from "./pages/NotificationsPage";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  const { initializeAuth, checkAuth, isCheckingAuth, isPostLoginLoading } =
    useAuthStore();

  useEffect(() => {
    initializeAuth();
    checkAuth();
  }, [initializeAuth, checkAuth]);

  if (isCheckingAuth || isPostLoginLoading) {
    return <LoadingPage />;
  }

  return (
    <>
      <Toaster position="top-center" />
      <BrowserRouter>
        <Suspense fallback={<LoadingPage />}>
          <Routes>
            <Route element={<AuthLayout />}>
              <Route index element={<SignIn />} />
              <Route path="sign-in" element={<SignIn />} />
              <Route path="sign-up" element={<SignUp />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="reset-password" element={<ResetPassword />} />
            </Route>

            {SuperAdminRoutes}
            {AdminRoutes}
            {UserRoutes}

            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <NotificationsPage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;
