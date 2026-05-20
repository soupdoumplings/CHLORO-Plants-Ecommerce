import React from "react";
import { motion as Motion } from "framer-motion";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { DetailHeader } from "./components/plant/detail-header";
import { ProductHero } from "./components/plant/product-hero";
import { supabase } from "../../supabase";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (!error && data) {
        // Map to expected format in ProductHero
        setProduct({
          ...data,
          promoTitle: data.name,
          promoDescription: data.description,
          features: [
            { id: 1, icon: "spa", title: "Care Level", value: "Expert" },
            { id: 2, icon: "water_drop", title: "Watering", value: data.water_frequency },
            { id: 3, icon: "wb_sunny", title: "Sunlight", value: data.optimal_place }
          ],
          tagline: [data.provenance || "Organic", "Specimen"],
          rating: 5,
          image: data.images?.[0] || 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&q=80',
          // Adjust price for sale
          price: data.is_on_sale ? Number(data.sale_price) : Number(data.price),
          originalPrice: data.is_on_sale ? Number(data.price) : null
        });
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center italic opacity-50">Loading specimen...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center italic opacity-50">Specimen not found.</div>;

  return (
    <Motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-[#FBF9F4] flex flex-col"
    >
      <Navbar />
      <DetailHeader />
      <main className="mx-auto mt-[82px] w-[90vw] max-w-[1720px] flex-grow py-12">
        <ProductHero product={product} />
      </main>
      <Footer />
    </Motion.div>
  );
};

export default ProductDetailPage;
