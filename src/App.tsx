import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./hooks/useAuth";
import { ThemeProvider } from "./hooks/useTheme";
import { RequireAdmin, RequireAuth } from "./components/RouteGuards";

import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import IndiaAdmissions from "./pages/IndiaAdmissions";
import InternationalAdmissions from "./pages/InternationalAdmissions";
import Chat from "./pages/Chat";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";
import Admin from "./pages/Admin";
import DashboardRedirect from "./pages/DashboardRedirect";
import ProfileSettings from "./pages/ProfileSettings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/onboarding"
              element={
                <RequireAuth>
                  <Onboarding />
                </RequireAuth>
              }
            />
            <Route
              path="/dashboard/:profileId"
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <DashboardRedirect />
                </RequireAuth>
              }
            />
            <Route
              path="/profile-settings"
              element={
                <RequireAuth>
                  <ProfileSettings />
                </RequireAuth>
              }
            />
            <Route
              path="/profile-settings/:profileId"
              element={
                <RequireAuth>
                  <ProfileSettings />
                </RequireAuth>
              }
            />
            <Route
              path="/admissions/india"
              element={
                <RequireAuth>
                  <IndiaAdmissions />
                </RequireAuth>
              }
            />
            <Route
              path="/admissions/international"
              element={
                <RequireAuth>
                  <InternationalAdmissions />
                </RequireAuth>
              }
            />
            <Route
              path="/colleges"
              element={<Navigate to="/admissions/india" replace />}
            />
            <Route
              path="/chat"
              element={
                <RequireAuth>
                  <Chat />
                </RequireAuth>
              }
            />
            <Route
              path="/reports"
              element={
                <RequireAuth>
                  <Reports />
                </RequireAuth>
              }
            />
            <Route
              path="/notifications"
              element={
                <RequireAuth>
                  <Notifications />
                </RequireAuth>
              }
            />
            <Route
              path="/admin"
              element={
                <RequireAuth>
                  <RequireAdmin>
                    <Admin />
                  </RequireAdmin>
                </RequireAuth>
              }
            />

            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
