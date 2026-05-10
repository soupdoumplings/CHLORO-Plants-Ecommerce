import React, { useEffect, useMemo, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { Gift, Heart, Leaf, Loader2, Search, ShoppingBag, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useCart } from '../../lib/CartContext';
import { useWishlist } from '../../lib/WishlistContext';
import { supabase } from '../../supabase';
import heroImage from '../../assets/discovery-hero.png';

const fallbackImage = 'https://images.pexels.com/photos/7627358/pexels-photo-7627358.jpeg';

const filters = ['All', 'Plants', 'Care', 'Gifts'];
const sorts = ['Latest', 'Price: Low', 'Price: High'];

const formatPrice = (price) => `NPR ${Number(price || 0).toLocaleString('en-NP', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})}`;

const textIncludes = (product, terms) => {
  const text = [
    product.name,
    product.category,
    product.description,
    product.info,
    ...(product.tags || []),
  ].join(' ').toLowerCase();

  return terms.some((term) => text.includes(term));
};

const getProductType = (product) => {
  if (textIncludes(product, ['gift', 'bundle', 'vessel', 'ceramic', 'terrarium', 'bouquet', 'fresh cut', 'protea'])) {
    return 'Gifts';
  }

  if (textIncludes(product, ['tool', 'care', 'soil', 'fertilizer', 'feed', 'secateur', 'scissor', 'watering', 'spray', 'mist'])) {
    return 'Care';
  }

  return 'Plants';
};

const normalizeProduct = (product) => {
  const rawPrice = Number(product.price || 0);

  return {
    ...product,
    rawPrice,
    displayPrice: formatPrice(rawPrice),
    image: product.images?.[0] || product.image || fallbackImage,
    category: product.category || 'Indoor Plants',
    tags: Array.isArray(product.tags) ? product.tags : [],
    type: getProductType(product),
  };
};

const ProductTile = ({ product, index }) => {
  const { addToBag } = useCart();
  const wishlist = useWishlist();
  const [added, setAdded] = useState(false);
  const saved = wishlist.isWishlisted(product.id);

  const handleAdd = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const result = await addToBag({
      ...product,
      price: product.rawPrice,
      rawPrice: product.rawPrice,
    });

    if (result?.success) {
      setAdded(true);
      window.setTimeout(() => setAdded(false), 1500);
    } else if (result?.error) {
      window.alert(result.error);
    }
  };

  const handleWishlist = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    await wishlist.toggleWishlist(product);
  };

  return (
    <Motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link to={`/catalogue/${product.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#E8E9E0]">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
          <div className="absolute left-4 top-4 flex gap-2">
            <span className="bg-[#0F3A3A] px-3 py-1.5 font-label text-[8px] font-bold uppercase tracking-[0.14em] text-[#FBF9F4]">
              {product.type}
            </span>
          </div>
          <button
            type="button"
            onClick={handleWishlist}
            className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center border transition-colors ${
              saved ? 'border-[#0F3A3A] bg-[#0F3A3A] text-white' : 'border-white/75 bg-white/90 text-[#0F3A3A] hover:bg-white'
            }`}
            title={saved ? 'Saved' : 'Save product'}
          >
            <Heart className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
          </button>
          <div className="absolute bottom-4 left-4 right-4 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={handleAdd}
              className="flex w-full items-center justify-center gap-2 bg-[#FBF9F4] px-4 py-3 text-[#0F3A3A] shadow-lg transition-colors hover:bg-[#C6E9E9]"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="font-label text-[9px] font-bold uppercase tracking-[0.18em]">{added ? 'Added' : 'Add to Bag'}</span>
            </button>
          </div>
        </div>
        <div className="mt-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="font-headline text-[25px] leading-tight text-[#1D241F] transition-colors group-hover:text-[#785A1A]">{product.name}</h2>
            <p className="mt-2 font-label text-[9px] font-bold uppercase tracking-[0.18em] text-[#797C73]">{product.category}</p>
          </div>
          <p className="shrink-0 font-headline text-[18px] text-[#1D241F]">{product.displayPrice}</p>
        </div>
      </Link>
    </Motion.article>
  );
};

const ProductCataloguePage = () => {
  const [products, setProducts] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeSort, setActiveSort] = useState('Latest');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');

      try {
        const { data, error: fetchError } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        setProducts((data || []).map(normalizeProduct));
      } catch (err) {
        setError(err.message || 'Could not load products.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const search = query.trim().toLowerCase();

    const items = products
      .filter((product) => activeFilter === 'All' || product.type === activeFilter)
      .filter((product) => {
        if (!search) return true;
        return [
          product.name,
          product.category,
          product.description,
          product.info,
          ...(product.tags || []),
        ].join(' ').toLowerCase().includes(search);
      });

    if (activeSort === 'Price: Low') {
      items.sort((a, b) => a.rawPrice - b.rawPrice);
    } else if (activeSort === 'Price: High') {
      items.sort((a, b) => b.rawPrice - a.rawPrice);
    }

    return items;
  }, [activeFilter, activeSort, products, query]);

  const counts = useMemo(() => (
    filters.reduce((acc, filter) => {
      acc[filter] = filter === 'All'
        ? products.length
        : products.filter((product) => product.type === filter).length;
      return acc;
    }, {})
  ), [products]);

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-[#FBF9F4] flex flex-col"
    >
      <Navbar />

      <main className="flex-grow">
        <section className="relative min-h-[560px] overflow-hidden pt-[130px]">
          <img src={heroImage} alt="Products and gifts" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[#071F1F]/55" />
          <div className="relative z-10 page-shell page-gutter pb-16 text-[#FBF9F4]">
            <Motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="font-label text-[10px] font-bold uppercase tracking-[0.28em] text-[#C6E9E9]"
            >
              Kathmandu Botanical Shop
            </Motion.p>
            <Motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 max-w-4xl font-headline text-[58px] leading-[0.88] tracking-tight md:text-[92px]"
            >
              Products & Gifts
            </Motion.h1>
            <Motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
              className="mt-7 max-w-[560px] font-body text-[16px] leading-relaxed text-[#FBF9F4]/78"
            >
              Plants, vessels, care tools, and gift-ready pieces selected for Nepal homes, balconies, monsoon care, and everyday indoor rituals.
            </Motion.p>
          </div>
        </section>

        <section className="page-shell page-gutter py-10">
          <div className="grid grid-cols-1 gap-4 border-b border-[#D9DBCF] pb-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="font-label text-[9px] font-bold uppercase tracking-[0.22em] text-[#797C73]">Catalogue</p>
              <h2 className="mt-2 font-headline text-[38px] leading-tight text-[#1D241F]">
                {loading ? 'Syncing inventory' : `${filteredProducts.length} available item${filteredProducts.length === 1 ? '' : 's'}`}
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(220px,340px)_auto]">
              <label className="flex items-center gap-3 border border-[#D9DBCF] bg-white px-4 py-3">
                <Search className="h-4 w-4 text-[#797C73]" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search products or gifts"
                  className="min-w-0 flex-1 bg-transparent font-body text-sm text-[#31332C] outline-none placeholder:text-[#797C73]/70"
                />
              </label>
              <div className="flex items-center gap-2 border border-[#D9DBCF] bg-white px-3 py-2">
                <SlidersHorizontal className="h-4 w-4 text-[#797C73]" />
                <select
                  value={activeSort}
                  onChange={(event) => setActiveSort(event.target.value)}
                  className="bg-transparent font-label text-[10px] font-bold uppercase tracking-[0.14em] text-[#31332C] outline-none"
                >
                  {sorts.map((sort) => (
                    <option key={sort} value={sort}>{sort}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2.5 transition-colors ${
                  activeFilter === filter
                    ? 'border-[#0F3A3A] bg-[#0F3A3A] text-[#FBF9F4]'
                    : 'border-[#D9DBCF] bg-white text-[#31332C] hover:border-[#0F3A3A]/40'
                }`}
              >
                {filter === 'Gifts' ? <Gift className="h-3.5 w-3.5" /> : <Leaf className="h-3.5 w-3.5" />}
                <span className="font-label text-[9px] font-bold uppercase tracking-[0.16em]">{filter}</span>
                <span className="font-body text-xs opacity-70">{counts[filter] || 0}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="page-shell page-gutter pb-24">
          {loading ? (
            <div className="flex min-h-[320px] items-center justify-center border border-[#D9DBCF] bg-[#F5F4ED]">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-[#0F3A3A]" />
                <p className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-[#797C73]">Loading products</p>
              </div>
            </div>
          ) : error ? (
            <div className="border border-[#9F403D]/25 bg-[#9F403D]/8 p-8">
              <p className="font-headline text-3xl text-[#752121]">Catalogue unavailable</p>
              <p className="mt-3 font-body text-sm leading-relaxed text-[#752121]/80">{error}</p>
            </div>
          ) : filteredProducts.length ? (
            <div className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
              {filteredProducts.map((product, index) => (
                <ProductTile key={product.id} product={product} index={index} />
              ))}
            </div>
          ) : (
            <div className="grid min-h-[360px] place-items-center border border-[#D9DBCF] bg-[#F5F4ED] p-8 text-center">
              <div className="max-w-lg">
                <Gift className="mx-auto h-10 w-10 text-[#0F3A3A]" />
                <h2 className="mt-6 font-headline text-[42px] leading-none text-[#1D241F]">No catalogue items yet</h2>
                <p className="mt-4 font-body text-sm leading-relaxed text-[#5E6058]">
                  Add products, gifts, care tools, or plant listings from the admin inventory. This page and the Gemini diagnosis assistant will use that same product table.
                </p>
                <Link
                  to="/admin/add-plant"
                  className="mt-7 inline-flex bg-[#0F3A3A] px-6 py-3.5 font-label text-[9px] font-bold uppercase tracking-[0.18em] text-[#FBF9F4] transition-colors hover:bg-[#1D241F]"
                >
                  Add Inventory
                </Link>
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </Motion.div>
  );
};

export default ProductCataloguePage;
