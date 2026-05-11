import React, { useCallback, useEffect, useRef } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useGeoLocation } from '../../lib/useGeoLocation';

const emptyAddress = {
  addressLine: '',
  city: '',
  country: 'Nepal',
  postalCode: '',
};

const getAddressFields = (detectedLocation) => {
  if (!detectedLocation?.address) return emptyAddress;

  return {
    addressLine: detectedLocation.address.addressLine || '',
    city: detectedLocation.address.city || '',
    country: detectedLocation.address.country || 'Nepal',
    postalCode: detectedLocation.address.postalCode || '',
  };
};

const getDetectedLocationLabel = (detectedLocation) => {
  if (!detectedLocation?.address) return 'your current area';
  return detectedLocation.address.neighbourhood
    || detectedLocation.address.addressLine
    || detectedLocation.address.city
    || detectedLocation.address.country
    || 'your current area';
};

const CheckoutForm = ({ paymentMethod, setPaymentMethod, checkoutDetails, setCheckoutDetails }) => {
  const { location, loading: locating, error: locationError, isSupported, requestLocation } = useGeoLocation();
  const hasRequestedLocation = useRef(false);
  const sameAsShipping = checkoutDetails.sameAsShipping;
  const shippingAddress = checkoutDetails.shippingAddress;
  const billingAddress = checkoutDetails.billingAddress;

  const updateDetails = (patch) => {
    setCheckoutDetails((current) => ({ ...current, ...patch }));
  };

  const updateAddress = (addressType, field, value) => {
    setCheckoutDetails((current) => {
      const nextAddress = { ...current[addressType], [field]: value };
      const nextDetails = { ...current, [addressType]: nextAddress };

      if (addressType === 'shippingAddress' && current.sameAsShipping) {
        nextDetails.billingAddress = nextAddress;
      }

      return nextDetails;
    });
  };

  const fillAddressFromLocation = useCallback((detectedLocation) => {
    if (!detectedLocation?.address) return;

    const detectedAddress = getAddressFields(detectedLocation);

    setCheckoutDetails((current) => {
      const nextShippingAddress = {
        addressLine: current.shippingAddress.addressLine || detectedAddress.addressLine,
        city: current.shippingAddress.city || detectedAddress.city,
        postalCode: current.shippingAddress.postalCode || detectedAddress.postalCode,
        country: current.shippingAddress.country || detectedAddress.country,
      };

      const nextBillingAddress = current.sameAsShipping
        ? nextShippingAddress
        : {
          addressLine: current.billingAddress.addressLine || detectedAddress.addressLine,
          city: current.billingAddress.city || detectedAddress.city,
          country: current.billingAddress.country || detectedAddress.country,
          postalCode: current.billingAddress.postalCode || detectedAddress.postalCode,
        };

      return {
        ...current,
        shippingAddress: nextShippingAddress,
        billingAddress: nextBillingAddress,
      };
    });
  }, [setCheckoutDetails]);

  useEffect(() => {
    if (!location && !hasRequestedLocation.current && isSupported) {
      hasRequestedLocation.current = true;
      requestLocation().then((result) => {
        if (result.success) fillAddressFromLocation(result.location);
      });
    }
  }, [fillAddressFromLocation, location, isSupported, requestLocation]);

  const handleUseCurrentLocation = async () => {
    const result = await requestLocation();
    if (result.success) fillAddressFromLocation(result.location);
  };

  const handleShippingChange = (field, value) => {
    updateAddress('shippingAddress', field, value);
  };

  const handleBillingChange = (field, value) => {
    updateAddress('billingAddress', field, value);
  };

  return (
    <div className="flex flex-col gap-14 lg:gap-20 w-full max-w-[640px]">
      {/* ----------------- STEP 1: SHIPPING ----------------- */}
      <Motion.section
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex justify-between items-end border-b border-[#B0B0A8]/20 pb-4 mb-8">
          <h2 className="font-headline text-[24px] italic text-[#1A1A1A] leading-none">Contact & Shipping</h2>
          <span className="font-label text-[9px] tracking-[0.15em] uppercase text-[#6B6B6B] font-medium mb-1 relative top-[1px]">Step 01 / 02</span>
        </div>

        <div className="bg-[#F3F1EA] border border-[#B0B0A8]/20 p-5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-[#0F3A3A] text-[20px] mt-0.5">my_location</span>
            <div>
              <p className="font-label text-[9px] tracking-[0.16em] uppercase text-[#1A1A1A] font-bold mb-1">
                Location Autofill
              </p>
              <p className="font-body text-[12px] leading-relaxed text-[#5E6058]">
                {locating
                  ? 'Detecting your current location...'
                  : location
                    ? `Detected ${getDetectedLocationLabel(location)}.`
                    : 'Allow location access to fill your shipping and billing address.'}
              </p>
              {locationError && (
                <p className="font-label text-[9px] tracking-[0.06em] text-[#9F403D] font-semibold mt-2">
                  {locationError}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={!isSupported || locating}
            className="border border-[#0F3A3A] text-[#0F3A3A] px-5 py-3 font-label text-[9px] tracking-[0.16em] uppercase font-bold hover:bg-[#0F3A3A] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {locating ? 'Locating...' : 'Use Location'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col gap-2.5">
            <label className="font-label text-[9px] tracking-[0.15em] uppercase text-[#4A4A4A] font-semibold">Email Address</label>
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="julian@example.com"
              value={checkoutDetails.email}
              onChange={(e) => updateDetails({ email: e.target.value })}
              className="border border-[#B0B0A8]/40 bg-transparent px-4 py-3.5 font-body text-[14px] text-[#1A1A1A] outline-none focus:border-[#1A1A1A] transition-colors shadow-sm"
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <label className="font-label text-[9px] tracking-[0.15em] uppercase text-[#4A4A4A] font-semibold">Phone Number</label>
            <input
              type="tel"
              name="tel"
              autoComplete="tel"
              placeholder="+977 98..."
              value={checkoutDetails.phone}
              onChange={(e) => updateDetails({ phone: e.target.value })}
              className="border border-[#B0B0A8]/40 bg-transparent px-4 py-3.5 font-body text-[14px] text-[#1A1A1A] outline-none focus:border-[#1A1A1A] transition-colors shadow-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col gap-2.5">
            <label className="font-label text-[9px] tracking-[0.15em] uppercase text-[#4A4A4A] font-semibold">First Name</label>
            <input
              type="text"
              name="given-name"
              autoComplete="given-name"
              value={checkoutDetails.firstName}
              onChange={(e) => updateDetails({ firstName: e.target.value })}
              className="border border-[#B0B0A8]/40 bg-transparent px-4 py-3.5 font-body text-[14px] text-[#1A1A1A] outline-none focus:border-[#1A1A1A] transition-colors shadow-sm"
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <label className="font-label text-[9px] tracking-[0.15em] uppercase text-[#4A4A4A] font-semibold">Last Name</label>
            <input
              type="text"
              name="family-name"
              autoComplete="family-name"
              value={checkoutDetails.lastName}
              onChange={(e) => updateDetails({ lastName: e.target.value })}
              className="border border-[#B0B0A8]/40 bg-transparent px-4 py-3.5 font-body text-[14px] text-[#1A1A1A] outline-none focus:border-[#1A1A1A] transition-colors shadow-sm"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2.5 mb-6">
          <label className="font-label text-[9px] tracking-[0.15em] uppercase text-[#4A4A4A] font-semibold">Shipping Address</label>
          <input
            type="text"
            name="shipping street-address"
            autoComplete="shipping street-address"
            placeholder="Street name and house number"
            value={shippingAddress.addressLine}
            onChange={(e) => handleShippingChange('addressLine', e.target.value)}
            className="border border-[#B0B0A8]/40 bg-transparent px-4 py-3.5 font-body text-[14px] text-[#1A1A1A] placeholder:text-[#B0B0A8] outline-none focus:border-[#1A1A1A] transition-colors shadow-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2.5">
            <label className="font-label text-[9px] tracking-[0.15em] uppercase text-[#4A4A4A] font-semibold">City</label>
            <input
              type="text"
              name="shipping address-level2"
              autoComplete="shipping address-level2"
              value={shippingAddress.city}
              onChange={(e) => handleShippingChange('city', e.target.value)}
              className="border border-[#B0B0A8]/40 bg-transparent px-4 py-3.5 font-body text-[14px] text-[#1A1A1A] outline-none focus:border-[#1A1A1A] transition-colors shadow-sm"
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <label className="font-label text-[9px] tracking-[0.15em] uppercase text-[#4A4A4A] font-semibold">Country</label>
            <input
              type="text"
              name="shipping country-name"
              autoComplete="shipping country-name"
              value={shippingAddress.country}
              onChange={(e) => handleShippingChange('country', e.target.value)}
              className="border border-[#B0B0A8]/40 bg-transparent px-4 py-3.5 font-body text-[14px] text-[#1A1A1A] outline-none focus:border-[#1A1A1A] transition-colors shadow-sm"
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <label className="font-label text-[9px] tracking-[0.15em] uppercase text-[#4A4A4A] font-semibold">Postal Code</label>
            <input
              type="text"
              name="shipping postal-code"
              autoComplete="shipping postal-code"
              value={shippingAddress.postalCode}
              onChange={(e) => handleShippingChange('postalCode', e.target.value)}
              className="border border-[#B0B0A8]/40 bg-transparent px-4 py-3.5 font-body text-[14px] text-[#1A1A1A] outline-none focus:border-[#1A1A1A] transition-colors shadow-sm"
            />
          </div>
        </div>

        <div className="mt-8 mb-4 flex items-center gap-3">
          <input
            type="checkbox"
            id="sameAsShipping"
            checked={sameAsShipping}
            onChange={(e) => {
              setCheckoutDetails((current) => ({
                ...current,
                sameAsShipping: e.target.checked,
                billingAddress: e.target.checked ? current.shippingAddress : current.billingAddress,
              }));
            }}
            className="w-4 h-4 accent-[#1A1A1A] border-[#B0B0A8]/40 bg-transparent cursor-pointer"
          />
          <label htmlFor="sameAsShipping" className="font-label text-[10px] tracking-[0.1em] uppercase text-[#4A4A4A] cursor-pointer pt-[2px]">
            Billing address is same as shipping
          </label>
        </div>

        <AnimatePresence>
          {!sameAsShipping && (
            <Motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="overflow-hidden"
            >
              <div className="pt-6 border-t border-[#B0B0A8]/20 mt-4">
                <h3 className="font-headline text-[18px] italic text-[#1A1A1A] mb-6">Billing Address</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="flex flex-col gap-2.5">
                    <label className="font-label text-[9px] tracking-[0.15em] uppercase text-[#4A4A4A] font-semibold">First Name</label>
                    <input type="text" className="border border-[#B0B0A8]/40 bg-transparent px-4 py-3.5 font-body text-[14px] text-[#1A1A1A] outline-none focus:border-[#1A1A1A] transition-colors shadow-sm" />
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <label className="font-label text-[9px] tracking-[0.15em] uppercase text-[#4A4A4A] font-semibold">Last Name</label>
                    <input type="text" className="border border-[#B0B0A8]/40 bg-transparent px-4 py-3.5 font-body text-[14px] text-[#1A1A1A] outline-none focus:border-[#1A1A1A] transition-colors shadow-sm" />
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 mb-6">
                  <label className="font-label text-[9px] tracking-[0.15em] uppercase text-[#4A4A4A] font-semibold">Billing Address</label>
                  <input
                    type="text"
                    placeholder="Street name and house number"
                    autoComplete="billing street-address"
                    value={billingAddress.addressLine}
                    onChange={(e) => handleBillingChange('addressLine', e.target.value)}
                    className="border border-[#B0B0A8]/40 bg-transparent px-4 py-3.5 font-body text-[14px] text-[#1A1A1A] placeholder:text-[#B0B0A8] outline-none focus:border-[#1A1A1A] transition-colors shadow-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col gap-2.5">
                    <label className="font-label text-[9px] tracking-[0.15em] uppercase text-[#4A4A4A] font-semibold">City</label>
                    <input
                      type="text"
                      autoComplete="billing address-level2"
                      value={billingAddress.city}
                      onChange={(e) => handleBillingChange('city', e.target.value)}
                      className="border border-[#B0B0A8]/40 bg-transparent px-4 py-3.5 font-body text-[14px] text-[#1A1A1A] outline-none focus:border-[#1A1A1A] transition-colors shadow-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <label className="font-label text-[9px] tracking-[0.15em] uppercase text-[#4A4A4A] font-semibold">Country</label>
                    <input
                      type="text"
                      autoComplete="billing country-name"
                      value={billingAddress.country}
                      onChange={(e) => handleBillingChange('country', e.target.value)}
                      className="border border-[#B0B0A8]/40 bg-transparent px-4 py-3.5 font-body text-[14px] text-[#1A1A1A] outline-none focus:border-[#1A1A1A] transition-colors shadow-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <label className="font-label text-[9px] tracking-[0.15em] uppercase text-[#4A4A4A] font-semibold">Postal Code</label>
                    <input
                      type="text"
                      autoComplete="billing postal-code"
                      value={billingAddress.postalCode}
                      onChange={(e) => handleBillingChange('postalCode', e.target.value)}
                      className="border border-[#B0B0A8]/40 bg-transparent px-4 py-3.5 font-body text-[14px] text-[#1A1A1A] outline-none focus:border-[#1A1A1A] transition-colors shadow-sm"
                    />
                  </div>
                </div>
              </div>
            </Motion.div>
          )}
        </AnimatePresence>
      </Motion.section>

      {/* ----------------- STEP 2: PAYMENT ----------------- */}
      <Motion.section
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-20px' }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="bg-[#F3F1EA] p-8 lg:p-12 border border-[#B0B0A8]/10"
      >
        <div className="flex justify-between items-end mb-8 relative">
          <h2 className="font-headline text-[24px] italic text-[#1A1A1A] leading-none">Payment Details</h2>
          <span className="font-label text-[9px] tracking-[0.15em] uppercase text-[#6B6B6B] font-medium mb-1 relative top-[1px]">Step 02 / 02</span>
        </div>

        <div className="flex flex-col gap-4 mb-8">
          <label className={`relative flex items-center justify-between cursor-pointer border p-6 transition-all duration-500 overflow-hidden group ${paymentMethod === 'card' ? 'border-[#1A1A1A] bg-white shadow-md' : 'border-[#B0B0A8]/20 bg-transparent hover:border-[#B0B0A8]/50 hover:bg-white/50'}`}>
            <div className="flex items-center gap-5 relative z-10">
              <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} className="accent-[#1A1A1A] w-4 h-4" />
              <div className="flex flex-col">
                <span className={`font-headline italic text-[18px] transition-colors ${paymentMethod === 'card' ? 'text-[#1A1A1A]' : 'text-[#4A4A4A]'}`}>Pay Securely</span>
                <span className="font-label text-[9px] uppercase tracking-[0.15em] text-[#6B6B6B] mt-1">Credit / Debit Card</span>
              </div>
            </div>
            <div className={`relative z-10 transition-opacity ${paymentMethod === 'card' ? 'opacity-100' : 'opacity-40 group-hover:opacity-60'}`}>
              <span className="material-symbols-outlined text-[28px] text-[#1A1A1A]">credit_card</span>
            </div>
          </label>

          <label className={`relative flex items-center justify-between cursor-pointer border p-6 transition-all duration-500 overflow-hidden group ${paymentMethod === 'esewa' ? 'border-[#60BB46]/40 bg-[#60BB46]/5 shadow-md' : 'border-[#B0B0A8]/20 bg-transparent hover:border-[#B0B0A8]/50 hover:bg-white/50'}`}>
            <div className="flex items-center gap-5 relative z-10">
              <input type="radio" name="payment" value="esewa" checked={paymentMethod === 'esewa'} onChange={(e) => setPaymentMethod(e.target.value)} className="accent-[#60BB46] w-4 h-4" />
              <div className="flex flex-col">
                <span className={`font-headline italic text-[18px] transition-colors ${paymentMethod === 'esewa' ? 'text-[#2C5E1D]' : 'text-[#4A4A4A] group-hover:text-[#2C5E1D]'}`}>Pay with eSewa</span>
                <span className="font-label text-[9px] uppercase tracking-[0.15em] text-[#6B6B6B] mt-1">Digital Wallet</span>
              </div>
            </div>
            <div className={`relative z-10 transition-opacity ${paymentMethod === 'esewa' ? 'opacity-100' : 'opacity-60 group-hover:opacity-80'}`}>
              <svg viewBox="0 0 40 40" className="w-8 h-8"><circle cx="20" cy="20" r="18" fill="#60BB46"/><text x="20" y="26" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="Arial">e</text></svg>
            </div>
          </label>

          <label className={`relative flex items-center justify-between cursor-pointer border p-6 transition-all duration-500 overflow-hidden group ${paymentMethod === 'khalti' ? 'border-[#5C2D91]/40 bg-[#5C2D91]/5 shadow-md' : 'border-[#B0B0A8]/20 bg-transparent hover:border-[#B0B0A8]/50 hover:bg-white/50'}`}>
            <div className="flex items-center gap-5 relative z-10">
              <input type="radio" name="payment" value="khalti" checked={paymentMethod === 'khalti'} onChange={(e) => setPaymentMethod(e.target.value)} className="accent-[#5C2D91] w-4 h-4" />
              <div className="flex flex-col">
                <span className={`font-headline italic text-[18px] transition-colors ${paymentMethod === 'khalti' ? 'text-[#3D1A68]' : 'text-[#4A4A4A] group-hover:text-[#3D1A68]'}`}>Pay with Khalti</span>
                <span className="font-label text-[9px] uppercase tracking-[0.15em] text-[#6B6B6B] mt-1">Digital Wallet</span>
              </div>
            </div>
            <div className={`relative z-10 transition-opacity ${paymentMethod === 'khalti' ? 'opacity-100' : 'opacity-60 group-hover:opacity-80'}`}>
              <svg viewBox="0 0 40 40" className="w-8 h-8"><circle cx="20" cy="20" r="18" fill="#5C2D91"/><text x="20" y="26" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="Arial">K</text></svg>
            </div>
          </label>

          <label className={`relative flex items-center justify-between cursor-pointer border p-6 transition-all duration-500 overflow-hidden group ${paymentMethod === 'cod' ? 'border-[#2F4F4F]/40 bg-[#2F4F4F]/5 shadow-md' : 'border-[#B0B0A8]/20 bg-transparent hover:border-[#B0B0A8]/50 hover:bg-white/50'}`}>
            <div className="flex items-center gap-5 relative z-10">
              <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} className="accent-[#2F4F4F] w-4 h-4" />
              <div className="flex flex-col">
                <span className={`font-headline italic text-[18px] transition-colors ${paymentMethod === 'cod' ? 'text-[#1A2E2E]' : 'text-[#4A4A4A] group-hover:text-[#1A2E2E]'}`}>Cash on Delivery</span>
                <span className="font-label text-[9px] uppercase tracking-[0.15em] text-[#6B6B6B] mt-1">Pay at Doorstep</span>
              </div>
            </div>
            <div className={`relative z-10 transition-opacity ${paymentMethod === 'cod' ? 'opacity-100' : 'opacity-40 group-hover:opacity-60'}`}>
              <svg viewBox="0 0 40 40" className="w-8 h-8"><circle cx="20" cy="20" r="18" fill="#2F4F4F"/><text x="20" y="25" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="Arial">COD</text></svg>
            </div>
          </label>
        </div>

        <AnimatePresence mode="wait">
          {paymentMethod === 'card' && (
            <Motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white p-7 lg:p-10 shadow-sm mb-6 border border-[#B0B0A8]/10 overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <label className="font-label text-[9px] tracking-[0.15em] uppercase text-[#4A4A4A] font-semibold">Card Information</label>
                <div className="flex gap-2">
                  <span className="w-[34px] h-[22px] bg-[#F3F1EA] rounded-[3px]"></span>
                  <span className="w-[34px] h-[22px] bg-[#F3F1EA] rounded-[3px]"></span>
                  <span className="w-[34px] h-[22px] bg-[#F3F1EA] rounded-[3px]"></span>
                </div>
              </div>

              <div className="flex flex-col space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Card Number"
                    className="w-full border border-[#B0B0A8]/30 bg-transparent px-4 py-3.5 font-body text-[14px] text-[#1A1A1A] placeholder:text-[#B0B0A8] outline-none focus:border-[#1A1A1A] transition-colors"
                    defaultValue=""
                  />
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#B0B0A8] text-[20px]">
                    credit_card
                  </span>
                </div>

                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="MM / YY"
                    className="w-1/2 border border-[#B0B0A8]/30 bg-transparent px-4 py-3.5 font-body text-[14px] text-[#1A1A1A] placeholder:text-[#B0B0A8] outline-none focus:border-[#1A1A1A] transition-colors"
                  />
                  <input
                    type="text"
                    placeholder="CVC"
                    className="w-1/2 border border-[#B0B0A8]/30 bg-transparent px-4 py-3.5 font-body text-[14px] text-[#1A1A1A] placeholder:text-[#B0B0A8] outline-none focus:border-[#1A1A1A] transition-colors"
                  />
                </div>
              </div>
            </Motion.div>
          )}

          {paymentMethod === 'esewa' && (
            <Motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-[#60B246]/10 p-7 lg:p-10 shadow-sm mb-6 border border-[#60B246]/30 text-center overflow-hidden"
            >
              <h3 className="font-headline text-[18px] text-[#2C5E1D] mb-2">Pay with eSewa</h3>
              <p className="font-body text-[#4A4A4A] text-[13px]">You will be redirected to the eSewa portal to complete your transaction securely.</p>
            </Motion.div>
          )}

          {paymentMethod === 'khalti' && (
            <Motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-[#5C2D91]/10 p-7 lg:p-10 shadow-sm mb-6 border border-[#5C2D91]/30 text-center overflow-hidden"
            >
              <h3 className="font-headline text-[18px] text-[#3D1A68] mb-2">Pay with Khalti</h3>
              <p className="font-body text-[#4A4A4A] text-[13px]">You will be redirected to Khalti's secure checkout page to complete your payment.</p>
            </Motion.div>
          )}

          {paymentMethod === 'cod' && (
            <Motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white p-7 lg:p-10 shadow-sm mb-6 border border-[#B0B0A8]/10 text-center overflow-hidden"
            >
              <h3 className="font-headline text-[18px] text-[#1A1A1A] mb-2">Cash on Delivery</h3>
              <p className="font-body text-[#4A4A4A] text-[13px]">You will pay the courier when your plant order is safely delivered.</p>
            </Motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 space-y-4 border-t border-[#B0B0A8]/20 pt-7">
          <label className="flex cursor-pointer items-start gap-3 bg-white/55 p-4">
            <input
              type="checkbox"
              checked={checkoutDetails.emailOrderUpdates}
              onChange={(event) => updateDetails({ emailOrderUpdates: event.target.checked })}
              className="mt-1 h-4 w-4 accent-[#0F3A3A]"
            />
            <span>
              <span className="block font-label text-[9px] font-bold uppercase tracking-[0.14em] text-[#1A1A1A]">
                Email me order updates
              </span>
              <span className="mt-1 block font-body text-[12px] leading-relaxed text-[#5E6058]">
                We will only send purchase, payment, and delivery updates for this order.
              </span>
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-3 bg-white/35 p-4">
            <input
              type="checkbox"
              checked={checkoutDetails.marketingEmails}
              onChange={(event) => updateDetails({ marketingEmails: event.target.checked })}
              className="mt-1 h-4 w-4 accent-[#785A1A]"
            />
            <span>
              <span className="block font-label text-[9px] font-bold uppercase tracking-[0.14em] text-[#1A1A1A]">
                Send plant care tips and offers
              </span>
              <span className="mt-1 block font-body text-[12px] leading-relaxed text-[#5E6058]">
                Optional. Leave this off if you only want essential order emails.
              </span>
            </span>
          </label>
        </div>
      </Motion.section>
    </div>
  );
};

export default CheckoutForm;
