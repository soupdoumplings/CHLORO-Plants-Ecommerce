import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import CataloguePage from './pages/Catalogue';
import ArchivePage from './pages/Archive';
import DiscoveryPage from './pages/Discovery';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#FBF9F4] antialiased selection:bg-[#785A1A]/20 overflow-x-hidden">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/archive" element={<ArchivePage />} />
          <Route path="/catalogue" element={<CataloguePage />} />
          <Route path="/discovery" element={<DiscoveryPage />} />
          {/* Add more routes here as we build them */}
          {/* <Route path="/login" element={<Login />} /> */}
          {/* <Route path="/signup" element={<Signup />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
