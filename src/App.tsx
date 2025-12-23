import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Layout } from "@/components/Layout";
import { HomePage } from "@/pages/HomePage";
import { LoginPage } from "@/pages/LoginPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { CustomersListPage } from "@/pages/customers/CustomersListPage";
import { CustomerFormPage } from "@/pages/customers/CustomerFormPage";
import { VehiclesListPage } from "@/pages/vehicles/VehiclesListPage";
import { VehicleFormPage } from "@/pages/vehicles/VehicleFormPage";
import { CategoriesListPage } from "@/pages/categories/CategoriesListPage";
import { CategoryFormPage } from "@/pages/categories/CategoryFormPage";
import { ServicesListPage } from "@/pages/services/ServicesListPage";
import { ServiceFormPage } from "@/pages/services/ServiceFormPage";
import { ServiceRecordsListPage } from "@/pages/service-records/ServiceRecordsListPage";
import { ServiceRecordFormPage } from "@/pages/service-records/ServiceRecordFormPage";
import { PaymentsListPage } from "@/pages/payments/PaymentsListPage";
import { PaymentFormPage } from "@/pages/payments/PaymentFormPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Layout><DashboardPage /></Layout></ProtectedRoute>} />
            
            <Route path="/customers" element={<ProtectedRoute><Layout><CustomersListPage /></Layout></ProtectedRoute>} />
            <Route path="/customers/new" element={<ProtectedRoute><Layout><CustomerFormPage /></Layout></ProtectedRoute>} />
            <Route path="/customers/edit/:id" element={<ProtectedRoute><Layout><CustomerFormPage /></Layout></ProtectedRoute>} />
            
            <Route path="/vehicles" element={<ProtectedRoute><Layout><VehiclesListPage /></Layout></ProtectedRoute>} />
            <Route path="/vehicles/new" element={<ProtectedRoute><Layout><VehicleFormPage /></Layout></ProtectedRoute>} />
            <Route path="/vehicles/edit/:id" element={<ProtectedRoute><Layout><VehicleFormPage /></Layout></ProtectedRoute>} />
            
            <Route path="/categories" element={<ProtectedRoute><Layout><CategoriesListPage /></Layout></ProtectedRoute>} />
            <Route path="/categories/new" element={<ProtectedRoute><Layout><CategoryFormPage /></Layout></ProtectedRoute>} />
            <Route path="/categories/edit/:id" element={<ProtectedRoute><Layout><CategoryFormPage /></Layout></ProtectedRoute>} />
            
            <Route path="/services" element={<ProtectedRoute><Layout><ServicesListPage /></Layout></ProtectedRoute>} />
            <Route path="/services/new" element={<ProtectedRoute><Layout><ServiceFormPage /></Layout></ProtectedRoute>} />
            <Route path="/services/edit/:id" element={<ProtectedRoute><Layout><ServiceFormPage /></Layout></ProtectedRoute>} />
            
            <Route path="/service-records" element={<ProtectedRoute><Layout><ServiceRecordsListPage /></Layout></ProtectedRoute>} />
            <Route path="/service-records/new" element={<ProtectedRoute><Layout><ServiceRecordFormPage /></Layout></ProtectedRoute>} />
            <Route path="/service-records/edit/:id" element={<ProtectedRoute><Layout><ServiceRecordFormPage /></Layout></ProtectedRoute>} />
            
            <Route path="/payments" element={<ProtectedRoute><Layout><PaymentsListPage /></Layout></ProtectedRoute>} />
            <Route path="/payments/new" element={<ProtectedRoute><Layout><PaymentFormPage /></Layout></ProtectedRoute>} />
            <Route path="/payments/edit/:id" element={<ProtectedRoute><Layout><PaymentFormPage /></Layout></ProtectedRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
