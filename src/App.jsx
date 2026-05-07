import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import CataloguePage from './pages/Catalogue';
import ArchivePage from './pages/Archive';
import ManageInventory from './pages/ManageInventory';
<<<<<<< Updated upstream
=======
import DiscoveryPage from './pages/Discovery';
import CartPage from './pages/Cart';
import CheckoutPage from './pages/Checkout';
import DashboardPage from './pages/Dashboard';
import AuthPage from './pages/Auth/AuthPage';
import ProductDetailPage from './pages/Product';
import AiDiagnosisPage from './pages/AiDiagnosis';
import JournalPage from './pages/Journal';
import PromotionsPage from './pages/Admin/Promotions';
import PaymentSuccess from './pages/Checkout/PaymentSuccess';
import PaymentFailure from './pages/Checkout/PaymentFailure';
import { AdminRoute, GuestRoute, ProtectedRoute } from './components/Security';

import { AuthProvider, useAuth } from './lib/AuthContext';
import { CartProvider } from './lib/CartContext';
import { NotificationProvider } from './lib/NotificationContext';
import { GeoLocationProvider } from './lib/GeoLocationProvider';

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
        
        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><HomeRouteWrapper /></ProtectedRoute>} />
        <Route path="/archive" element={<AdminRoute><ArchivePage /></AdminRoute>} />
        <Route path="/catalogue" element={<ProtectedRoute><CataloguePage /></ProtectedRoute>} />
        <Route path="/catalogue/:id" element={<ProtectedRoute><CataloguePage /></ProtectedRoute>} />
        <Route path="/admin/add-plant" element={<AdminRoute><ManageInventory /></AdminRoute>} />
        <Route path="/admin/edit-plant/:id" element={<AdminRoute><ManageInventory /></AdminRoute>} />
        <Route path="/admin/promotions" element={<AdminRoute><PromotionsPage /></AdminRoute>} />
        <Route path="/discovery" element={<ProtectedRoute><DiscoveryPage /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="/payment/success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
        <Route path="/payment/failure" element={<ProtectedRoute><PaymentFailure /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/product/:id" element={<ProtectedRoute><ProductDetailPage /></ProtectedRoute>} />
        <Route path="/ai-diagnosis" element={<ProtectedRoute><AiDiagnosisPage /></ProtectedRoute>} />
        <Route path="/journal" element={<ProtectedRoute><JournalPage /></ProtectedRoute>} />
      </Routes>
    </AnimatePresence>
  );
};

import CustomCursor from './components/CustomCursor';
>>>>>>> Stashed changes

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#FBF9F4] antialiased selection:bg-[#785A1A]/20 overflow-x-hidden">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/archive" element={<ArchivePage />} />
          <Route path="/catalogue" element={<CataloguePage />} />
          <Route path="/admin/add-plant" element={<ManageInventory />} />
          {/* Add more routes here as we build them */}
          {/* <Route path="/login" element={<Login />} /> */}
          {/* <Route path="/signup" element={<Signup />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
