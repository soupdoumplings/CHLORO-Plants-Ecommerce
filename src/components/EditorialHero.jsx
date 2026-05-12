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

    <div className="relative z-10 mx-auto flex min-h-[430px] max-w-[1380px] flex-col justify-center px-6 py-20 md:min-h-[500px] md:px-10 lg:min-h-[530px]">
      <div>
        <Motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="font-label text-[10px] font-bold uppercase tracking-[0.28em] text-[#C6E9E9]"
        >
          {eyebrow}
        </Motion.p>
        <Motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 max-w-[920px] font-headline text-[58px] leading-[0.88] text-[#FBF9F4] md:text-[86px] lg:text-[104px]"
        >
          {title}
          {italic && <span className="block italic font-light">{italic}</span>}
        </Motion.h1>
        {copy && (
          <Motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 max-w-[620px] font-body text-[15px] font-semibold leading-7 text-[#FBF9F4]/78 md:text-[16px]"
          >
            {copy}
          </Motion.p>
        )}
        {actions && (
          <Motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex flex-wrap gap-3"
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
          className="mt-10 flex flex-wrap gap-4 border-t border-[#FBF9F4]/22 pt-6"
        >
          {meta.map((item) => (
            <div key={item.label} className="min-w-[128px] border-l border-[#FBF9F4]/28 pl-4">
              <p className="font-label text-[8px] font-bold uppercase tracking-[0.2em] text-[#C6E9E9]">{item.label}</p>
              <p className="mt-2 font-headline text-[24px] leading-none text-[#FBF9F4]">{item.value}</p>
            </div>
          ))}
        </Motion.div>
      )}
    </div>
  </section>
);

export default EditorialHero;
