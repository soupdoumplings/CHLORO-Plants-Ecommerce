import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { publicPlantImages } from '../../lib/localImages';

const REVIEWS = [
  {
    name: 'Karishma Dhungana',
    handle: '@aarohi.grows',
    image: publicPlantImages.lily,
    plant: 'Peace Lily',
    comment: 'Arrived fresh, glossy, and carefully wrapped. My reading corner finally feels alive.',
  },
  {
    name: 'Milan Rana',
    handle: '@milan.botanica',
    image: publicPlantImages.lavender,
    plant: 'Lavender Pair',
    comment: 'The scent is soft, the pots look expensive, and delivery was smoother than expected.',
  },
  {
    name: 'Nisha Gurung',
    handle: '@nisha.collects',
    image: publicPlantImages.money,
    plant: 'Money Plant',
    comment: 'Loved the care notes. It felt less like a random order and more like a curated gift.',
  },
  {
    name: 'Samir Karki',
    handle: '@samir.leafdesk',
    image: publicPlantImages.orchid,
    plant: 'Orchid Stem',
    comment: 'The bloom arrived upright and protected. It made my work desk feel much calmer.',
  },
  {
    name: 'Prakriti Thapa',
    handle: '@prakriti.home',
    image: publicPlantImages.leaf,
    plant: 'Trailing Pothos',
    comment: 'Healthy roots, clean potting, and clear watering advice. Very beginner friendly.',
  },
  {
    name: 'Riya Joshi',
    handle: '@riyagifts',
    image: publicPlantImages.phool,
    plant: 'Gift Arrangement',
    comment: 'Sent it as a birthday gift and the packaging looked thoughtful, not generic.',
  },
];

const rotations = ['lg:-rotate-2', 'lg:rotate-1', 'lg:-rotate-1', 'lg:rotate-1', 'lg:-rotate-1', 'lg:rotate-2'];

const CustomerReviews = () => {
  return (
    <section className="bg-[#FBF9F4] page-gutter pb-32">
      <div className="page-shell border-t border-[#31332c]/10 pt-24">
        <div className="mb-16 grid gap-8 lg:grid-cols-[1fr_420px] lg:items-end">
          <div>
            <Motion.span
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mb-6 inline-block font-label text-[10px] font-bold uppercase tracking-[0.28em] text-[#785A1A]"
            >
              Customer Notes
            </Motion.span>
            <Motion.h2
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="font-headline text-[48px] leading-[0.96] tracking-tight text-[#31332c] md:text-[76px]"
            >
              Botanical receipts, beautifully kept.
            </Motion.h2>
          </div>
          <Motion.p
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="font-body text-[15px] leading-8 text-[#5E6058]"
          >
            Realistic post-style notes from happy plant parents, styled like a small editorial feed instead of a loud review wall.
          </Motion.p>
        </div>

        <div className="relative mx-auto grid max-w-[1120px] gap-8 md:grid-cols-2 lg:grid-cols-3 lg:items-start lg:gap-10">
          <div className="pointer-events-none absolute left-[16%] right-[16%] top-3 hidden border-t border-[#785A1A]/18 lg:block" />
          {REVIEWS.map((review, index) => (
            <Motion.article
              key={review.handle}
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.75, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, rotate: 0 }}
              className={`group relative mx-auto w-full max-w-[330px] bg-[#FFFEFA] p-5 pb-6 shadow-[0_22px_55px_rgba(49,51,44,0.12)] ring-1 ring-[#31332c]/8 transition-colors duration-500 hover:ring-[#785A1A]/25 ${index > 2 ? 'hidden md:block' : ''} ${rotations[index % rotations.length]}`}
            >
              <span className="absolute left-1/2 top-0 z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#785A1A]/35 bg-[#785A1A] shadow-[0_2px_8px_rgba(49,51,44,0.22)]" />
              <span className="absolute left-1/2 top-0 hidden h-8 border-l border-[#785A1A]/20 lg:block" />
              <div className="absolute left-1/2 top-4 z-10 h-6 w-24 -translate-x-1/2 -translate-y-1/2 rotate-2 bg-[#E8E3D4]/80 shadow-sm" />

              <div className="aspect-[4/4.7] overflow-hidden border-[10px] border-[#FFFEFA] bg-[#EDEBE4] shadow-inner">
                <img
                  src={review.image}
                  alt={`${review.plant} purchased from CHLORO`}
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </div>

              <div className="space-y-3 pt-4">
                <div className="flex items-center justify-between gap-4 border-b border-[#31332c]/10 pb-3">
                  <div>
                    <h3 className="font-label text-[10px] font-bold uppercase tracking-[0.18em] text-[#31332c]">
                      {review.name}
                    </h3>
                    <p className="mt-1 font-body text-[12px] text-[#797C73]">{review.handle}</p>
                  </div>
                  <div className="flex gap-1 text-[#785A1A]" aria-label="5 out of 5 stars">
                    {[0, 1, 2, 3, 4].map((star) => (
                      <Star key={star} size={14} fill="currentColor" strokeWidth={1.8} />
                    ))}
                  </div>
                </div>

                <div>
                  <p className="font-headline text-[23px] leading-tight text-[#31332c]">{review.plant}</p>
                  <p className="mt-2 font-body text-[13px] leading-6 text-[#5E6058]">"{review.comment}"</p>
                </div>

                <p className="font-label text-[8px] font-bold uppercase tracking-[0.18em] text-[#797C73]">
                  Verified Purchase
                </p>
              </div>
            </Motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;
