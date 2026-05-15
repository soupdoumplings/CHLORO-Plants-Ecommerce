import React from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';

const Editorial = () => {
  return (
    <section className="overflow-hidden border-y border-[#31332c]/5 bg-[#f5f4ed] py-24">
      <div className="page-shell page-gutter editorial-grid items-center gap-16 md:gap-20">
        <Motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="col-span-12 md:col-span-5 relative z-10 text-left"
        >
          <Motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-label text-[11px] tracking-[0.3em] uppercase mb-8 text-[#456565] font-bold"
          >
            The Journal — Volume IV
          </Motion.p>
          <Motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="font-headline text-6xl md:text-[6.5rem] tracking-tight leading-[0.9] text-[#31332c] mb-12"
          >
            Beyond the <br />
            <span className="italic font-light">Leaves.</span>
          </Motion.h2>
          <Motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="font-body text-lg text-[#5e6058] mb-12 leading-relaxed max-w-md opacity-90 italic"
          >
            Born in the foothills of the Langtang range, Verdant is more than a boutique. It is an archival project dedicated to preserving the botanical heritage of Nepal through modern care and conscious commerce.
          </Motion.p>
          <Motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex shadow-xl shadow-black/5"
          >
            <Link
              to="/journal"
              className="border border-[#31332c] px-14 py-5 text-[10px] font-bold uppercase tracking-[0.25em] transition-all hover:bg-[#31332c] hover:text-[#fbf9f4]"
            >
              Read the Journal
            </Link>
          </Motion.div>
        </Motion.div>

        <Motion.div
          initial={{ opacity: 0, x: 60, scale: 0.97 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="col-span-12 md:col-span-7 relative group"
        >
          <div className="relative aspect-[16/9] max-h-[480px] overflow-hidden shadow-2xl shadow-black/10">
            <img
              src="/lof.jpg"
              alt="Wildflower Heritage"
              className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110"
            />
          </div>
          <Motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -bottom-10 -left-8 hidden max-w-sm border border-[#31332c]/5 bg-white p-10 shadow-2xl shadow-black/5 lg:block"
          >
            <p className="font-headline italic text-2xl mb-6 text-[#785a1a] leading-relaxed tracking-tight">"We believe every home should be a sanctuary of wild Himalayan soul."</p>
            <p className="font-label text-[10px] uppercase tracking-[0.3em] text-[#797c73] font-bold">— The Founder</p>
          </Motion.div>
        </Motion.div>
      </div>
    </section>
  );
};

export default Editorial;
