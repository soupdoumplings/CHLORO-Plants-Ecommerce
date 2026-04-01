import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import CataloguePage from './pages/Catalogue';
import AdminDashboardPage from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#FBF9F4] antialiased selection:bg-[#785A1A]/20 overflow-x-hidden">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/catalogue" element={<CataloguePage />} />
          {/* Add more routes here as we build them */}
          {/* <Route path="/login" element={<Login />} /> */}
          {/* <Route path="/signup" element={<Signup />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
