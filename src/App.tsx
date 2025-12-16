
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { ProductTable } from "./components/ProductTable";
import { PricingCalculator } from "./components/PricingCalculator";
import { ProductProvider } from "./contexts/ProductContext";
import { PricingProvider } from "./contexts/PricingContext";
import { ShippingProvider } from "./contexts/ShippingContext";
import { AutoPricingProvider } from "./contexts/AutoPricingContext";
import { AutoPricingModule } from "./pages/AutoPricing";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ProductProvider>
        <PricingProvider>
          <ShippingProvider>
            <AutoPricingProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/produtos" element={<ProductTable />} />
                    <Route path="/precificacao" element={<PricingCalculator />} />
                    <Route path="/precificacao-inteligente/*" element={<AutoPricingModule />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
              </BrowserRouter>
            </AutoPricingProvider>
          </ShippingProvider>
        </PricingProvider>
      </ProductProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
