import { BrowserRouter, Navigate, Route, Routes, useParams } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { Login } from "@/pages/Login";
import { Dashboard } from "@/pages/Dashboard";
import { Users, UsersFromUrl } from "@/pages/Users";
import { Funnel } from "@/pages/Funnel";
import { UserDetail } from "@/pages/UserDetail";
import { Tasks, TASK_SLUGS } from "@/pages/Tasks";
import { Payments } from "@/pages/Payments";
import { Broadcast } from "@/pages/Broadcast";
import { Settings } from "@/pages/Settings";
import { Trial } from "@/pages/Trial";
import { Texts } from "@/pages/Texts";
import { StartFlow } from "@/pages/StartFlow";

const qc = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

/** /tasks/<slug> -> subaba de Tarefas; slug desconhecido volta pra Clone. */
function TasksFromUrl() {
  const { slug = "" } = useParams();
  const tab = TASK_SLUGS[slug];
  if (!tab) return <Navigate to="/tasks/clones" replace />;
  return <Tasks key={slug} tab={tab} />;
}

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
            <Route path="/vips" element={<Users key="vips" vipOnly />} />
            <Route path="/testers" element={<Users key="testers" testersOnly />} />
            <Route path="/vips-expirados" element={<Users key="expired" expiredOnly />} />
            <Route path="/trial" element={<Trial />} />
            <Route path="/texts" element={<Texts />} />
            <Route path="/fluxo-inicial" element={<StartFlow />} />
            <Route path="/flows" element={<Navigate to="/fluxo-inicial" replace />} />
            <Route path="/users/:id" element={<UserDetail />} />
            <Route path="/tasks" element={<Navigate to="/tasks/clones" replace />} />
            <Route path="/tasks/:slug" element={<TasksFromUrl />} />
            {/* endereço antigo de "Clones ao vivo" — agora dentro de Tarefas › Clone */}
            <Route path="/clones" element={<Navigate to="/tasks/clones" replace />} />
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
