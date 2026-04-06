import React from 'react';
import { motion } from 'framer-motion';

const TOOLS = [
  // ... (keeping same tools)
  { 
    name: "Heritage Shears", 
    price: "3,200", 
    desc: "Stainless Steel & Oak", 
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAuB-QhTd_q-IRZwSeToy52XwJTA3n2uKCHxJKIA7ssUtNEtMCtRZatZGk2uCF9aQpxbtl_6Kh-5UXQvaRiHvsGxCuRkkxEHqJKR_OqVQnQqJOTJz9JLBmENA18kqTswrEfx2ctNyhatPqzZBsA9crJcfTAPudbRoeNy9TaxbT_FbnmjQ1rUXFSaMrRzTMwrdNnaLT44gYvITwmUwyiZlQjAC8lNlg6H8JoK1yPNv_PxMHh5fRSEWpdoAIQm4svqRKcVSosMaXOPu7M" 
  },
  { 
    name: "Copper Mist Vessel", 
    price: "5,800", 
    desc: "Polished Finish", 
    image: "/copper_mist_vessel_1775451032552.png" 
  },
  { 
    name: "Organic Hemp Bind", 
    price: "850", 
    desc: "Hand-woven in Nepal", 
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBmHaEZjUsIdgYwAvIsJQXftqd_bePfAmCiIdkZOMlWoFsQVRoeVD1cXPccPvlhGje69X307W2A0uEoCEycIhssS_czzNHo5F_RM7tN-zdZJbTd7wJVWTpPBCTS0Hjr7z4LePPhbO63TV-hu20Vl-ouWd-lq9LFL61wGcHR9-_uBYq1-qp81VffCLKQnEmSas5cyVp_UHyPrkInQyYShMENO4BcA91-Wb5EPv3mqx_8AFRt7FHZa3Zo-AX3dNeqSCoP7mCNM1-SDv_3" 
  },
  { 
    name: "Analog Soil Probe", 
    price: "1,500", 
    desc: "Brass Components", 
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD3eJ_xT9kufITOvFfjgKrex-E79O9g4cOUrr1nEjLvm6gzyVh_XXNGQKNc5UC6csm95Mt2-XHE6OUynFj2WIbVxO0pxzqJLzMI26VA5V55WnuHQW7Hkjsd2Ley0ZNZXMboIRaeyW696LkLzJZdnoB2dVRy-bs5f9hDcE5nxBqrVXnolOJt2VyOdhMmyi36i4yXYwdsih2pFebu4JjNNF1A_vVHz39FcBWs0flLGdsHU_-mdWnn0fqA7CrxwgZ38txhH3_V9qKBkpz0" 
  }
];

const Toolkit = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <section className="py-32 px-12 bg-[#fbf9f4]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-24"
        >
          <p className="font-label text-[11px] tracking-[0.3em] uppercase mb-5 text-[#31332c] font-bold">Precision Instruments</p>
          <h2 className="font-headline text-5xl md:text-6xl text-[#31332c] tracking-tight">The Archivist's Toolkit</h2>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12"
        >
          {TOOLS.map((tool, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              whileHover={{ y: -10, transition: { duration: 0.4 } }}
              className="group border border-[#31332c]/5 p-10 hover:bg-[#efeee6] transition-all duration-700 text-center relative overflow-hidden bg-white/50 backdrop-blur-sm"
            >
                 <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <div className="relative h-56 flex items-center justify-center mb-10 transform group-hover:scale-110 transition-transform duration-700">
                    <img 
                       src={tool.image} 
                       alt={tool.name} 
                       className="max-w-full h-full object-contain mix-blend-multiply drop-shadow-lg" 
                    />
                 </div>
                 <h4 className="font-headline text-2xl mb-2 text-[#31332c] group-hover:text-[#785a1a] transition-colors">{tool.name}</h4>
                 <p className="font-label text-[9px] uppercase tracking-[0.2em] text-[#797c73] font-bold mb-6">{tool.desc}</p>
                 <div className="flex items-center justify-center gap-2">
                    <span className="font-serif text-lg text-[#31332c]">रू {tool.price}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#785a1a] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                 </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
  );
};

export default Toolkit;
