import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../supabase';

const BroadcastWidget = () => {
  const [message, setMessage] = useState('');
  const [type, setType] = useState('SYSTEM');
  const [link, setLink] = useState('');
  const [status, setStatus] = useState('IDLE'); // IDLE, LOADING, SUCCESS, ERROR

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setStatus('LOADING');
    try {
      // Use a secure database function (RPC) to bypass Row Level Security 
      // and safely insert the notification for all users
      const { error: rpcError } = await supabase.rpc('broadcast_notification', {
        p_type: type,
        p_message: message,
        p_link: link || null
      });

      if (rpcError) throw rpcError;

      setStatus('SUCCESS');
      setMessage('');
      setLink('');
      setTimeout(() => setStatus('IDLE'), 3000);
    } catch (err) {
      console.error('Broadcast failed:', err);
      setStatus('ERROR');
      setTimeout(() => setStatus('IDLE'), 3000);
    }
  };

  return (
    <div className="w-full bg-[#F3F1EA] p-8 border border-[#B0B0A8]/20 mb-12">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full md:w-1/3">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-[#1A1A1A]">campaign</span>
            <h3 className="font-headline text-[18px] text-[#1A1A1A]">Global Broadcast</h3>
          </div>
          <p className="font-body text-[13px] text-[#6B6B6B] leading-relaxed">
            Send an instant realtime notification to all users. Logged in users will see a toast immediately.
          </p>
        </div>

        <form onSubmit={handleBroadcast} className="w-full md:w-2/3 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-label text-[9px] tracking-[0.15em] uppercase text-[#4A4A4A] font-semibold">Notification Type</label>
              <div className="relative">
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full border border-[#B0B0A8]/40 bg-white px-4 py-3 font-body text-[13px] text-[#1A1A1A] outline-none focus:border-[#1A1A1A] appearance-none"
                >
                  <option value="SYSTEM">System Announcement</option>
                  <option value="SALE">Sale & Promo</option>
                  <option value="PLANT_TIP">Plant Tip</option>
                  <option value="DIAGNOSIS">AI Feature</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[18px] text-[#6B6B6B] pointer-events-none">expand_more</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-label text-[9px] tracking-[0.15em] uppercase text-[#4A4A4A] font-semibold">Optional Deep Link</label>
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="/discovery, /journal, etc."
                className="w-full border border-[#B0B0A8]/40 bg-white px-4 py-3 font-body text-[13px] text-[#1A1A1A] placeholder:text-[#B0B0A8] outline-none focus:border-[#1A1A1A]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-label text-[9px] tracking-[0.15em] uppercase text-[#4A4A4A] font-semibold">Message</label>
            <textarea
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              rows={2}
              className="w-full border border-[#B0B0A8]/40 bg-white px-4 py-3 font-body text-[13px] text-[#1A1A1A] placeholder:text-[#B0B0A8] outline-none focus:border-[#1A1A1A] resize-none"
            />
          </div>

          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={status === 'LOADING' || !message.trim()}
              className="bg-[#0F3A3A] hover:bg-[#1A5C5C] text-[#FBF9F4] px-8 py-3.5 font-label text-[10px] tracking-[0.2em] uppercase transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {status === 'LOADING' ? (
                <>Sending...</>
              ) : status === 'SUCCESS' ? (
                <>Sent! <span className="material-symbols-outlined text-[14px]">check_circle</span></>
              ) : status === 'ERROR' ? (
                <>Failed <span className="material-symbols-outlined text-[14px]">error</span></>
              ) : (
                <>Send <span className="material-symbols-outlined text-[14px]">send</span></>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BroadcastWidget;
