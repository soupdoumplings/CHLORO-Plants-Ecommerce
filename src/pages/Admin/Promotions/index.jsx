import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../../supabase';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { Link } from 'react-router-dom';

const PromotionsPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    product_id: '',
    discount_percent: '',
    start_at: '',
    end_at: ''
  });

  useEffect(() => {
    fetchData();
    // Run automated check on mount
    processPromotions();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: promoData } = await supabase.from('promotions').select('*, products(name)');
    const { data: prodData } = await supabase.from('products').select('id, name, price');
    
    if (promoData) setPromotions(promoData);
    if (prodData) setProducts(prodData);
    setLoading(false);
  };

  const processPromotions = async () => {
    const now = new Date().toISOString();
    
    // 1. Activate scheduled promotions
    const { data: toActivate } = await supabase
      .from('promotions')
      .select('*')
      .eq('status', 'scheduled')
      .lte('start_at', now);

    if (toActivate?.length > 0) {
      for (const promo of toActivate) {
        // Fetch product price to calculate sale price
        const { data: product } = await supabase.from('products').select('price').eq('id', promo.product_id).single();
        if (product) {
          const salePrice = product.price * (1 - promo.discount_percent / 100);
          await supabase.from('products').update({ is_on_sale: true, sale_price: salePrice }).eq('id', promo.product_id);
          await supabase.from('promotions').update({ status: 'active' }).eq('id', promo.id);
        }
      }
    }

    // 2. Deactivate expired promotions
    const { data: toExpire } = await supabase
      .from('promotions')
      .select('*')
      .eq('status', 'active')
      .lte('end_at', now);

    if (toExpire?.length > 0) {
      for (const promo of toExpire) {
        await supabase.from('products').update({ is_on_sale: false, sale_price: null }).eq('id', promo.product_id);
        await supabase.from('promotions').update({ status: 'expired' }).eq('id', promo.id);
      }
    }
    
    if (toActivate?.length > 0 || toExpire?.length > 0) fetchData();
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('promotions').insert([
      { ...formData, status: 'scheduled' }
    ]);
    
    if (!error) {
      setIsModalOpen(false);
      setFormData({ product_id: '', discount_percent: '', start_at: '', end_at: '' });
      fetchData();
      processPromotions(); // Immediate check
    } else {
      alert(error.message);
    }
  };

  const handleDelete = async (id, productId) => {
    if (window.confirm('Remove this promotion?')) {
      await supabase.from('products').update({ is_on_sale: false, sale_price: null }).eq('id', productId);
      await supabase.from('promotions').delete().eq('id', id);
      fetchData();
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F4] font-body text-[#31332C]">
      <Navbar />
      
      <main className="max-w-6xl mx-auto pt-32 px-6 pb-20">
        <header className="flex justify-between items-end mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link to="/archive" className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#785A1A] hover:underline">← Dashboard</Link>
            </div>
            <h1 className="font-headline text-5xl tracking-tight">Scheduled Discounts</h1>
            <p className="text-[#5E6058] mt-2 italic">Schedule automated discounts for your botanical collection.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#31332C] text-white px-8 py-3 rounded-full font-label text-[11px] tracking-widest uppercase hover:bg-[#785A1A] transition-colors"
          >
            Schedule Discount
          </button>
        </header>

        {loading ? (
          <div className="h-64 flex items-center justify-center italic opacity-50">Fetching schedules...</div>
        ) : (
          <div className="bg-white border border-[#B1B3A9]/20 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-[#F5F4ED] border-b border-[#B1B3A9]/10">
                <tr>
                  <th className="px-6 py-4 font-label text-[10px] uppercase tracking-widest font-black text-[#5E6058]">Plant</th>
                  <th className="px-6 py-4 font-label text-[10px] uppercase tracking-widest font-black text-[#5E6058]">Discount</th>
                  <th className="px-6 py-4 font-label text-[10px] uppercase tracking-widest font-black text-[#5E6058]">Start Time</th>
                  <th className="px-6 py-4 font-label text-[10px] uppercase tracking-widest font-black text-[#5E6058]">End Time</th>
                  <th className="px-6 py-4 font-label text-[10px] uppercase tracking-widest font-black text-[#5E6058]">Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#B1B3A9]/10">
                {promotions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-20 text-center text-[#5E6058] italic opacity-50">No promotions scheduled yet.</td>
                  </tr>
                ) : promotions.map((promo) => (
                  <tr key={promo.id} className="hover:bg-[#FBF9F4]/50 transition-colors">
                    <td className="px-6 py-5 font-headline text-lg">{promo.products?.name}</td>
                    <td className="px-6 py-5 font-headline text-lg text-[#785A1A]">{promo.discount_percent}% OFF</td>
                    <td className="px-6 py-5 text-sm">{new Date(promo.start_at).toLocaleString()}</td>
                    <td className="px-6 py-5 text-sm">{new Date(promo.end_at).toLocaleString()}</td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-bold ${
                        promo.status === 'active' ? 'bg-green-100 text-green-700' : 
                        promo.status === 'scheduled' ? 'bg-blue-100 text-blue-700' : 
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {promo.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button 
                        onClick={() => handleDelete(promo.id, promo.product_id)}
                        className="text-[#9F403D] hover:text-red-700 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Create Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#31332C]/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#FBF9F4] w-full max-w-lg rounded-3xl p-10 relative shadow-2xl border border-[#B1B3A9]/20"
            >
              <h2 className="font-headline text-3xl mb-8">New Discount Schedule</h2>
              <form onSubmit={handleCreate} className="space-y-6">
                <div className="space-y-2">
                  <label className="font-label text-[10px] uppercase tracking-widest font-black text-[#5E6058]">Select Specimen</label>
                  <select 
                    required
                    value={formData.product_id}
                    onChange={(e) => setFormData({...formData, product_id: e.target.value})}
                    className="w-full bg-white border border-[#B1B3A9]/20 rounded-xl p-4 outline-none focus:border-[#785A1A]"
                  >
                    <option value="">Choose a plant...</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (रू {p.price})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="font-label text-[10px] uppercase tracking-widest font-black text-[#5E6058]">Discount Percentage (%)</label>
                  <input 
                    type="number" 
                    required 
                    min="1" 
                    max="99"
                    value={formData.discount_percent}
                    onChange={(e) => setFormData({...formData, discount_percent: e.target.value})}
                    className="w-full bg-white border border-[#B1B3A9]/20 rounded-xl p-4 outline-none focus:border-[#785A1A]"
                    placeholder="e.g. 25"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="font-label text-[10px] uppercase tracking-widest font-black text-[#5E6058]">Start At</label>
                    <input 
                      type="datetime-local" 
                      required
                      value={formData.start_at}
                      onChange={(e) => setFormData({...formData, start_at: e.target.value})}
                      className="w-full bg-white border border-[#B1B3A9]/20 rounded-xl p-4 outline-none focus:border-[#785A1A]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label text-[10px] uppercase tracking-widest font-black text-[#5E6058]">End At</label>
                    <input 
                      type="datetime-local" 
                      required
                      value={formData.end_at}
                      onChange={(e) => setFormData({...formData, end_at: e.target.value})}
                      className="w-full bg-white border border-[#B1B3A9]/20 rounded-xl p-4 outline-none focus:border-[#785A1A]"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-8 py-4 border border-[#B1B3A9]/20 rounded-xl font-label text-[11px] tracking-widest uppercase hover:bg-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-8 py-4 bg-[#31332C] text-white rounded-xl font-label text-[11px] tracking-widest uppercase hover:bg-[#785A1A] transition-colors"
                  >
                    Save Schedule
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default PromotionsPage;
