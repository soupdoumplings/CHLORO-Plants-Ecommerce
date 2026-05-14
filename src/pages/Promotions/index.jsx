import React, { useState, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabase';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const PromotionsPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [selectedProductId, setSelectedProductId] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch products
      const { data: prodData, error: prodError } = await supabase
        .from('products')
        .select('id, name, price, images')
        .order('name');

      if (prodError) throw prodError;
      setProducts(prodData || []);

      // 2. Fetch promotions
      const { data: promData, error: promError } = await supabase
        .from('promotions')
        .select('*');

      if (promError) throw promError;

      // 3. Manually join them in memory to be safe
      const joinedData = (promData || []).map(prom => ({
        ...prom,
        products: prodData.find(p => p.id === prom.product_id) || { name: 'Unknown Specimen', price: 0 }
      }));

      setPromotions(joinedData);
    } catch (err) {
      console.error('Fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreatePromotion = async (e) => {
    e.preventDefault();
    if (!selectedProductId || !discountPercent || !startAt || !endAt) {
      alert("Please fill all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('promotions').insert([{
        product_id: selectedProductId,
        discount_percent: parseFloat(discountPercent),
        start_at: new Date(startAt).toISOString(),
        end_at: new Date(endAt).toISOString(),
        status: 'scheduled'
      }]);

      if (error) throw error;
      
      setShowAddModal(false);
      resetForm();
      fetchData();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedProductId('');
    setDiscountPercent('');
    setStartAt('');
    setEndAt('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Cancel this promotion?")) return;
    try {
      const { error } = await supabase.from('promotions').delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSync = async () => {
    setIsSubmitting(true);
    const now = new Date().toISOString();
    
    try {
      // 1. Find promotions that should be active
      const toActivate = promotions.filter(p => 
        p.status === 'scheduled' && 
        p.start_at <= now && 
        p.end_at > now
      );

      // 2. Find promotions that should be expired
      const toExpire = promotions.filter(p => 
        p.status === 'active' && 
        p.end_at <= now
      );

      // Process Activations
      for (const prom of toActivate) {
        const salePrice = prom.products.price * (1 - (prom.discount_percent / 100));
        await supabase.from('products').update({
          is_on_sale: true,
          sale_price: salePrice
        }).eq('id', prom.product_id);
        
        await supabase.from('promotions').update({ status: 'active' }).eq('id', prom.id);
      }

      // Process Expirations
      for (const prom of toExpire) {
        await supabase.from('products').update({
          is_on_sale: false,
          sale_price: null
        }).eq('id', prom.product_id);
        
        await supabase.from('promotions').update({ status: 'expired' }).eq('id', prom.id);
      }

      fetchData();
      alert(`Sync complete. ${toActivate.length} activated, ${toExpire.length} expired.`);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#FBF9F4] flex flex-col items-center w-full"
    >
      <Navbar />
      
      <main className="w-full max-w-[1440px] mx-auto flex-grow mt-[120px] px-6 md:px-12 pb-24">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-16">
          <div>
            <span className="font-label text-[11px] tracking-[0.2em] uppercase text-[#785A1A]">Marketing & Growth</span>
            <h1 className="font-headline text-5xl md:text-6xl text-[#31332C] tracking-tight mt-2">Promotions</h1>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleSync}
              disabled={isSubmitting}
              className="bg-[#E8E9E0] text-[#31332C] px-8 py-4 font-label text-[12px] tracking-[1.5px] uppercase hover:bg-[#dbddd0] transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">sync</span>
              Sync Now
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-[#5F5E5E] text-[#FAF7F6] px-8 py-4 font-label text-[12px] tracking-[1.5px] uppercase hover:bg-[#31332C] transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              New Promotion
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-[#B1B3A9]/20 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              
            </thead>
            <tbody className="divide-y divide-[#B1B3A9]/10">
              {loading ? (
                <tr><td colSpan="5" className="py-12 text-center font-body text-[#5E6058]">Fetching promotions...</td></tr>
              ) : promotions.length === 0 ? (
                <tr><td colSpan="5" className="py-12 text-center font-body text-[#5E6058]">No promotions scheduled.</td></tr>
              ) : (
                promotions.map((prom) => (
                  <tr key={prom.id} className="group hover:bg-[#FBF9F4]/50 transition-colors">
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#EFEEE6] rounded overflow-hidden">
                          <img src={prom.products?.images?.[0]} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-headline text-lg text-[#31332C]">{prom.products?.name}</p>
                          <p className="font-body text-xs text-[#5E6058]">Original: रू {prom.products?.price}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-4">
                      <span className="font-headline text-2xl text-[#785A1A]">{prom.discount_percent}%</span>
                    </td>
                    <td className="py-6 px-4">
                      <div className="font-body text-xs text-[#31332C] space-y-1">
                        <p><span className="opacity-50">Start:</span> {new Date(prom.start_at).toLocaleString()}</p>
                        <p><span className="opacity-50">End:</span> {new Date(prom.end_at).toLocaleString()}</p>
                      </div>
                    </td>
                    <td className="py-6 px-4">
                      <span className={`px-3 py-1 rounded-full font-label text-[9px] uppercase tracking-wider font-bold ${
                        prom.status === 'active' ? 'bg-green-100 text-green-700' :
                        prom.status === 'expired' ? 'bg-gray-100 text-gray-500' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {prom.status}
                      </span>
                    </td>
                    <td className="py-6 px-8 text-right">
                      <button 
                        onClick={() => handleDelete(prom.id)}
                        className="material-symbols-outlined text-[#5E6058] hover:text-[#9F403D] transition-colors"
                      >
                        delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <Motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-[#31332C]/40 backdrop-blur-sm"
            />
            <Motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white p-10 md:p-14 rounded-3xl shadow-2xl max-w-xl w-full border border-[#B1B3A9]/20"
            >
              <h2 className="font-headline text-3xl text-[#31332C] mb-8">Schedule Promotion</h2>
              <form onSubmit={handleCreatePromotion} className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="font-label text-[10px] uppercase tracking-widest text-[#5E6058] font-black">Select Plant</label>
                  <select 
                    value={selectedProductId} 
                    onChange={e => setSelectedProductId(e.target.value)}
                    className="w-full bg-[#FBF9F4] border border-[#B1B3A9]/20 p-4 rounded-xl outline-none focus:border-[#785A1A]"
                  >
                    <option value="">Choose a specimen...</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (रू {p.price})</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-label text-[10px] uppercase tracking-widest text-[#5E6058] font-black">Discount Percentage (%)</label>
                  <input 
                    type="number" 
                    value={discountPercent} 
                    onChange={e => setDiscountPercent(e.target.value)}
                    placeholder="e.g. 40"
                    className="w-full bg-[#FBF9F4] border border-[#B1B3A9]/20 p-4 rounded-xl outline-none focus:border-[#785A1A]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="font-label text-[10px] uppercase tracking-widest text-[#5E6058] font-black">Start Time</label>
                    <input 
                      type="datetime-local" 
                      value={startAt} 
                      onChange={e => setStartAt(e.target.value)}
                      className="w-full bg-[#FBF9F4] border border-[#B1B3A9]/20 p-4 rounded-xl outline-none focus:border-[#785A1A]"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-label text-[10px] uppercase tracking-widest text-[#5E6058] font-black">End Time</label>
                    <input 
                      type="datetime-local" 
                      value={endAt} 
                      onChange={e => setEndAt(e.target.value)}
                      className="w-full bg-[#FBF9F4] border border-[#B1B3A9]/20 p-4 rounded-xl outline-none focus:border-[#785A1A]"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button 
                    type="button" 
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-8 py-4 font-label text-[11px] tracking-[0.2em] uppercase font-bold text-[#5E6058] border border-[#B1B3A9]/20 rounded-xl hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-8 py-4 font-label text-[11px] tracking-[0.2em] uppercase font-bold text-white bg-[#5F5E5E] rounded-xl hover:bg-[#31332C] transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Scheduling...' : 'Schedule'}
                  </button>
                </div>
              </form>
            </Motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </Motion.div>
  );
};

export default PromotionsPage;
