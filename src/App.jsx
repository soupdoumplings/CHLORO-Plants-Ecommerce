import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // ← ADD Navigate
import { useAuth } from './lib/AuthContext'; // ADD THIS
import HomePage from './pages/Home';
import CataloguePage from './pages/Catalogue';
import ArchivePage from './pages/Archive';
import AuthPage from './pages/Auth/AuthPage'; // ADD THIS

// ProtectedRoute: blocks logged-out users
// If NOT logged in → redirect to /auth

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // While auth state is being checked → show loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FBF9F4]">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#785A1A]/40 animate-pulse">
          Loading...
        </p>
      </div>
    );
  }

  // Not logged in → go to /auth
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Logged in → show the page
  return children;
};

// GuestRoute: blocks logged-in users from /auth
// If already logged in → redirect to /

const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FBF9F4]">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#785A1A]/40 animate-pulse">
          Loading...
        </p>
      </div>
    );
  }

  // Already logged in → go to home
  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Main App — your original structure kept intact

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#FBF9F4] antialiased selection:bg-[#785A1A]/20 overflow-x-hidden">
        <Routes>

          {/* Public: Auth Page (guests only) */}
          <Route
            path="/auth"
            element={
              <GuestRoute>
                <AuthPage />
              </GuestRoute>
            }
          />

          {/* Protected: Home */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />

          {/* Protected: Archive */}
          <Route
            path="/archive"
            element={
              <ProtectedRoute>
                <ArchivePage />
              </ProtectedRoute>
            }
          />

          {/* Protected: Catalogue */}
          <Route
            path="/catalogue"
            element={
              <ProtectedRoute>
                <CataloguePage />
              </ProtectedRoute>
            }
          />

          {/*  Catch-All: unknown URLs → Home */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
