import React from 'react';
import { motion as Motion } from 'framer-motion';

const EditorialHero = ({
  eyebrow,
  title,
  italic,
  copy,
  image,
  imageAlt,
  actions,
  meta = [],
  objectPosition = 'center',
  compact = false,
}) => (
  <section data-cursor-theme="light" className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-b border-[#FBF9F4]/10 bg-[#0F3A3A] text-[#FBF9F4]">
    {image && (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <img
          src={image}
          alt={imageAlt || ''}
          className="h-full w-full object-cover"
          style={{ objectPosition }}
        />
      </div>
    )}
    <div className="pointer-events-none absolute inset-0 bg-[#071F1F]/58" />
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#071F1F]/82 via-[#071F1F]/48 to-[#071F1F]/14" />

    <div className={`relative z-10 mx-auto flex w-[90vw] max-w-[1720px] flex-col justify-center px-6 md:px-10 xl:px-14 ${
      compact 
        ? 'min-h-[280px] py-10 md:min-h-[320px] lg:min-h-[360px]' 
        : 'min-h-[430px] py-20 md:min-h-[500px] lg:min-h-[530px]'
    }`}>
      <div>
        <Motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className={`font-label font-bold uppercase tracking-[0.28em] text-[#C6E9E9] ${
            compact ? 'text-[9px]' : 'text-[11px]'
          }`}
        >
          {eyebrow}
        </Motion.p>
        <Motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className={`max-w-[1040px] font-headline text-[#FBF9F4] ${
            compact 
              ? 'mt-3 text-[48px] leading-[1.05] md:text-[64px] lg:text-[76px]'
              : 'mt-5 text-[64px] leading-[0.88] md:text-[92px] lg:text-[112px]'
          }`}
        >
          {title}
          {italic && <span className="block italic font-light">{italic}</span>}
        </Motion.h1>
        {copy && (
          <Motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className={`max-w-[720px] font-body font-semibold leading-8 text-[#FBF9F4]/82 ${
              compact
                ? 'mt-4 text-[14px] md:text-[15px]'
                : 'mt-7 text-[16px] md:text-[18px]'
            }`}
          >
            {copy}
          </Motion.p>
        )}
        {actions && (
          <Motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className={`flex flex-wrap gap-3 ${compact ? 'mt-6' : 'mt-8'}`}
          >
            {actions}
          </Motion.div>
        )}
      </div>

      {meta.length > 0 && (
        <Motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className={`flex flex-wrap gap-4 border-t border-[#FBF9F4]/22 pt-6 ${compact ? 'mt-6' : 'mt-10'}`}
        >
          {meta.map((item) => (
            <div key={item.label} className="min-w-[128px] border-l border-[#FBF9F4]/28 pl-4">
              <p className="font-label text-[9px] font-bold uppercase tracking-[0.2em] text-[#C6E9E9]">{item.label}</p>
              <p className={`font-headline leading-none text-[#FBF9F4] ${compact ? 'mt-1 text-[20px]' : 'mt-2 text-[26px]'}`}>{item.value}</p>
            </div>
          ))}
        </Motion.div>
      )}
    </div>
  </section>
);

export default EditorialHero;
