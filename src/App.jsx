import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import HomePage from './pages/Home';
import CataloguePage from './pages/Catalogue';
import ArchivePage from './pages/Archive';
import ManageInventory from './pages/ManageInventory';
import DiscoveryPage from './pages/Discovery';
import CartPage from './pages/Cart';
import CheckoutPage from './pages/Checkout';
import DashboardPage from './pages/Dashboard';
import AuthPage from './pages/Auth/AuthPage';
import AiDiagnosisPage from './pages/AiDiagnosis';
import JournalPage from './pages/Journal';
import { AdminRoute, GuestRoute, ProtectedRoute } from './components/Security';

import { AuthProvider, useAuth } from './lib/AuthContext';
import { CartProvider } from './lib/CartContext';

const HomeRouteWrapper = () => {
  const { isAdmin } = useAuth();
  return isAdmin ? <Navigate to="/archive" replace /> : <HomePage />;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' })}>
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<GuestRoute><AuthPage /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><AuthPage /></GuestRoute>} />
        <Route path="/signup" element={<GuestRoute><AuthPage /></GuestRoute>} />
        
        {/* Public Routes */}
        <Route path="/" element={<HomeRouteWrapper />} />
        <Route path="/catalogue" element={<CataloguePage />} />
        <Route path="/catalogue/:id" element={<CataloguePage />} />
        <Route path="/discovery" element={<DiscoveryPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />

        {/* Protected Routes */}
        <Route path="/archive" element={<AdminRoute><ArchivePage /></AdminRoute>} />
        <Route path="/admin/add-plant" element={<AdminRoute><ManageInventory /></AdminRoute>} />
        <Route path="/admin/edit-plant/:id" element={<AdminRoute><ManageInventory /></AdminRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/ai-diagnosis" element={<ProtectedRoute><AiDiagnosisPage /></ProtectedRoute>} />
        <Route path="/journal" element={<ProtectedRoute><JournalPage /></ProtectedRoute>} />
      </Routes>
    </AnimatePresence>
  );
};

import CustomCursor from './components/CustomCursor';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <CustomCursor />
          <div className="min-h-screen bg-[#FBF9F4] antialiased selection:bg-[#785A1A]/20 overflow-x-hidden cursor-none">
            <AnimatedRoutes />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
