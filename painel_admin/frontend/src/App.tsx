import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { Login } from "@/pages/Login";
import { Dashboard } from "@/pages/Dashboard";
import { Users, UsersFromUrl } from "@/pages/Users";
import { Funnel } from "@/pages/Funnel";
import { UserDetail } from "@/pages/UserDetail";
import { Tasks } from "@/pages/Tasks";
import { Clones } from "@/pages/Clones";
import { Payments } from "@/pages/Payments";
import { Broadcast } from "@/pages/Broadcast";
import { Settings } from "@/pages/Settings";
import { Trial } from "@/pages/Trial";
import { Texts } from "@/pages/Texts";
import { Flows } from "@/pages/Flows";

const qc = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter basename="/admin">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/funil" element={<Funnel />} />
            <Route path="/users" element={<UsersFromUrl />} />
            <Route path="/vips" element={<Users vipOnly />} />
            <Route path="/testers" element={<Users testersOnly />} />
            <Route path="/vips-expirados" element={<Users expiredOnly />} />
            <Route path="/trial" element={<Trial />} />
            <Route path="/texts" element={<Texts />} />
            <Route path="/flows" element={<Flows />} />
            <Route path="/users/:id" element={<UserDetail />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/clones" element={<Clones />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/broadcast" element={<Broadcast />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
