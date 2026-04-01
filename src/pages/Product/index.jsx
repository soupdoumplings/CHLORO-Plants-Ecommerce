import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { DetailHeader } from "./components/plant/detail-header";
import { ProductHero } from "./components/plant/product-hero";
import { samplePlant } from "../../lib/plant-data";

const ProductDetailPage = () => {
  const { id } = useParams();
  const displayProduct = samplePlant; // Future: fetch product by `id`

  return (
    <div className="min-h-screen bg-[#FBF9F4] flex flex-col">
      <Navbar />
      <DetailHeader />
      <main className="max-w-7xl mx-auto w-full px-6 md:px-12 py-12 mt-[82px] flex-grow">
        <ProductHero product={displayProduct} />
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
