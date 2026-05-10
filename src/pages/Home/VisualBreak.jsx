import React from 'react';
import { motion } from 'framer-motion';

const TOOLS = [
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
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAlvbpVIN_VUxTcamiWMHhSDDlbE4iMDm4bi9KRGRL2KHlVHWX8NKBOIfqnocmn50zO_5sFIU60N-CSij9jFyZ9gjm2Ak06ygo_VwY7Ucfe0PMBBdiHa1kHSyDEnBIqSBFFuENIFtJl3v-96hGKYtvg-wLvrwQ5V4WiRetLrWgjTFhOEHS27Pp1Tn37R_B00-9J36ZGa8axkGsX4cIAcyLfp75kQioSyNVDHaJQLCFJiXIGq0qAYe0FpmOOy4OofEa1__CJNiq-kVh7" 
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
  return (
    <section className="py-32 px-12 bg-[#fbf9f4]">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-24"
        >
          <p className="font-label text-[11px] tracking-[0.3em] uppercase mb-5 text-[#31332c] font-bold">Precision Instruments</p>
          <h2 className="font-headline text-5xl md:text-6xl text-[#31332c] tracking-tight">The Archivist's Toolkit</h2>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {TOOLS.map((tool, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, transition: { duration: 0.4 } }}
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
                    <motion.span 
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                      className="w-1.5 h-1.5 rounded-full bg-[#785a1a] opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                 </div>
            </motion.div>
          ))}
        </div>
      </section>
  );
};

export default Toolkit;
