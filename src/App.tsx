import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SectionDemo from "./pages/SectionDemo";
import NotFound from "./pages/NotFound";

// Mockup imports
import MockupHub from "./mockups/pages/MockupHub";
import DesignPlayground from "./mockups/pages/DesignPlayground";
import LayoutVariant1 from "./mockups/variants/LayoutVariant1";
import ColorVariant1 from "./mockups/variants/ColorVariant1";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={import.meta.env.PROD ? '/cost-discipleship' : ''}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sections" element={<SectionDemo />} />
          
          {/* Mockup Routes */}
          <Route path="/mockups" element={<MockupHub />} />
          <Route path="/mockups/playground" element={<DesignPlayground />} />
          <Route path="/mockups/layout-v1" element={<LayoutVariant1 />} />
          <Route path="/mockups/color-v1" element={<ColorVariant1 />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
