import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import AdminDashboard from "./pages/AdminDashboard";
import GroupLeaderDashboard from "./pages/GroupLeaderDashboard";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

import SectionsLayout from "./components/layouts/SectionsLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            {/* Public landing page */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Authentication route */}
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Protected main application */}
            <Route path="/app" element={
              <ProtectedRoute>
                <SectionsLayout />
              </ProtectedRoute>
            } />
            
            {/* Admin Dashboard (admin only) */}
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            {/* Group Leader Dashboard (group leader only) */}
            <Route path="/group-leader" element={
              <ProtectedRoute requiredRole="group_leader">
                <GroupLeaderDashboard />
              </ProtectedRoute>
            } />
            
            {/* Legacy page (also protected) */}
            <Route path="/legacy" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </AuthProvider>
</QueryClientProvider>
);

export default App;
