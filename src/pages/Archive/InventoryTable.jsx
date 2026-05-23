/**
 * CHLORO — Admin Inventory CRUD Component
 */
import React, { useMemo, useEffect, useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabase';
import { getProductImage } from '../../lib/localImages';

const normalizeText = (value) => String(value || '').toLowerCase();

const hasAny = (value, needles) => {
  const text = normalizeText(value);
  return needles.some((needle) => text.includes(needle));
};

const hasTag = (item, needles) => (
  Array.isArray(item.tags)
  && item.tags.some((tag) => hasAny(tag, needles))
);

const isCareTool = (item) => (
  hasAny(item.category, ['care tools', 'plant care', 'gardening tools', 'equipment'])
  || hasAny(item.description, ['tool', 'care spray', 'meter'])
  || hasTag(item, ['tool', 'plant-care', 'ai-diagnosis', 'pest-care', 'root-care'])
);

const isPlanter = (item) => hasAny(item.category, ['pot', 'planter', 'ceramic', 'vessel']);
const isFlower = (item) => hasAny(item.category, ['flower', 'fresh cut']);
const isPlant = (item) => !isCareTool(item) && !isPlanter(item) && !isFlower(item);

const filterProducts = (products, filterId) => {
  if (filterId === 'plants') return products.filter(isPlant);
  if (filterId === 'care-tools') return products.filter(isCareTool);
  if (filterId === 'planters') return products.filter(isPlanter);
  if (filterId === 'flowers') return products.filter(isFlower);
  return products;
};

const searchableProductText = (item) => [
  item.id,
  item.name,
  item.category,
  item.description,
  item.info,
  item.provenance,
  item.season,
  item.is_gift ? 'gift gift-page gift item' : '',
  item.is_active ? 'active' : 'inactive',
  item.stock,
  item.price,
  ...(Array.isArray(item.tags) ? item.tags : []),
].join(' ').toLowerCase();

const InventoryTable = ({ products, loading, onRefresh }) => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    setInventoryItems(products);
  }, [products]);

  useEffect(() => {
    const searchTimer = window.setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim().toLowerCase());
    }, 120);

    return () => window.clearTimeout(searchTimer);
  }, [searchQuery]);

  const categoryFilteredInventory = useMemo(() => (
    filterProducts(inventoryItems, activeFilter)
  ), [activeFilter, inventoryItems]);

  const filteredInventory = useMemo(() => {
    if (!debouncedSearchQuery) return categoryFilteredInventory;
    const terms = debouncedSearchQuery.split(/\s+/).filter(Boolean);
    return categoryFilteredInventory.filter((item) => {
      const target = searchableProductText(item);
      return terms.every((term) => target.includes(term));
    });
  }, [categoryFilteredInventory, debouncedSearchQuery]);

  const filters = useMemo(() => [
    { id: 'all', label: 'All Inventory', count: inventoryItems.length },
    { id: 'plants', label: 'Plants', count: filterProducts(inventoryItems, 'plants').length },
    { id: 'care-tools', label: 'Care Tools', count: filterProducts(inventoryItems, 'care-tools').length },
    { id: 'planters', label: 'Pots & Planters', count: filterProducts(inventoryItems, 'planters').length },
    { id: 'flowers', label: 'Flowers', count: filterProducts(inventoryItems, 'flowers').length },
  ], [inventoryItems]);

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
    <Motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="mb-24 page-shell w-full relative"
    >
      {/* Custom Delete Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#31332C]/40 backdrop-blur-sm"
            />
            <Motion.div
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
            </Motion.div>
          </div>
        )}
      </AnimatePresence>

      <Motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex flex-col gap-8 mb-8 border-b border-[#B1B3A9]/10 pb-8 xl:flex-row xl:items-end xl:justify-between"
      >
        <div>
          <h2 className="font-headline text-4xl text-[#31332C] tracking-tighter">Current Inventory</h2>
          <p className="mt-2 font-label text-[10px] font-bold uppercase tracking-[0.18em] text-[#5E6058]/70">
            {loading ? 'Syncing records' : `${filteredInventory.length} of ${categoryFilteredInventory.length} shown`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center font-label text-[10px] uppercase tracking-[0.14em]">
          {filters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 font-bold transition-colors ${
                activeFilter === filter.id
                  ? 'bg-[#31332C] text-white'
                  : 'bg-white text-[#5E6058] hover:bg-[#F5F4ED] hover:text-[#31332C]'
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
      </Motion.div>

      <div className="mb-8 grid gap-3 border border-[#B1B3A9]/20 bg-white p-4 shadow-sm shadow-black/5 md:grid-cols-[1fr_auto] md:items-center">
        <label className="flex min-h-[52px] items-center gap-3 border border-[#B1B3A9]/20 bg-[#FBF9F4] px-4 transition-colors focus-within:border-[#31332C]/45">
          <span className="material-symbols-outlined text-[20px] text-[#5E6058]/70">search</span>
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search name, category, tag, ID, stock, price, or status"
            className="min-w-0 flex-1 bg-transparent font-body text-sm text-[#31332C] outline-none placeholder:text-[#5E6058]/55"
          />
        </label>
        {searchQuery ? (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="min-h-[52px] px-5 font-label text-[10px] font-bold uppercase tracking-[0.18em] text-[#5E6058] transition-colors hover:bg-[#F5F4ED] hover:text-[#31332C]"
          >
            Clear Search
          </button>
        ) : (
          <p className="px-1 font-label text-[10px] font-bold uppercase tracking-[0.18em] text-[#5E6058]/60 md:px-4">
            Auto updates
          </p>
        )}
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#B1B3A9]/20 font-label text-[10px] uppercase tracking-widest text-[#5E6058]/80 font-black">
              <th className="py-6 px-4">Product</th>
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
            ) : inventoryItems.length === 0 ? (
              // State 2: Database returned no records
              <tr>
                <td colSpan="6" className="py-12 text-center font-label text-[11px] uppercase tracking-widest text-[#5E6058]">
                  Database empty. Add plants or care tools to begin.
                </td>
              </tr>
            ) : filteredInventory.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-12 text-center font-label text-[11px] uppercase tracking-widest text-[#5E6058]">
                  {debouncedSearchQuery ? 'No inventory matches this search.' : 'No inventory found in this category.'}
                </td>
              </tr>
            ) : (
              // State 3: Dynamically render each product from the database
              <AnimatePresence>
                {filteredInventory.map((item, i) => (
                  <Motion.tr
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    className="group hover:bg-white transition-all duration-300"
                  >
                    <td className="py-8 px-4 flex items-center gap-6">
                      <div className="w-20 h-20 bg-[#EFEEE6] overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                        <img src={getProductImage(item)} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-headline text-2xl text-[#31332C] group-hover:text-[#785A1A] transition-colors">{item.name}</p>
                        <p className="font-label text-[10px] tracking-widest uppercase text-[#5E6058] opacity-70 truncate max-w-[240px]">
                          {item.category || item.description || "Indoor Selection"}
                        </p>
                        {item.description && (
                          <p className="mt-1 font-body text-xs text-[#5E6058]/70 truncate max-w-[240px]">
                            {item.description}
                          </p>
                        )}
                        {item.is_gift && (
                          <span className="mt-2 inline-flex bg-[#E8E9E0] px-2 py-1 font-label text-[8px] font-bold uppercase tracking-[0.14em] text-[#0F3A3A]">
                            Gift Page
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-8 px-4">
                      <span className="bg-[#E8E9E0] px-4 py-2 font-label text-[8px] tracking-wide uppercase text-[#31332C] font-bold border border-[#797c73]/5 truncate w-24 inline-block">
                        {item.id.split('-')[0]}
                      </span>
                    </td>
                    {/* Product status indicator: green = active, red = inactive */}
                    <td className="py-8 px-4">
                      <div className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full ${item.is_active ? 'bg-[#456565]' : 'bg-[#9F403D]'}`}></span>
                        <p className="font-body text-sm text-[#31332C] font-medium tracking-tight uppercase">{item.is_active ? 'Active' : 'Inactive'}</p>
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
                  </Motion.tr>
                ))}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>
    </Motion.section>
  );
};

export default InventoryTable;
