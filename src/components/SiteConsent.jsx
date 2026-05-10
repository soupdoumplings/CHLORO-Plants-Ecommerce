import React, { useState } from 'react';

const STORAGE_KEY = 'chloro-essential-storage-notice';

const SiteConsent = () => {
  const [visible, setVisible] = useState(() => window.localStorage.getItem(STORAGE_KEY) !== 'dismissed');

  const dismiss = () => {
    window.localStorage.setItem(STORAGE_KEY, 'dismissed');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-5 left-5 right-5 z-[70] mx-auto max-w-[560px] border border-[#D9DBCF] bg-[#FFFEFA] p-4 shadow-[0_18px_50px_rgba(15,58,58,0.12)] md:left-auto md:right-6 md:mx-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-label text-[9px] font-bold uppercase tracking-[0.18em] text-[#0F3A3A]">
            Essential Storage
          </p>
          <p className="mt-2 font-body text-[12px] leading-relaxed text-[#5E6058]">
            CHLORO uses only necessary browser storage for sign-in, cart, checkout, and saved preferences. No ad tracking is active.
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 border border-[#0F3A3A] px-5 py-3 font-label text-[9px] font-bold uppercase tracking-[0.16em] text-[#0F3A3A] transition-colors hover:bg-[#0F3A3A] hover:text-[#FBF9F4]"
        >
          Got it
        </button>
      </div>
    </div>
  );
};

export default SiteConsent;
