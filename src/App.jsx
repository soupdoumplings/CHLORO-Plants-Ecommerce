import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import ProductDetailPage from './pages/Product';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/archive" element={<ArchivePage />} />
        <Route path="/catalogue" element={<CataloguePage />} />
        <Route path="/admin/add-plant" element={<ManageInventory />} />
        <Route path="/discovery" element={<DiscoveryPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
      </Routes>
    </AnimatePresence>
  );
};

import CustomCursor from './components/CustomCursor';

function App() {
  return (
    <Router>
      <CustomCursor />
      <div className="min-h-screen bg-[#FBF9F4] antialiased selection:bg-[#785A1A]/20 overflow-x-hidden cursor-none">
        <AnimatedRoutes />
      </div>
    </Router>
  );
}

export default App;
