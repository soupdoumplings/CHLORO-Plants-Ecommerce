import { useState } from "react";
import { Header } from "./components/layout/Header";
import { Hero } from "./components/home/Hero";
import { PlantCategories } from "./components/home/PlantCategories";
import { BestSellers } from "./components/home/BestSellers";
import { CareTools } from "./components/home/CareTools";
import { FindPerfectPlant } from "./components/home/FindPerfectPlant";
import { HelpPlantsThrive } from "./components/home/HelpPlantsThrive";
import { Footer } from "./components/layout/Footer";
import { ProductDetailPage } from "./components/product/ProductDetailPage";
import { AboutUsPage } from "./components/about/AboutUsPage";
import { PlantsPage } from "./components/catalog/PlantsPage";
import { samplePlant } from "./lib/plant-data";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleProductClick = (product) => {
    // Map the homepage product data to the product detail format
    const detailProduct = {
      ...samplePlant,
      name: product.name,
      promoTitle: product.name,
      price: product.price,
      originalPrice: product.originalPrice || null,
      rating: product.rating || 4.8,
      image: product.image,
    };
    setSelectedProduct(detailProduct);
    setCurrentPage("product");
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setCurrentPage("home");
    setSelectedProduct(null);
    window.scrollTo(0, 0);
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  if (currentPage === "product") {
    return (
      <ProductDetailPage
        onBack={handleBack}
        onNavigate={handleNavigate}
        product={selectedProduct}
      />
    );
  }

  if (currentPage === "about") {
    return <AboutUsPage onNavigate={handleNavigate} />;
  }

  if (currentPage === "catalog") {
    return <PlantsPage onNavigate={handleNavigate} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header onNavigate={handleNavigate} />
      <Hero />
      <PlantCategories onProductClick={handleProductClick} onNavigate={handleNavigate} />
      <BestSellers onProductClick={handleProductClick} />
      <CareTools onProductClick={handleProductClick} onNavigate={handleNavigate} />
      <FindPerfectPlant  onNavigate={handleNavigate}/>
      <HelpPlantsThrive />
      <Footer />
    </div>
  );
}

export default App;