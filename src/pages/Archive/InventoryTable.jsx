import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase';

const InventoryTable = () => {
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchHoldings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*, category(name)')
      .order('created_at', { ascending: false });
    
    if (!error) {
      setHoldings(data);
    } else {
      console.error('Error fetching holdings:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHoldings();
  }, []);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (!error) {
        setHoldings(prev => prev.filter(item => item.id !== id));
        alert('Specimen removed from archive.');
      } else {
        alert('Error deleting specimen: ' + error.message);
      }
    }
  };

  if (loading) {
    return <div className="py-24 px-12 text-center font-label text-[10px] uppercase tracking-widest text-[#5E6058]">Loading Archive Data...</div>;
  }

  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="mb-24 px-12 max-w-[1440px] mx-auto w-full"
    >
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex justify-between items-center mb-12 border-b border-[#B1B3A9]/10 pb-10"
      >
        <h2 className="font-headline text-4xl text-[#31332C] tracking-tighter">Current Holdings</h2>
        <div className="flex gap-8 items-center font-label text-[12px] uppercase tracking-widest">
           <Link to="/admin/add-plant" className="bg-[#785A1A] text-white px-6 py-2 rounded-full font-bold hover:bg-[#31332C] transition-all">Add New Specimen</Link>
        </div>
      </motion.div>

      <div className="overflow-x-auto w-full">
        {holdings.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-[#B1B3A9]/20 rounded-2xl">
             <p className="font-headline text-2xl text-[#31332C]/40 italic">No specimens in the current archive.</p>
             <p className="font-label text-[10px] uppercase tracking-widest text-[#5E6058] mt-4 opacity-60">Add your first plant to begin tracking.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
                <tr className="border-b border-[#B1B3A9]/20 font-label text-[10px] uppercase tracking-widest text-[#5E6058]/80 font-black">
                  <th className="py-6 px-4">Specimen Profile</th>
                  <th className="py-6 px-4">Slug / ID</th>
                  <th className="py-6 px-4">Category</th>
                  <th className="py-6 px-4 text-right">Valuation</th>
                  <th className="py-6 px-4 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-[#B1B3A9]/10">
              {holdings.map((item, i) => (
                <motion.tr 
                  key={item.id} 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="group hover:bg-white transition-all duration-300"
                >
                    <td className="py-8 px-4 flex items-center gap-6">
                      <div className="w-20 h-20 bg-[#EFEEE6] overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                          <img src={item.image_url || 'https://via.placeholder.com/400?text=No+Image'} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                          <p className="font-headline text-2xl text-[#31332C] group-hover:text-[#785A1A] transition-colors">{item.name}</p>
                          <p className="font-label text-[10px] tracking-widest uppercase text-[#5E6058] opacity-70">Specimen Archive Entry</p>
                      </div>
                    </td>
                    <td className="py-8 px-4 font-label text-[10px] tracking-wide uppercase text-[#31332C] font-bold">
                       {item.slug}
                    </td>
                    <td className="py-8 px-4">
                       <p className="font-body text-sm text-[#31332C] font-medium tracking-tight uppercase">{item.category?.name || 'Uncategorized'}</p>
                    </td>
                    <td className="py-8 px-4 text-right">
                       <p className="font-headline text-xl text-[#31332C]">रू {item.price}</p>
                    </td>
                    <td className="py-8 px-4">
                       <div className="flex justify-end gap-6 items-center">
                          <button 
                            onClick={() => navigate(`/admin/edit-plant/${item.id}`)}
                            className="material-symbols-outlined text-[#5E6058] hover:text-[#785A1A] transition-colors p-2 hover:bg-[#F5F4ED]"
                          >
                            edit_calendar
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id, item.name)}
                            className="material-symbols-outlined text-[#5E6058] hover:text-[#9F403D] transition-colors p-2 hover:bg-[#F5F4ED]"
                          >
                            delete
                          </button>
                       </div>
                    </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </motion.section>
  );
};

export default InventoryTable;
