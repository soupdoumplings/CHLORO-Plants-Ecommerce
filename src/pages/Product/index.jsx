import React from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { DetailHeader } from "./components/plant/detail-header";
import { ProductHero } from "./components/plant/product-hero";
import { samplePlant } from "../../lib/plant-data";

const ProductDetailPage = () => {
  const { id } = useParams();
  const displayProduct = samplePlant;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-[#FBF9F4] flex flex-col"
    >
      <Navbar />
      <DetailHeader />
      <main className="max-w-7xl mx-auto w-full px-6 md:px-12 py-12 mt-[82px] flex-grow">
        <ProductHero product={displayProduct} />
      </main>
      <Footer />
    </motion.div>
  );
};

export default ProductDetailPage;
