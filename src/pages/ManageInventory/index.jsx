import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { supabase } from '../../supabase';

const ManageInventory = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [info, setInfo] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState(1);
  const [waterFrequency, setWaterFrequency] = useState('Every 7 Days');
  const [optimalPlace, setOptimalPlace] = useState('Bright Indirect Light');
  const [provenance, setProvenance] = useState('');
  const [curatorQuote, setCuratorQuote] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [season, setSeason] = useState('All Year');
  const [isFeatured, setIsFeatured] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode) {
      const fetchPlant = async () => {
        try {
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

          if (error) throw error;
          if (data) {
            setName(data.name || '');
            setDescription(data.description || '');
            setInfo(data.info || '');
            setPrice(data.price || '');
            setStock(data.stock || 1);
            setWaterFrequency(data.water_frequency || 'Every 7 Days');
            setOptimalPlace(data.optimal_place || 'Bright Indirect Light');
            setProvenance(data.provenance || '');
            setCuratorQuote(data.curator_quote || '');
            setImageUrl(data.images && data.images.length > 0 ? data.images[0] : '');
            setSeason(data.season || 'All Year');
            setIsFeatured(data.is_featured || false);
          }
        } catch (err) {
          setErrorMsg('Failed to load plant details.');
        }
      };
      
      fetchPlant();
    }
  }, [id, isEditMode]);

  const handleAcquire = async () => {
    if (!name || !price) {
      setErrorMsg("Name and Market Valuation are required.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const productImages = imageUrl.trim()
      ? [imageUrl.trim()]
      : ["https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&q=80"];

    try {
      let error;
      if (isEditMode) {
        const { error: updateError } = await supabase.from('products').update({
          name,
          description,
          info,
          price: parseFloat(price),
          stock: parseInt(stock, 10) || 0,
          water_frequency: waterFrequency,
          optimal_place: optimalPlace,
          provenance,
          curator_quote: curatorQuote,
          images: productImages,
          season,
          is_featured: isFeatured
        }).eq('id', id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase.from('products').insert({
          name,
          description,
          info,
          price: parseFloat(price),
          stock: parseInt(stock, 10) || 0,
          water_frequency: waterFrequency,
          optimal_place: optimalPlace,
          provenance,
          curator_quote: curatorQuote,
          images: productImages,
          season,
          is_featured: isFeatured
        });
        error = insertError;
      }

      if (error) throw error;
      
      navigate('/discovery');
    } catch (err) {
      setErrorMsg(err.message || 'Error occurred while saving product.');
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
      
      <main className="w-full max-w-[1920px] mx-auto flex-grow pt-[140px] px-6 md:px-12 pb-32">
        <div className="max-w-6xl mx-auto w-full">
           
           {/* Header Section */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
             className="flex items-center gap-4 mb-6"
           >
               <Link to="/archive" className="material-symbols-outlined text-[#31332C]/60 hover:text-[#31332C] transition-colors bg-[#EFEEE6] p-2 rounded-full cursor-pointer hover:bg-[#E2E3D9]">arrow_back</Link>
               <span className="font-label text-[11px] tracking-[0.2em] uppercase text-[#785A1A] font-bold">{isEditMode ? 'Edit Plant Listing' : 'New Plant Listing'}</span>
           </motion.div>
           
           <motion.h1 
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
             className="font-headline text-5xl md:text-6xl leading-tight text-[#31332C] tracking-tight mb-12"
           >
             {isEditMode ? 'Update Plant Details' : 'Add Plant for Sale'}
           </motion.h1>
           
           <motion.div 
             initial={{ scaleX: 0 }}
             animate={{ scaleX: 1 }}
             transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
             className="w-full h-[1px] bg-[#B1B3A9]/20 mb-14 origin-left"
           />

           {/* Interactive Layout Section */}
           <motion.div 
             initial={{ opacity: 0, y: 25 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
             className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-12"
           >
               
               {/* Left Column Data */}
               <div className="lg:col-span-8 bg-white p-10 md:p-14 border border-[#B1B3A9]/20 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-10">
                  {errorMsg && (
                     <div className="bg-red-50 text-red-500 font-body text-[12px] p-4 rounded border border-red-100">
                     {errorMsg}
                     </div>
                  )}

                  {/* Section Label: Identity */}
                  <div className="flex items-center gap-3 pb-2 border-b border-[#B1B3A9]/15">
                    <span className="material-symbols-outlined text-[#785A1A] text-[18px]">eco</span>
                    <span className="font-label text-[10px] tracking-[0.2em] uppercase text-[#785A1A] font-bold">Plant Identity</span>
                  </div>

                  <div className="flex flex-col gap-3 group">
                     <label className="font-label text-[10px] tracking-widest uppercase text-[#5E6058] font-black group-focus-within:text-[#785A1A] transition-colors">Specimen Common Name</label>
                     <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Monstera Deliciosa" className="bg-transparent border-b border-[#31332C]/20 py-2 outline-none font-headline text-2xl text-[#31332C] placeholder:text-[#31332C]/20 focus:border-[#785A1A] transition-all w-full" />
                  </div>

                  <div className="flex flex-col gap-3 group">
                     <label className="font-label text-[10px] tracking-widest uppercase text-[#5E6058] font-black group-focus-within:text-[#785A1A] transition-colors">Botanical/Scientific Name</label>
                     <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g. Araceae Monstera" className="bg-transparent border-b border-[#31332C]/20 py-2 outline-none font-body text-xl italic text-[#31332C] placeholder:text-[#31332C]/20 focus:border-[#785A1A] transition-all w-full" />
                  </div>

                  <div className="flex flex-col gap-3 group">
                     <label className="font-label text-[10px] tracking-widest uppercase text-[#5E6058] font-black group-focus-within:text-[#785A1A] transition-colors">Description / About the Plant</label>
                     <textarea value={info} onChange={e => setInfo(e.target.value)} placeholder="e.g. Known colloquially as the Swiss Cheese Plant, this architectural masterpiece..." rows="3" className="bg-transparent border-b border-[#31332C]/20 py-2 outline-none font-body text-[16px] text-[#31332C] placeholder:text-[#31332C]/20 focus:border-[#785A1A] transition-all w-full resize-none"></textarea>
                  </div>

                  <div className="flex flex-col gap-3 group">
                     <label className="font-label text-[10px] tracking-widest uppercase text-[#5E6058] font-black group-focus-within:text-[#785A1A] transition-colors">Provenance / Origin</label>
                     <input type="text" value={provenance} onChange={e => setProvenance(e.target.value)} placeholder="e.g. Western Africa, Tropical Lowland Rainforests" className="bg-transparent border-b border-[#31332C]/20 py-2 outline-none font-body text-lg text-[#31332C] placeholder:text-[#31332C]/20 focus:border-[#785A1A] transition-all w-full" />
                  </div>

                  {/* Section Label: Catalogue Display */}
                  <div className="flex items-center gap-3 pb-2 border-b border-[#B1B3A9]/15 pt-4">
                    <span className="material-symbols-outlined text-[#785A1A] text-[18px]">auto_stories</span>
                    <span className="font-label text-[10px] tracking-[0.2em] uppercase text-[#785A1A] font-bold">Catalogue Display</span>
                  </div>

                  <div className="flex flex-col gap-3 group">
                     <label className="font-label text-[10px] tracking-widest uppercase text-[#5E6058] font-black group-focus-within:text-[#785A1A] transition-colors">Curator Quote / Tagline</label>
                     <textarea value={curatorQuote} onChange={e => setCuratorQuote(e.target.value)} placeholder='e.g. "The Lyrata requires patience and an understanding of light&apos;s gentle choreography."' rows="2" className="bg-transparent border-b border-[#31332C]/20 py-2 outline-none font-body text-[16px] italic text-[#31332C] placeholder:text-[#31332C]/20 focus:border-[#785A1A] transition-all w-full resize-none"></textarea>
                  </div>

                  <div className="flex flex-col gap-3 group">
                     <label className="font-label text-[10px] tracking-widest uppercase text-[#5E6058] font-black group-focus-within:text-[#785A1A] transition-colors">Image URL</label>
                     <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://images.unsplash.com/photo-..." className="bg-transparent border-b border-[#31332C]/20 py-2 outline-none font-body text-[15px] text-[#31332C] placeholder:text-[#31332C]/20 focus:border-[#785A1A] transition-all w-full" />
                     <p className="font-body text-[11px] text-[#5E6058]/60">Paste a direct image URL. This will be the hero image on the catalogue page.</p>
                  </div>

                  {/* Section Label: Care & Pricing */}
                  <div className="flex items-center gap-3 pb-2 border-b border-[#B1B3A9]/15 pt-4">
                    <span className="material-symbols-outlined text-[#785A1A] text-[18px]">spa</span>
                    <span className="font-label text-[10px] tracking-[0.2em] uppercase text-[#785A1A] font-bold">Care & Pricing</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="flex flex-col gap-3 group">
                         <label className="font-label text-[10px] tracking-widest uppercase text-[#5E6058] font-black group-focus-within:text-[#785A1A] transition-colors">Inventory ID</label>
                         <input type="text" placeholder="SPEC-000-KTM" className="bg-[#FBF9F4] border border-[#B1B3A9]/20 p-4 outline-none font-label text-[12px] text-[#31332C] font-bold tracking-widest uppercase rounded-lg focus:border-[#785A1A] hover:border-[#B1B3A9]/50 transition-all w-full" />
                      </div>
                      <div className="flex flex-col gap-3 group">
                         <label className="font-label text-[10px] tracking-widest uppercase text-[#5E6058] font-black group-focus-within:text-[#785A1A] transition-colors">Market Valuation (रू)</label>
                         <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" className="bg-transparent border-b border-[#31332C]/20 py-4 outline-none font-headline text-xl text-[#31332C] placeholder:text-[#31332C]/20 focus:border-[#785A1A] transition-all w-full" />
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="flex flex-col gap-3 group">
                         <label className="font-label text-[10px] tracking-widest uppercase text-[#5E6058] font-black group-focus-within:text-[#785A1A] transition-colors">Optimal Placement</label>
                         <input type="text" value={optimalPlace} onChange={e => setOptimalPlace(e.target.value)} placeholder="e.g. Bright Indirect Light" className="bg-transparent border-b border-[#31332C]/20 py-4 outline-none font-headline text-xl text-[#31332C] placeholder:text-[#31332C]/20 focus:border-[#785A1A] transition-all w-full" />
                      </div>
                      <div className="flex flex-col gap-3 group">
                         <label className="font-label text-[10px] tracking-widest uppercase text-[#5E6058] font-black group-focus-within:text-[#785A1A] transition-colors">Watering Frequency</label>
                         <select value={waterFrequency} onChange={e => setWaterFrequency(e.target.value)} className="bg-transparent border-b border-[#31332C]/20 py-4 outline-none font-headline text-xl text-[#31332C] font-normal focus:border-[#785A1A] cursor-pointer">
                            <option value="Every 3 Days">Every 3 Days</option>
                            <option value="Every 7 Days">Every 7 Days</option>
                            <option value="Every 10 Days">Every 10 Days</option>
                            <option value="Every 14 Days">Every 14 Days</option>
                            <option value="When Soil is Dry">When Soil is Dry</option>
                            <option value="Misting Only">Misting Only</option>
                         </select>
                      </div>
                  </div>

                  <div className="flex flex-col gap-3 group">
                     <label className="font-label text-[10px] tracking-widest uppercase text-[#5E6058] font-black group-focus-within:text-[#785A1A] transition-colors">Stock Quantity</label>
                     <input type="number" min="0" value={stock} onChange={e => setStock(e.target.value)} placeholder="1" className="bg-transparent border-b border-[#31332C]/20 py-2 outline-none font-headline text-2xl text-[#31332C] placeholder:text-[#31332C]/20 focus:border-[#785A1A] transition-all w-full md:w-1/3" />
                  </div>
                  {/* Section Label: Display Attributes (New) */}
                  <div className="flex items-center gap-3 pb-2 border-b border-[#B1B3A9]/15 pt-4">
                    <span className="material-symbols-outlined text-[#785A1A] text-[18px]">verified</span>
                    <span className="font-label text-[10px] tracking-[0.2em] uppercase text-[#785A1A] font-bold">Display Attributes</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="flex flex-col gap-3 group">
                         <label className="font-label text-[10px] tracking-widest uppercase text-[#5E6058] font-black group-focus-within:text-[#785A1A] transition-colors">Seasonal Availability</label>
                         <select value={season} onChange={e => setSeason(e.target.value)} className="bg-transparent border-b border-[#31332C]/20 py-4 outline-none font-headline text-xl text-[#31332C] font-normal focus:border-[#785A1A] cursor-pointer">
                            <option value="All Year">All Year</option>
                            <option value="Spring/Summer">Spring & Summer</option>
                            <option value="Autumn/Winter">Autumn & Winter</option>
                            <option value="Spring Only">Spring Only</option>
                            <option value="Summer Only">Summer Only</option>
                         </select>
                      </div>
                      
                      <div className="flex flex-col gap-3 group justify-center">
                         <label className="font-label text-[10px] tracking-widest uppercase text-[#5E6058] font-black group-focus-within:text-[#785A1A] transition-colors mb-2">Featured Status</label>
                         <label className="relative inline-flex items-center cursor-pointer max-w-max">
                           <input type="checkbox" className="sr-only peer" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} />
                           <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#785A1A]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5F5E5E]"></div>
                           <span className="ml-3 font-body text-sm text-[#31332C]">{isFeatured ? 'Featured Specimen' : 'Standard Listing'}</span>
                         </label>
                         <p className="font-body text-[10px] text-[#5E6058]/60 mt-1">Featured items appear at the top of the discovery grid.</p>
                      </div>
                  </div>

               </div>

               {/* Right Column - Image Preview */}
               <motion.div 
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                 className="lg:col-span-4 space-y-8 h-full"
               >
                   <div className="flex flex-col gap-3 h-full">
                     <label className="flex items-center gap-2 font-label text-[10px] tracking-widest uppercase text-[#5E6058] font-black">
                        <span className="material-symbols-outlined text-[14px]">photo_camera</span>
                        Asset Preview
                     </label>
                     <motion.div 
                       whileHover={{ borderColor: '#785A1A', backgroundColor: 'rgba(251,249,244,0.5)' }}
                       className="flex-grow w-full border border-[#B1B3A9]/20 bg-white rounded-2xl shadow-sm flex flex-col items-center justify-center p-6 transition-all group min-h-[400px] overflow-hidden"
                     >
                        {imageUrl.trim() ? (
                          <div className="w-full h-full relative">
                            <img 
                              src={imageUrl} 
                              alt="Plant preview" 
                              className="w-full h-full object-cover rounded-lg max-h-[500px]"
                              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                            />
                            <div className="hidden w-full h-full items-center justify-center flex-col gap-4" style={{ display: 'none' }}>
                              <span className="material-symbols-outlined text-[28px] text-[#9F403D]">broken_image</span>
                              <p className="font-body text-xs text-[#9F403D] text-center">Could not load image. Check the URL.</p>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="w-16 h-16 bg-[#EFEEE6] rounded-full flex items-center justify-center shadow-inner mb-6 group-hover:scale-110 transition-transform duration-300">
                               <span className="material-symbols-outlined text-[28px] text-[#B1B3A9] group-hover:text-[#785A1A] transition-colors">image</span>
                            </div>
                            <p className="font-label text-[11px] uppercase tracking-widest text-[#5E6058] font-bold text-center mb-2">No image provided</p>
                            <p className="font-body text-xs text-[#5E6058]/60 text-center max-w-[200px]">Paste an image URL in the field on the left to preview.</p>
                          </>
                        )}
                     </motion.div>

                     {/* Quick Info Preview */}
                     {name && (
                       <motion.div 
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         className="bg-[#F5F4ED] border border-[#B1B3A9]/15 rounded-xl p-5 space-y-3"
                       >
                         <p className="font-label text-[9px] tracking-[0.2em] uppercase text-[#785A1A] font-bold">Catalogue Preview</p>
                         <h3 className="font-headline text-2xl text-[#31332C] leading-tight">{name}</h3>
                         {description && <p className="font-body text-sm italic text-[#5E6058]">{description}</p>}
                         {provenance && (
                           <div className="pt-2 border-t border-[#B1B3A9]/15">
                             <p className="font-label text-[9px] tracking-[0.1em] uppercase opacity-50 font-black">Provenance</p>
                             <p className="font-body text-xs text-[#31332C]">{provenance}</p>
                           </div>
                         )}
                         {price && (
                           <p className="font-headline text-xl text-[#31332C]">रू {Number(price).toLocaleString()}</p>
                         )}
                       </motion.div>
                     )}
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
           
           {/* Action Handlers */}
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
                whileHover={{ y: -2, boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }}
                whileTap={{ scale: 0.97 }}
                onClick={handleAcquire}
                disabled={isSubmitting}
                className="bg-[#5F5E5E] text-[#FAF7F6] px-10 py-4 font-label text-[12px] tracking-[1.5px] font-black uppercase flex items-center gap-3 hover:bg-[#31332C] rounded-lg transition-all shadow-xl shadow-black/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                 {isSubmitting ? (isEditMode ? 'Updating...' : 'Acquiring...') : (isEditMode ? 'Update Details' : 'Commence Acquisition')}
                 <div className="w-[1px] h-4 bg-white/20"></div>
                 <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </motion.button>
           </motion.div>

        </div>
      </main>

      <Footer />
    </motion.div>
  );
};

export default ManageInventory;
