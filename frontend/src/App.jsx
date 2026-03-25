import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/homepage/Header";
import { Hero } from "./components/homepage/Hero";
import { PlantCategories } from "./components/homepage/PlantCategories";
import { BestSellers } from "./components/homepage/BestSellers";
import { CareTools } from "./components/homepage/CareTools";
import { HelpPlantsThrive } from "./components/homepage/HelpPlantsThrive";
import { Footer } from "./components/homepage/Footer";
import { PlantsPage } from "./components/discover/PlantsPage";

function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <PlantCategories />
      <BestSellers />
      <CareTools />
      <HelpPlantsThrive />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/plants" element={<PlantsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
