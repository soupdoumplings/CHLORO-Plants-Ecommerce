/**
 * CHLORO — Admin Inventory CRUD Component
 */
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabase';

const InventoryTable = ({ products, loading, onRefresh }) => {
  const [holdings, setHoldings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    setHoldings(products);
  }, [products]);

  const confirmDelete = (id) => {
    setItemToDelete(id);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', itemToDelete);
      if (error) throw error;
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Error deleting product:", err.message);
      alert("Failed to delete product.");
    } finally {
      setIsModalOpen(false);
      setItemToDelete(null);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="mb-24 px-12 max-w-[1440px] mx-auto w-full relative"
    >
      {/* Custom Delete Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
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
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative bg-[#FBF9F4] p-12 md:p-16 rounded-3xl shadow-[0_32px_64px_-16px_rgba(49,51,44,0.15)] max-w-lg w-full border border-[#B1B3A9]/30"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-8 shadow-sm border border-[#B1B3A9]/10">
                  <span className="material-symbols-outlined text-3xl text-[#9F403D]">warning</span>
                </div>
                <h3 className="font-headline text-4xl text-[#31332C] mb-4 tracking-tight">Confirm Deletion?</h3>
                <p className="font-body text-[#5E6058] mb-12 leading-relaxed text-lg">
                  Are you sure you want to permanently delete this? This action cannot be undone.
                </p>
                <div className="flex flex-col sm:flex-row gap-5 w-full">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-8 py-4 font-label text-[11px] tracking-[0.2em] uppercase font-bold text-[#5E6058] hover:text-[#31332C] transition-all bg-white border border-[#B1B3A9]/20 hover:border-[#31332C]/30 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 px-8 py-4 font-label text-[11px] tracking-[0.2em] uppercase font-bold text-white bg-[#9F403D] hover:bg-[#823532] transition-all rounded-xl shadow-xl shadow-[#9F403D]/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex justify-between items-center mb-12 border-b border-[#B1B3A9]/10 pb-10"
      >
        <h2 className="font-headline text-4xl text-[#31332C] tracking-tighter">Current Holdings</h2>
        <div className="flex gap-8 items-center font-label text-[12px] uppercase tracking-widest">
          <button className="text-[#785A1A] border-b border-[#785A1A] pb-1 font-bold">All Species</button>
          <button className="text-[#5E6058] opacity-50 hover:opacity-100 transition-all pb-1 border-b border-transparent">High Altitude</button>
          <button className="text-[#5E6058] opacity-50 hover:opacity-100 transition-all pb-1 border-b border-transparent">Lowland</button>
          <button className="text-[#5E6058] opacity-50 hover:opacity-100 transition-all pb-1 border-b border-transparent">Equipment</button>
        </div>
      </motion.div>

      <div className="overflow-x-auto w-full">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#B1B3A9]/20 font-label text-[10px] uppercase tracking-widest text-[#5E6058]/80 font-black">
              <th className="py-6 px-4">Specimen Profile</th>
              <th className="py-6 px-4">Inventory ID</th>
              <th className="py-6 px-4">Status</th>
              <th className="py-6 px-4">Stock</th>
              <th className="py-6 px-4 text-right">Valuation</th>
              <th className="py-6 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#B1B3A9]/10">
            {/* Three-state conditional rendering: Loading / Empty / Data */}
            {loading ? (
              // State 1: Data is being fetched from PostgreSQL
              <tr>
                <td colSpan="6" className="py-12 text-center font-label text-[11px] uppercase tracking-widest text-[#5E6058]">
                  Syncing Inventory...
                </td>
              </tr>
            ) : holdings.length === 0 ? (
              // State 2: Database returned no records
              <tr>
                <td colSpan="6" className="py-12 text-center font-label text-[11px] uppercase tracking-widest text-[#5E6058]">
                  Database empty. Add plants to begin.
                </td>
              </tr>
            ) : (
              // State 3: Dynamically render each specimen from the database
              <AnimatePresence>
                {holdings.map((item, i) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    className="group hover:bg-white transition-all duration-300"
                  >
                    <td className="py-8 px-4 flex items-center gap-6">
                      <div className="w-20 h-20 bg-[#EFEEE6] overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                        <img src={item.images?.[0] || "https://images.unsplash.com/photo-1616046229478-9901c5536a45"} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-headline text-2xl text-[#31332C] group-hover:text-[#785A1A] transition-colors">{item.name}</p>
                        <p className="font-label text-[10px] tracking-widest uppercase text-[#5E6058] opacity-70 truncate max-w-[200px]">{item.description || "Indoor Selection"}</p>
                      </div>
                    </td>
                    <td className="py-8 px-4">
                      <span className="bg-[#E8E9E0] px-4 py-2 font-label text-[8px] tracking-wide uppercase text-[#31332C] font-bold border border-[#797c73]/5 truncate w-24 inline-block">
                        {item.id.split('-')[0]}
                      </span>
                    </td>
                    {/* Conditional health status indicator: green = active, red = archived */}
                    <td className="py-8 px-4">
                      <div className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full ${item.is_active ? 'bg-[#456565]' : 'bg-[#9F403D]'}`}></span>
                        <p className="font-body text-sm text-[#31332C] font-medium tracking-tight uppercase">{item.is_active ? 'Active' : 'Archived'}</p>
                      </div>
                    </td>
                    {/* Stock count display */}
                    <td className="py-8 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-headline text-xl text-[#31332C]">{item.stock}</span>
                        <span className="font-label text-[9px] uppercase tracking-widest text-[#5E6058] font-bold">Units</span>
                      </div>
                    </td>
                    {/* Price valuation in Nepali Rupees */}
                    <td className="py-8 px-4 text-right">
                      <p className="font-headline text-xl text-[#31332C]">रू {parseFloat(item.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                    </td>
                    {/* CRUD Actions: Edit (UPDATE) and Delete (DELETE) */}
                    <td className="py-8 px-4">
                      <div className="flex justify-end gap-6 items-center">
                        <Link to={`/admin/edit-plant/${item.id}`} className="material-symbols-outlined text-[#5E6058] hover:text-[#785A1A] transition-colors p-2 hover:bg-[#F5F4ED]">edit_calendar</Link>
                        <button onClick={() => confirmDelete(item.id)} className="material-symbols-outlined text-[#5E6058] hover:text-[#9F403D] transition-colors p-2 hover:bg-[#F5F4ED]">delete</button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>
    </motion.section>
  );
};

export default InventoryTable;
