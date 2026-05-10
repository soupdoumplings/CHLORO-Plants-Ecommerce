import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SaleBanner = ({ saleEndsAt }) => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!saleEndsAt) return;

    const calculateTimeLeft = () => {
      const difference = new Date(saleEndsAt) - new Date();
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return null;
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [saleEndsAt]);

  // If there's no sale time left or the sale has ended, don't show the banner
  if (!timeLeft) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="w-full bg-[#785a1a] text-[#FBF9F4] py-3 px-4 flex flex-col md:flex-row items-center justify-center gap-4 z-50 sticky top-[81px] shadow-sm"
      >
        <span className="font-sans text-[11px] tracking-[0.2em] uppercase font-bold text-center">
          Seasonal Sale Event
        </span>
        <div className="flex gap-4 font-mono text-sm md:text-base">
          <div className="flex flex-col items-center min-w-[40px]">
            <span className="font-bold">{timeLeft.days}</span>
            <span className="text-[8px] uppercase tracking-wider opacity-80">Days</span>
          </div>
          <span className="opacity-50">:</span>
          <div className="flex flex-col items-center min-w-[40px]">
            <span className="font-bold">{timeLeft.hours.toString().padStart(2, '0')}</span>
            <span className="text-[8px] uppercase tracking-wider opacity-80">Hours</span>
          </div>
          <span className="opacity-50">:</span>
          <div className="flex flex-col items-center min-w-[40px]">
            <span className="font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</span>
            <span className="text-[8px] uppercase tracking-wider opacity-80">Mins</span>
          </div>
          <span className="opacity-50">:</span>
          <div className="flex flex-col items-center min-w-[40px]">
            <span className="font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</span>
            <span className="text-[8px] uppercase tracking-wider opacity-80">Secs</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SaleBanner;
