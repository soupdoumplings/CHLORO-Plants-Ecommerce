import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { publicPlantImages } from '../../lib/localImages';

const REVIEWS = [
  {
    name: 'Aarohi Shrestha',
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
];

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

        <div className="grid gap-7 lg:grid-cols-3">
          {REVIEWS.map((review, index) => (
            <Motion.article
              key={review.handle}
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.75, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8 }}
              className="group border border-[#31332c]/10 bg-white shadow-xl shadow-black/[0.035] transition-colors duration-500 hover:border-[#785A1A]/30"
            >
              <div className="flex items-center justify-between border-b border-[#31332c]/10 px-5 py-4">
                <div>
                  <h3 className="font-label text-[10px] font-bold uppercase tracking-[0.18em] text-[#31332c]">
                    {review.name}
                  </h3>
                  <p className="mt-1 font-body text-[12px] text-[#797C73]">{review.handle}</p>
                </div>
                <span className="material-symbols-outlined text-[18px] text-[#785A1A]">local_florist</span>
              </div>

              <div className="aspect-[4/5] overflow-hidden bg-[#EDEBE4]">
                <img
                  src={review.image}
                  alt={`${review.plant} purchased from CHLORO`}
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </div>

              <div className="space-y-5 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex gap-1 text-[#785A1A]" aria-label="5 out of 5 stars">
                    {[0, 1, 2, 3, 4].map((star) => (
                      <Star key={star} size={14} fill="currentColor" strokeWidth={1.8} />
                    ))}
                  </div>
                  <p className="font-label text-[8px] font-bold uppercase tracking-[0.18em] text-[#797C73]">
                    Verified Purchase
                  </p>
                </div>

                <p className="font-headline text-[25px] leading-tight text-[#31332c]">{review.plant}</p>
                <p className="font-body text-[14px] leading-7 text-[#5E6058]">"{review.comment}"</p>
              </div>
            </Motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;
