import { DetailHeader } from "./plant/detail-header";
import { ProductHero } from "./plant/product-hero";
import { Footer } from "./Footer";
import { samplePlant } from "../lib/plant-data";

export function ProductDetailPage({ onBack, onNavigate, product }) {
  const displayProduct = product || samplePlant;

  return (
    <div className="min-h-screen bg-white">
      <DetailHeader onBack={onBack} onNavigate={onNavigate} />
      <main className="max-w-7xl mx-auto w-full px-6 md:px-12 py-12">
        <ProductHero product={displayProduct} />
      </main>
      <Footer />
    </div>
  );
}
