import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AdminRoute, GuestRoute, ProtectedRoute, SecurityLoading } from './components/Security';

import { AuthProvider, useAuth } from './lib/AuthContext';
import { CartProvider } from './lib/CartContext';
import { WishlistProvider } from './lib/WishlistContext';
import { NotificationProvider } from './lib/NotificationContext';
import { GeoLocationProvider } from './lib/GeoLocationProvider';
import { PlantPreferencesProvider } from './lib/PlantPreferencesContext';
import PreferenceOnboarding from './components/PreferenceOnboarding';
import ProfileOnboarding from './components/ProfileOnboarding';

const HomePage = lazy(() => import('./pages/Home'));
const CataloguePage = lazy(() => import('./pages/Catalogue'));
const ArchivePage = lazy(() => import('./pages/Archive'));
const ManageInventory = lazy(() => import('./pages/ManageInventory'));
const PromotionsPage = lazy(() => import('./pages/Admin/Promotions'));
const AdminProfilePage = lazy(() => import('./pages/Admin/Profile'));
const DiscoveryPage = lazy(() => import('./pages/Discovery'));
const ProductCataloguePage = lazy(() => import('./pages/ProductCatalogue'));
const CartPage = lazy(() => import('./pages/Cart'));
const CheckoutPage = lazy(() => import('./pages/Checkout'));
const DashboardPage = lazy(() => import('./pages/Dashboard'));
const AuthPage = lazy(() => import('./pages/Auth/AuthPage'));
const AiDiagnosisPage = lazy(() => import('./pages/AiDiagnosis'));
const JournalPage = lazy(() => import('./pages/Journal'));
const MyPlantsPage = lazy(() => import('./pages/MyPlants'));
const PaymentSuccess = lazy(() => import('./pages/Checkout/PaymentSuccess'));
const PaymentFailure = lazy(() => import('./pages/Checkout/PaymentFailure'));
const OrdersPage = lazy(() => import('./pages/Orders'));
const WishlistPage = lazy(() => import('./pages/Wishlist'));

const HomeRouteWrapper = () => {
  const { session, isAdmin } = useAuth();
  if (session && isAdmin === null) return <SecurityLoading />;
  return isAdmin ? <Navigate to="/archive" replace /> : <HomePage />;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' })}>
      <Suspense fallback={<SecurityLoading />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<GuestRoute><AuthPage /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><AuthPage /></GuestRoute>} />
          <Route path="/signup" element={<GuestRoute><AuthPage /></GuestRoute>} />

          {/* Public Routes */}
          <Route path="/" element={<HomeRouteWrapper />} />
          <Route path="/catalogue" element={<CataloguePage />} />
          <Route path="/catalogue/:id" element={<CataloguePage />} />
          <Route path="/discovery" element={<DiscoveryPage />} />
          <Route path="/products-gifts" element={<ProductCataloguePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/failure" element={<PaymentFailure />} />

          {/* Protected Routes */}
          <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/archive" element={<AdminRoute><ArchivePage /></AdminRoute>} />
          <Route path="/admin/add-plant" element={<AdminRoute><ManageInventory /></AdminRoute>} />
          <Route path="/admin/edit-plant/:id" element={<AdminRoute><ManageInventory /></AdminRoute>} />
          <Route path="/admin/promotions" element={<AdminRoute><PromotionsPage /></AdminRoute>} />
          <Route path="/admin/profile" element={<AdminRoute><AdminProfilePage /></AdminRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
          <Route path="/my-plants" element={<ProtectedRoute><MyPlantsPage /></ProtectedRoute>} />
          <Route path="/ai-diagnosis" element={<ProtectedRoute><AiDiagnosisPage /></ProtectedRoute>} />
          <Route path="/journal" element={<ProtectedRoute><JournalPage /></ProtectedRoute>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

import CustomCursor from './components/CustomCursor';
import ChatbotWidget from './components/ChatbotWidget';
import SiteConsent from './components/SiteConsent';
import ScrollToTop from './components/ScrollToTop';

// BUG FIX: Hides the chatbot on authentication and admin routes to prevent UI overlap 
// and maintain a clean environment for sensitive tasks.
const ChatbotWrapper = () => {
  const location = useLocation();
  const hiddenRoutes = ['/login', '/register', '/signup', '/admin', '/archive'];
  const isHidden = hiddenRoutes.some(route => location.pathname.startsWith(route));

  if (isHidden) return null;
  return <ChatbotWidget />;
};

const OnboardingWrapper = () => {
  const location = useLocation();
  const hiddenRoutes = ['/products-gifts', '/discovery', '/catalogue', '/cart'];
  const isHidden = hiddenRoutes.some(route => location.pathname.startsWith(route));

  if (isHidden) return null;

  return (
    <>
      <PreferenceOnboarding />
      <ProfileOnboarding />
    </>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <PlantPreferencesProvider>
          <NotificationProvider>
            <GeoLocationProvider>
              <WishlistProvider>
                <CartProvider>
                  <CustomCursor />
                  <div className="min-h-screen bg-[#FBF9F4] antialiased selection:bg-[#785A1A]/20 overflow-x-hidden cursor-none">
                    <AnimatedRoutes />
                    <ChatbotWrapper />
                    <OnboardingWrapper />
                    <SiteConsent />
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
