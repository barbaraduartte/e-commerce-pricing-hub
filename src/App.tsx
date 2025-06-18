
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { ProductTable } from "./components/ProductTable";
import { PricingCalculator } from "./components/PricingCalculator";
import { TireRegistration } from "./components/TireRegistration";
import { ProductProvider } from "./contexts/ProductContext";
import { PricingProvider } from "./contexts/PricingContext";
import { ShippingProvider } from "./contexts/ShippingContext";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ProductProvider>
        <PricingProvider>
          <ShippingProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/produtos" element={<ProductTable />} />
                  <Route path="/cadastrar" element={<TireRegistration />} />
                  <Route path="/precificacao" element={<PricingCalculator />} />
                  <Route path="/historico" element={<div className="p-8 text-center text-gray-500">Histórico de alterações em desenvolvimento</div>} />
                  <Route path="/importar" element={<div className="p-8 text-center text-gray-500">Funcionalidade de importação em desenvolvimento</div>} />
                  <Route path="/relatorios" element={<div className="p-8 text-center text-gray-500">Relatórios em desenvolvimento</div>} />
                  <Route path="/usuarios" element={<div className="p-8 text-center text-gray-500">Gestão de usuários em desenvolvimento</div>} />
                  <Route path="/configuracoes" element={<div className="p-8 text-center text-gray-500">Configurações em desenvolvimento</div>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          </ShippingProvider>
        </PricingProvider>
      </ProductProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
