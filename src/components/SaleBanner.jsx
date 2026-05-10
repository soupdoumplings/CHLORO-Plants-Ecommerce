import React, { useEffect, useMemo, useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';

const getTimeLeft = (endAt) => {
  if (!endAt) return null;
  const difference = new Date(endAt).getTime() - Date.now();
  if (difference <= 0) return null;

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

const SaleBanner = () => {
  const [sale, setSale] = useState(null);
  const [, setTick] = useState(0);

  useEffect(() => {
    let active = true;

    const fetchSale = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('name, sale_price, sale_ends_at')
        .eq('is_on_sale', true)
        .not('sale_price', 'is', null)
        .order('sale_ends_at', { ascending: true, nullsFirst: false })
        .limit(1);

      if (!active) return;
      if (error) {
        setSale(null);
        return;
      }

      const currentSale = (data || []).find((item) => (
        !item.sale_ends_at || new Date(item.sale_ends_at).getTime() > Date.now()
      ));
      setSale(currentSale || null);
    };

    fetchSale();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!sale?.sale_ends_at) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setTick((value) => value + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [sale?.sale_ends_at]);

  const timeLeft = getTimeLeft(sale?.sale_ends_at);

  const timerParts = useMemo(() => {
    if (!timeLeft) return [];
    return [
      ['Days', timeLeft.days],
      ['Hours', String(timeLeft.hours).padStart(2, '0')],
      ['Mins', String(timeLeft.minutes).padStart(2, '0')],
      ['Secs', String(timeLeft.seconds).padStart(2, '0')],
    ];
  }, [timeLeft]);

  if (!sale) return null;

  return (
    <AnimatePresence>
      <Motion.aside
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-30 border-y border-[#785A1A]/15 bg-[#31332C] px-5 py-4 text-[#FBF9F4]"
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
          <div>
            <p className="font-label text-[9px] font-bold uppercase tracking-[0.28em] text-[#FBD185]">
              Seasonal Sale Event
            </p>
            <p className="mt-1 font-headline text-[24px] leading-tight">
              {sale.name} is currently marked down.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {timerParts.length > 0 && (
              <div className="flex items-center gap-3">
                {timerParts.map(([label, value]) => (
                  <div key={label} className="min-w-[46px] border border-white/10 px-3 py-2 text-center">
                    <p className="font-headline text-[20px] leading-none">{value}</p>
                    <p className="mt-1 font-label text-[7px] font-bold uppercase tracking-[0.16em] text-white/55">{label}</p>
                  </div>
                ))}
              </div>
            )}
            <Link
              to="/discovery"
              className="border border-[#FBD185]/70 px-5 py-3 font-label text-[9px] font-bold uppercase tracking-[0.18em] text-[#FBD185] transition-colors hover:bg-[#FBD185] hover:text-[#31332C]"
            >
              Shop Sale
            </Link>
          </div>
        </div>
      </Motion.aside>
    </AnimatePresence>
  );
};

export default SaleBanner;
