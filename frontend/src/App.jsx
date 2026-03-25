import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { PlantCategories } from "./components/PlantCategories";
import { BestSellers } from "./components/BestSellers";
import { CareTools } from "./components/CareTools";
import { FindPerfectPlant } from "./components/FindPerfectPlant";
import { HelpPlantsThrive } from "./components/HelpPlantsThrive";
import { Footer } from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <PlantCategories />
      <BestSellers />
      <CareTools />
      <FindPerfectPlant />
      <HelpPlantsThrive />
      <Footer />
    </div>
  );
}

export default App;