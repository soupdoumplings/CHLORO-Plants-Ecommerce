import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { supabase } from '../../supabase';

const ManageInventory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    scientific_name: '', // We'll store this in description or add a column if needed, but for now we'll stick to the user's provided SQL schema.
    slug: '',
    description: '',
    price: '',
    stock: 0,
    image_url: '',
    category_id: ''
  });

  // Additional fields from the UI that aren't in the provided SQL:
  // Botanical Name -> Will append to description for now or just skip if not in schema.
  // Health, Maturity -> Will store in metadata or similar if we could, but I'll stick to the core schema.

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchCategories = async () => {
    const { data, error } = await supabase.from('category').select('*').order('name');
    if (!error) setCategories(data);
  };

  const fetchProduct = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (data && !error) {
      setFormData({
        name: data.name,
        slug: data.slug,
        description: data.description || '',
        price: data.price,
        stock: data.stock || 0,
        image_url: data.image_url || '',
        category_id: data.category_id || ''
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const slugVal = formData.slug || formData.name.toLowerCase().trim().replace(/\s+/g, '-');
      
      // 1. Check if slug exists (only for new entries or if changed on edit)
      const { data: existing, error: checkError } = await supabase
        .from('products')
        .select('id')
        .eq('slug', slugVal)
        .maybeSingle();

      if (checkError) throw checkError;
      
      // If found and it's not the same product we're editing
      if (existing && existing.id !== id) {
        alert(`The slug "${slugVal}" is already being used by another specimen. Please choose a different Slug / URL ID.`);
        setIsSubmitting(false);
        return;
      }

      const payload = {
        name: formData.name,
        slug: slugVal,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        image_url: formData.image_url,
        category_id: formData.category_id || null
      };

      let result;
      if (id) {
        // Update
        result = await supabase
          .from('products')
          .update(payload)
          .eq('id', id);
      } else {
        // Create
        result = await supabase
          .from('products')
          .insert([payload]);
      }

      if (result.error) throw result.error;

      alert(id ? 'Plant updated successfully!' : 'Plant added successfully!');
      navigate('/archive');
    } catch (error) {
      console.error('Error saving plant:', error);
      const msg = error.message.includes('unique constraint') 
        ? 'A plant with this name or slug already exists. Please choose a unique name/ID.' 
        : error.message;
      alert('Error saving plant: ' + msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-[#FBF9F4] flex flex-col items-center overflow-x-hidden w-full relative"
    >
      <Navbar />
      
      <form onSubmit={handleSubmit} className="w-full max-w-[1920px] mx-auto flex-grow pt-[140px] px-6 md:px-12 pb-32">
        <div className="max-w-6xl mx-auto w-full">
           
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
             className="flex items-center gap-4 mb-6"
           >
               <Link to="/archive" className="material-symbols-outlined text-[#31332C]/60 hover:text-[#31332C] transition-colors bg-[#EFEEE6] p-2 rounded-full cursor-pointer hover:bg-[#E2E3D9]">arrow_back</Link>
               <span className="font-label text-[11px] tracking-[0.2em] uppercase text-[#785A1A] font-bold">
                 {id ? 'Edit Plant Listing' : 'New Plant Listing'}
               </span>
           </motion.div>
           
           <motion.h1 
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
             className="font-headline text-5xl md:text-6xl leading-tight text-[#31332C] tracking-tight mb-12"
           >
             {id ? 'Modify Specimen' : 'Add Plant for Sale'}
           </motion.h1>
           
           <motion.div 
             initial={{ scaleX: 0 }}
             animate={{ scaleX: 1 }}
             transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
             className="w-full h-[1px] bg-[#B1B3A9]/20 mb-14 origin-left"
           />

           <motion.div 
             initial={{ opacity: 0, y: 25 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
             className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-12"
           >
               <div className="lg:col-span-8 bg-white p-10 md:p-14 border border-[#B1B3A9]/20 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-10">
                  <div className="flex flex-col gap-3 group">
                     <label className="font-label text-[10px] tracking-widest uppercase text-[#5E6058] font-black group-focus-within:text-[#785A1A] transition-colors">Specimen Common Name</label>
                     <input 
                       required
                       name="name"
                       value={formData.name}
                       onChange={handleChange}
                       type="text" 
                       placeholder="e.g. Monstera Deliciosa" 
                       className="bg-transparent border-b border-[#31332C]/20 py-2 outline-none font-headline text-2xl text-[#31332C] placeholder:text-[#31332C]/20 focus:border-[#785A1A] transition-all w-full" 
                     />
                  </div>

                  <div className="flex flex-col gap-3 group">
                     <label className="font-label text-[10px] tracking-widest uppercase text-[#5E6058] font-black group-focus-within:text-[#785A1A] transition-colors">Slug / URL ID</label>
                     <input 
                       required
                       name="slug"
                       value={formData.slug}
                       onChange={handleChange}
                       type="text" 
                       placeholder="e.g. monstera-deliciosa" 
                       className="bg-transparent border-b border-[#31332C]/20 py-2 outline-none font-body text-xl italic text-[#31332C] placeholder:text-[#31332C]/20 focus:border-[#785A1A] transition-all w-full" 
                     />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="flex flex-col gap-3 group">
                         <label className="font-label text-[10px] tracking-widest uppercase text-[#5E6058] font-black group-focus-within:text-[#785A1A] transition-colors">Current Stock</label>
                         <input 
                           name="stock"
                           value={formData.stock}
                           onChange={handleChange}
                           type="number" 
                           placeholder="0" 
                           className="bg-[#FBF9F4] border border-[#B1B3A9]/20 p-4 outline-none font-label text-[12px] text-[#31332C] font-bold tracking-widest uppercase rounded-lg focus:border-[#785A1A] hover:border-[#B1B3A9]/50 transition-all w-full" 
                         />
                      </div>
                      <div className="flex flex-col gap-3 group">
                         <label className="font-label text-[10px] tracking-widest uppercase text-[#5E6058] font-black group-focus-within:text-[#785A1A] transition-colors">Market Valuation (रू)</label>
                         <input 
                           required
                           name="price"
                           value={formData.price}
                           onChange={handleChange}
                           type="number" 
                           step="0.01"
                           placeholder="0.00" 
                           className="bg-transparent border-b border-[#31332C]/20 py-4 outline-none font-headline text-xl text-[#31332C] placeholder:text-[#31332C]/20 focus:border-[#785A1A] transition-all w-full" 
                         />
                      </div>
                  </div>

                  <div className="flex flex-col gap-3 group">
                      <label className="font-label text-[10px] tracking-widest uppercase text-[#5E6058] font-black group-focus-within:text-[#785A1A] transition-colors">Category</label>
                      <select 
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleChange}
                        className="bg-transparent border-b border-[#31332C]/20 py-3 outline-none font-body text-sm uppercase tracking-wide text-[#31332C] font-bold focus:border-[#785A1A] cursor-pointer"
                      >
                         <option value="">Select a category</option>
                         {categories.map(cat => (
                           <option key={cat.id} value={cat.id}>{cat.name}</option>
                         ))}
                      </select>
                  </div>

                  <div className="flex flex-col gap-3 group">
                      <label className="font-label text-[10px] tracking-widest uppercase text-[#5E6058] font-black group-focus-within:text-[#785A1A] transition-colors">Botanical Description</label>
                      <textarea 
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Provide details about this specimen..."
                        className="bg-transparent border border-[#31332C]/20 p-4 outline-none font-body text-md text-[#31332C] placeholder:text-[#31332C]/20 focus:border-[#785A1A] transition-all w-full min-h-[150px] rounded-lg"
                      />
                  </div>
               </div>

               <motion.div 
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                 className="lg:col-span-4 space-y-8 h-full"
               >
                   <div className="flex flex-col gap-3 h-full">
                     <div className="flex-grow w-full border border-[#B1B3A9]/20 bg-white rounded-2xl shadow-sm flex flex-col items-center justify-center p-12 min-h-[400px]">
                        <div className="w-16 h-16 bg-[#EFEEE6] rounded-full flex items-center justify-center shadow-inner mb-6">
                           <span className="material-symbols-outlined text-[28px] text-[#B1B3A9]">upload</span>
                        </div>
                        <p className="font-label text-[11px] uppercase tracking-widest text-[#5E6058] font-bold text-center mb-2">Asset Photography</p>
                        <p className="font-body text-xs text-[#5E6058]/60 text-center max-w-[200px]">Asset linking is handled via metadata in this version.</p>
                     </div>
                   </div>
               </motion.div>
           </motion.div>
           
           <motion.div 
             initial={{ scaleX: 0 }}
             whileInView={{ scaleX: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
             className="w-full h-[1px] bg-[#B1B3A9]/20 mt-16 mb-8 origin-left"
           />
           
           <motion.div 
             initial={{ opacity: 0, y: 15 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
             className="flex justify-between items-center bg-white rounded-2xl p-6 md:px-10 py-6 border border-[#B1B3A9]/20 shadow-sm"
           >
              <Link to="/archive" className="font-label text-[11px] font-bold tracking-[0.2em] uppercase text-[#9F403D] hover:text-[#31332C] transition-colors flex items-center gap-2">
                 <span className="material-symbols-outlined text-[16px]">close</span>
                 Abort Procedure
              </Link>
              <motion.button 
                type="submit"
                disabled={isSubmitting}
                whileHover={{ y: -2, boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }}
                whileTap={{ scale: 0.97 }}
                className="bg-[#5F5E5E] text-[#FAF7F6] px-10 py-4 font-label text-[12px] tracking-[1.5px] font-black uppercase flex items-center gap-3 hover:bg-[#31332C] rounded-lg transition-all shadow-xl shadow-black/10 disabled:opacity-50"
              >
                 {isSubmitting ? 'Processing...' : (id ? 'Confirm Modification' : 'Commence Acquisition')}
                 <div className="w-[1px] h-4 bg-white/20"></div>
                 <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </motion.button>
           </motion.div>

        </div>
      </form>

      <Footer />
    </motion.div>
  );
};

export default ManageInventory;
\ / /   c h e c k   s l u g   a v a i l a b i l i t y \  
 