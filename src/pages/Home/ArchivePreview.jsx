import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';

const FEATURED_PRODUCTS = [
  { 
    id: 1, 
    name: "Monstera Deliciosa", 
    price: "4,500", 
    category: "Kathmandu Indoor Selection", 
    image: "https://images.pexels.com/photos/7627358/pexels-photo-7627358.jpeg" 
  },
  { 
    id: 2, 
    name: "Sansevieria 'Laurentii'", 
    price: "2,200", 
    category: "Low Maintenance Specimen", 
    image: "https://images.pexels.com/photos/3699416/pexels-photo-3699416.jpeg" 
  },
  { 
    id: 3, 
    name: "Ficus Lyrata", 
    price: "8,900", 
    category: "Statement Foliage", 
    image: "https://images.pexels.com/photos/8175394/pexels-photo-8175394.jpeg" 
  }
];

const Archive = () => {
  return (
    <section className="py-32 px-12 bg-[#fbf9f4]">
        <div className="flex justify-between items-end mb-20">
          <div className="max-w-2xl text-left">
            <motion.h2 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="font-headline text-5xl md:text-6xl mb-8 leading-tight text-[#31332c]"
            >
              Personalized Archive Recommendations
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="font-body text-[#5e6058] leading-relaxed text-lg tracking-wide opacity-90 mb-4"
            >
              Curated by our proprietary growth algorithms, these specimens are selected based on your local micro-climate in the Kathmandu Valley.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ x: 4 }}
          >
            <Link 
              to="/catalogue"
              className="font-label text-[10px] uppercase font-bold tracking-[0.25em] border-b border-[#31332c] pb-1.5 mb-2 hover:opacity-50 transition-all text-[#31332c] flex items-center gap-3 shrink-0" 
            >
               View Full Collection 
               <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </Link>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-12">
          {FEATURED_PRODUCTS.map((p, i) => (
            <ProductCard key={p.id} product={p} delay={i * 0.15} />
          ))}
        </div>
      </section>
  );
};

export default Archive;
