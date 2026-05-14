import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import CataloguePage from './pages/Catalogue';
import ArchivePage from './pages/Archive';
import ManageInventory from './pages/ManageInventory';
import PromotionsPage from './pages/Admin/Promotions';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#FBF9F4] antialiased selection:bg-[#785A1A]/20 overflow-x-hidden">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/archive" element={<ArchivePage />} />
          <Route path="/catalogue" element={<CataloguePage />} />
          <Route path="/admin/add-plant" element={<ManageInventory />} />
          <Route path="/admin/promotions" element={<PromotionsPage />} />
          <Route path="/admin/edit-plant/:id" element={<ManageInventory />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
