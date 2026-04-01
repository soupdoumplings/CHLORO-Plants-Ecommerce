import React, { useState } from 'react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setEmail('');
    }
  };

  return (
    <section className="w-full bg-[#F5F4ED] py-28 lg:py-36">
      <div className="max-w-[600px] mx-auto px-10 text-center">
        {/* Decorative divider */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <span className="w-8 h-[1px] bg-[#B1B3A9]/40" />
          <span className="material-symbols-outlined text-[#456565] text-[20px]">
            local_florist
          </span>
          <span className="w-8 h-[1px] bg-[#B1B3A9]/40" />
        </div>

        <h2 className="font-headline text-[clamp(1.8rem,4vw,2.8rem)] text-[#31332C] leading-[1.15] tracking-tight mb-14">
          Receive the quarterly Journal on{' '}
          <span className="italic font-light">botanical preservation.</span>
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-5">
          <div className="w-full max-w-[380px]">
            <label className="block font-label text-[9px] tracking-[0.15em] uppercase text-[#5E6058]/60 font-medium mb-2 text-left">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-[#31332C]/15 pb-3 font-body text-[14px] text-[#31332C] placeholder:text-[#B1B3A9] outline-none focus:border-[#456565] transition-colors duration-300"
              required
            />
          </div>

          <button
            type="submit"
            className="mt-4 bg-[#456565] text-white px-10 py-3.5 font-label text-[10px] tracking-[0.15em] uppercase font-semibold hover:bg-[#375757] active:scale-[0.98] transition-all duration-300"
          >
            {submitted ? 'Subscribed ✓' : 'Subscribe'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
