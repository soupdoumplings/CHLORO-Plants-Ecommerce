import React from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';

const NotificationToast = ({ toast, onClose }) => {
  if (!toast) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'PLANT_TIP': return '🌿';
      case 'DIAGNOSIS': return '🔍';
      case 'SALE': return '🏷️';
      case 'SYSTEM':
      default: return '🔔';
    }
  };

  return (
    <AnimatePresence>
      <Motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="fixed bottom-6 right-6 z-[100] w-80 bg-[#0F3A3A] border border-[#FBF9F4]/20 shadow-2xl overflow-hidden cursor-auto"
      >
        <div className="flex items-start p-4">
          <div className="text-2xl mr-3 flex-shrink-0">
            {getIcon(toast.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-headline text-[#FBF9F4] text-sm leading-tight mb-1">
              {toast.message}
            </p>
            {toast.link && (
              <a
                href={toast.link}
                className="font-label text-[#c6e9e9] hover:text-[#F58700] text-xs uppercase tracking-wider transition-colors inline-block mt-1"
                onClick={() => {
                  onClose();
                }}
              >
                View details →
              </a>
            )}
          </div>
          <button
            onClick={onClose}
            className="ml-3 text-[#FBF9F4]/50 hover:text-[#FBF9F4] transition-colors flex-shrink-0 focus:outline-none"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      </Motion.div>
    </AnimatePresence>
  );
};

export default NotificationToast;
