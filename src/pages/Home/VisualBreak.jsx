import React from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { productAssetImages } from '../../lib/localImages';

const TOOLS = [
  {
    name: 'Heritage Shears',
    price: '3,200',
    desc: 'Stainless Steel & Oak',
    image: productAssetImages.scissors,
  },
  {
    name: 'Copper Mist Vessel',
    price: '5,800',
    desc: 'Polished Finish',
    image: productAssetImages.vessel,
  },
  {
    name: 'Organic Hemp Bind',
    price: '850',
    desc: 'Hand-woven in Nepal',
    image: productAssetImages.terrarium,
  },
  {
    name: 'Analog Soil Probe',
    price: '1,500',
    desc: 'Brass Components',
    image: productAssetImages.wateringCan,
  },
];

const Toolkit = () => (
  <section className="bg-[#fbf9f4] py-24 md:py-28">
    <div className="page-shell page-gutter">
      <Motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mb-14 max-w-3xl text-center md:mb-16"
      >
        <p className="mb-5 font-label text-[11px] font-bold uppercase tracking-[0.3em] text-[#31332c]">
          Precision Instruments
        </p>
        <h2 className="font-headline text-[clamp(2.7rem,6vw,4.25rem)] leading-[0.95] tracking-tight text-[#31332c]">
          The Archivist's Toolkit
        </h2>
        <p className="mx-auto mt-5 max-w-xl font-body text-[14px] leading-relaxed text-[#5e6058]">
          Care tools now point directly to the gift and care shop instead of sitting as decorative, dead-end cards.
        </p>
      </Motion.div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7">
        {TOOLS.map((tool, index) => (
          <Motion.article
            key={tool.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: (index % 4) * 0.06, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="group min-h-[350px] border border-[#31332c]/8 bg-white/70 text-center transition-colors duration-300 hover:bg-[#efeee6]"
          >
            <Link to="/products-gifts?filter=Care%20Tools" className="block h-full p-6 md:p-8">
              <div className="relative mb-8 flex h-44 items-center justify-center transition-transform duration-300 group-hover:scale-[1.035]">
                <img
                  src={tool.image}
                  alt={tool.name}
                  className="h-full max-w-full object-contain mix-blend-multiply drop-shadow-lg"
                />
              </div>
              <h4 className="mb-2 font-headline text-2xl text-[#31332c] transition-colors group-hover:text-[#785a1a]">
                {tool.name}
              </h4>
              <p className="mb-6 font-label text-[9px] font-bold uppercase tracking-[0.2em] text-[#797c73]">
                {tool.desc}
              </p>
              <div className="flex items-center justify-center gap-2">
                <span className="font-serif text-lg text-[#31332c]">NPR {tool.price}</span>
                <span className="material-symbols-outlined text-[16px] text-[#785a1a] opacity-0 transition-opacity group-hover:opacity-100">
                  arrow_forward
                </span>
              </div>
            </Link>
          </Motion.article>
        ))}
      </div>
    </div>
  </section>
);

export default Toolkit;
