import React from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';

const Editorial = () => {
  return (
    <section className="w-full overflow-hidden border-y border-[#31332c]/5 bg-[#f5f4ed] px-4 py-16 sm:px-6 sm:py-20 md:px-[5vw] md:py-24">
      <div className="mx-auto grid w-full max-w-[1720px] grid-cols-1 items-center gap-12 sm:gap-16 md:grid-cols-12 md:gap-20">
        <Motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mx-auto w-full max-w-[min(100%,520px)] min-w-0 text-center md:col-span-5 md:mx-0 md:max-w-none md:text-left"
        >
          <Motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mb-5 font-label text-[9px] font-bold uppercase tracking-[0.22em] text-[#456565] sm:mb-8 sm:text-[11px] sm:tracking-[0.3em]"
          >
            The Journal — Volume IV
          </Motion.p>
          <Motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mb-7 font-headline text-[clamp(3rem,14vw,5rem)] leading-[0.94] tracking-tight text-[#31332c] sm:mb-12 md:text-[6.5rem] md:leading-[0.9]"
          >
            Beyond the <br />
            <span className="italic font-light">Leaves.</span>
          </Motion.h2>
          <Motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mb-9 w-full max-w-[30rem] overflow-hidden px-1 font-body text-[14px] leading-relaxed text-[#5e6058] opacity-90 italic sm:mb-12 sm:text-lg md:mx-0 md:max-w-md md:px-0"
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
            className="mx-auto flex w-full max-w-[min(100%,340px)] shadow-xl shadow-black/5 sm:inline-flex sm:w-auto md:mx-0"
          >
            <Link
              to="/journal"
              className="w-full min-w-0 border border-[#31332c] px-5 py-5 text-center text-[10px] font-bold uppercase tracking-[0.18em] transition-all hover:bg-[#31332c] hover:text-[#fbf9f4] sm:w-auto sm:px-14 sm:tracking-[0.25em]"
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
          className="relative mx-auto w-full max-w-[min(100%,560px)] min-w-0 md:col-span-7 md:mx-0 md:max-w-none group"
        >
          <div className="relative mx-auto aspect-[4/5] w-full max-w-full overflow-hidden bg-[#071F1F] shadow-2xl shadow-black/10 md:aspect-[4/3] md:max-h-[480px]">
            <img
              src="/lof.jpg"
              alt="Wildflower Heritage"
              className="h-full w-full object-cover object-center transition-transform duration-[3s] md:group-hover:scale-105"
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
