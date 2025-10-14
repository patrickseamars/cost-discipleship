import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import AdminDashboard from "./pages/AdminDashboard";
import GroupLeaderDashboard from "./pages/GroupLeaderDashboard";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Mockup imports
import MockupHub from "./mockups/pages/MockupHub";
import DesignPlayground from "./mockups/pages/DesignPlayground";
import LayoutVariant1 from "./mockups/variants/LayoutVariant1";
import LayoutVariant2 from "./mockups/variants/LayoutVariant2";
import LayoutVariant2Enhanced from "./mockups/variants/LayoutVariant2Enhanced";
import SectionsLayout from "./components/layouts/SectionsLayout";
import ColorVariant1 from "./mockups/variants/ColorVariant1";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Authentication route */}
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Protected main application */}
            <Route path="/" element={
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
          
          {/* Mockup Routes */}
          <Route path="/mockups" element={<MockupHub />} />
          <Route path="/mockups/playground" element={<DesignPlayground />} />
          <Route path="/mockups/layout-v1" element={<LayoutVariant1 />} />
          <Route path="/mockups/layout-v2" element={<LayoutVariant2 />} />
          <Route path="/mockups/layout-v2-enhanced" element={<LayoutVariant2Enhanced />} />
          <Route path="/mockups/color-v1" element={<ColorVariant1 />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </AuthProvider>
</QueryClientProvider>
);

export default App;
