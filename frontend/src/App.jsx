import { useState } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { PlantCategories } from "./components/PlantCategories";
import { BestSellers } from "./components/BestSellers";
import { CareTools } from "./components/CareTools";
import { FindPerfectPlant } from "./components/FindPerfectPlant";
import { HelpPlantsThrive } from "./components/HelpPlantsThrive";
import { Footer } from "./components/Footer";
import { ProductDetailPage } from "./components/ProductDetailPage";
import { AboutUsPage } from "./components/AboutUsPage";
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

  return (
    <div className="min-h-screen bg-white">
      <Header onNavigate={handleNavigate} />
      <Hero />
      <PlantCategories onProductClick={handleProductClick} />
      <BestSellers onProductClick={handleProductClick} />
      <CareTools onProductClick={handleProductClick} />
      <FindPerfectPlant />
      <HelpPlantsThrive />
      <Footer />
    </div>
  );
}

export default App;