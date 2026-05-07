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
import MyPlantsPage from './pages/MyPlants';
import PaymentSuccess from './pages/Checkout/PaymentSuccess';
import PaymentFailure from './pages/Checkout/PaymentFailure';
import OrdersPage from './pages/Orders';
import WishlistPage from './pages/Wishlist';
import { AdminRoute, GuestRoute, ProtectedRoute, SecurityLoading } from './components/Security';

import { AuthProvider, useAuth } from './lib/AuthContext';
import { CartProvider } from './lib/CartContext';
import { WishlistProvider } from './lib/WishlistContext';
import { NotificationProvider } from './lib/NotificationContext';
import { GeoLocationProvider } from './lib/GeoLocationProvider';
import { PlantPreferencesProvider } from './lib/PlantPreferencesContext';
import PreferenceOnboarding from './components/PreferenceOnboarding';
import ProfileOnboarding from './components/ProfileOnboarding';

const HomeRouteWrapper = () => {
  const { session, isAdmin } = useAuth();
  if (session && isAdmin === null) return <SecurityLoading />;
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
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/failure" element={<PaymentFailure />} />

        {/* Protected Routes */}
        <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="/archive" element={<AdminRoute><ArchivePage /></AdminRoute>} />
        <Route path="/admin/add-plant" element={<AdminRoute><ManageInventory /></AdminRoute>} />
        <Route path="/admin/edit-plant/:id" element={<AdminRoute><ManageInventory /></AdminRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
        <Route path="/my-plants" element={<ProtectedRoute><MyPlantsPage /></ProtectedRoute>} />
        <Route path="/ai-diagnosis" element={<ProtectedRoute><AiDiagnosisPage /></ProtectedRoute>} />
        <Route path="/journal" element={<ProtectedRoute><JournalPage /></ProtectedRoute>} />
      </Routes>
    </AnimatePresence>
  );
};

import CustomCursor from './components/CustomCursor';
import ChatbotWidget from './components/ChatbotWidget';

function App() {
  return (
    <Router>
      <AuthProvider>
        <PlantPreferencesProvider>
          <NotificationProvider>
            <GeoLocationProvider>
              <WishlistProvider>
                <CartProvider>
                  <CustomCursor />
                  <div className="min-h-screen bg-[#FBF9F4] antialiased selection:bg-[#785A1A]/20 overflow-x-hidden cursor-none">
                    <AnimatedRoutes />
                    <ChatbotWidget />
                    <PreferenceOnboarding />
                    <ProfileOnboarding />
                  </div>
                </CartProvider>
              </WishlistProvider>
            </GeoLocationProvider>
          </NotificationProvider>
        </PlantPreferencesProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
