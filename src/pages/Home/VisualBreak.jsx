import React from 'react';
import { motion as Motion } from 'framer-motion';
import { productAssetImages } from '../../lib/localImages';

const TOOLS = [
  {
    name: "Heritage Shears",
    price: "3,200",
    desc: "Stainless Steel & Oak",
    image: productAssetImages.scissors
  },
  {
    name: "Copper Mist Vessel",
    price: "5,800",
    desc: "Polished Finish",
    image: productAssetImages.vessel
  },
  {
    name: "Organic Hemp Bind",
    price: "850",
    desc: "Hand-woven in Nepal",
    image: productAssetImages.terrarium
  },
  {
    name: "Analog Soil Probe",
    price: "1,500",
    desc: "Brass Components",
    image: productAssetImages.wateringCan
  }
];

const Toolkit = () => {
  return (
    <section className="py-32 page-gutter bg-[#fbf9f4]">
        <Motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-24"
        >
          <p className="font-label text-[11px] tracking-[0.3em] uppercase mb-5 text-[#31332c] font-bold">Precision Instruments</p>
          <h2 className="font-headline text-5xl md:text-6xl text-[#31332c] tracking-tight">The Archivist's Toolkit</h2>
        </Motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {TOOLS.map((tool, i) => (
            <Motion.div
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
                    <Motion.span
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                      className="w-1.5 h-1.5 rounded-full bg-[#785a1a] opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                 </div>
            </Motion.div>
          ))}
        </div>
      </section>
  );
};

export default Toolkit;
