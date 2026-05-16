import React, { useEffect, useMemo, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { ArrowRight, Droplets, Gift, Heart, Leaf, Loader2, Search, ShoppingBag, SlidersHorizontal } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useCart } from '../../lib/CartContext';
import { useWishlist } from '../../lib/WishlistContext';
import { supabase } from '../../supabase';
import { fallbackCatalogImage, productAssetImages } from '../../lib/localImages';
import { formatRupees, getEffectivePrice, hasActiveSale } from '../../lib/pricing';
import { getProductType, productMatchesType, productTypeLabels } from '../../lib/productTypes';

const filterOptions = [
  {
    id: productTypeLabels.all,
    label: 'All',
    icon: Leaf,
    copy: 'Plants, care tools, vessels, and ready-to-send gifts.',
  },
  {
    id: productTypeLabels.plants,
    label: 'Plants',
    icon: Leaf,
    copy: 'Easy-care greens, statement leaves, and thoughtful plant gifts.',
  },
  {
    id: productTypeLabels.care,
    label: 'Care Tools',
    icon: Droplets,
    copy: 'Watering, pruning, misting, and recovery support for real routines.',
  },
  {
    id: productTypeLabels.gifts,
    label: 'Gifts',
    icon: Gift,
    copy: 'Gift-ready plants, vessels, terrariums, and small home pieces.',
  },
];

const sortOptions = ['Latest', 'Price: Low', 'Price: High'];

const normalizeProduct = (product) => {
  const isOnSale = hasActiveSale(product);
  const rawPrice = getEffectivePrice(product);

  return {
    ...product,
    rawPrice,
    originalPrice: Number(product.price || 0),
    salePrice: isOnSale ? Number(product.sale_price || 0) : null,
    isOnSale,
    displayPrice: formatRupees(rawPrice),
    image: product.images?.[0] || product.image || fallbackCatalogImage,
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
  const large = index % 5 === 0;

  const handleAdd = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const result = await addToBag({
      ...product,
      price: product.rawPrice,
      rawPrice: product.rawPrice,
      effectivePrice: product.rawPrice,
      salePrice: product.salePrice,
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
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.7, delay: (index % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className={`group ${large ? 'lg:col-span-2' : ''}`}
    >
      <Link to={`/catalogue/${product.id}`} className="block border border-[#11110E]/12 bg-[#FFFEFA] transition-colors hover:border-[#11110E]/35">
        <div className={`relative overflow-hidden bg-[#E8E8E0] ${large ? 'aspect-[1.48/1]' : 'aspect-[4/5]'}`}>
          <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.035]" />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span className="bg-[#FFFEFA]/94 px-3 py-1.5 font-label text-[9px] font-bold uppercase tracking-[0.16em] text-[#11110E] backdrop-blur-sm">
              {product.type}
            </span>
            {product.isOnSale && (
              <span className="bg-[#785A1A] px-3 py-1.5 font-label text-[9px] font-bold uppercase tracking-[0.16em] text-[#FBF9F4]">
                Sale
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleWishlist}
            className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center border transition-all duration-300 ${
              saved 
                ? 'border-[#139D60]/20 bg-white shadow-[0_4px_12px_rgba(19,157,96,0.12)]' 
                : 'border-white/75 bg-white/90 backdrop-blur-sm'
            } hover:bg-white`}
            title={saved ? 'Saved' : 'Save product'}
          >
            <Heart 
              className={`h-4 w-4 transition-all duration-300 ${
                saved ? 'fill-[#139D60] text-[#139D60] scale-110' : 'text-[#0F3A3A]'
              }`} 
            />
          </button>
        </div>

        <div className="p-5 md:p-6">
          <div className="flex items-start justify-between gap-5">
            <div className="min-w-0">
              <p className="font-label text-[9px] font-bold uppercase tracking-[0.22em] text-[#797C73]">{product.category}</p>
              <h2 className="mt-2 font-headline text-[32px] leading-[0.95] text-[#11110E] transition-colors group-hover:text-[#785A1A]">
                {product.name}
              </h2>
            </div>
            <div className="shrink-0 text-right">
              {product.isOnSale && (
                <p className="font-body text-[12px] text-[#797C73]/55 line-through">{formatRupees(product.originalPrice)}</p>
              )}
              <p className="font-headline text-[18px] text-[#11110E]">{product.displayPrice}</p>
            </div>
          </div>

          <p className="mt-4 min-h-[46px] font-body text-[14px] leading-relaxed text-[#5E6058]">
            {product.info || product.description || 'Ready for gifting, collecting, or everyday plant care.'}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {(product.tags || []).slice(0, 3).map((tag) => (
              <span key={`${product.id}-${tag}`} className="bg-[#E8E8E0] px-2.5 py-1 font-label text-[9px] uppercase tracking-[0.14em] text-[#4F4B43]">
                {tag}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="mt-6 flex w-full items-center justify-center gap-2 bg-[#11110E] px-4 py-3.5 text-[#FBF9F4] transition-colors hover:bg-[#0F3A3A]"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="font-label text-[10px] font-bold uppercase tracking-[0.18em]">{added ? 'Added' : 'Add to Bag'}</span>
          </button>
        </div>
      </Link>
    </Motion.article>
  );
};

const ProductCataloguePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedFilter = searchParams.get('filter') || productTypeLabels.all;
  const [products, setProducts] = useState([]);
  const [activeFilter, setActiveFilter] = useState(
    filterOptions.some((option) => option.id === requestedFilter) ? requestedFilter : productTypeLabels.all,
  );
  const [activeSort, setActiveSort] = useState('Latest');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (filterOptions.some((option) => option.id === requestedFilter)) {
      setActiveFilter(requestedFilter);
    }
  }, [requestedFilter]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');

      try {
        const { data, error: fetchError } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
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

  const counts = useMemo(() => (
    filterOptions.reduce((acc, option) => {
      acc[option.id] = option.id === productTypeLabels.all
        ? products.length
        : products.filter((product) => productMatchesType(product, option.id)).length;
      return acc;
    }, {})
  ), [products]);

  const filteredProducts = useMemo(() => {
    const search = query.trim().toLowerCase();

    const items = products
      .filter((product) => productMatchesType(product, activeFilter))
      .filter((product) => {
        if (!search) return true;
        return [
          product.name,
          product.category,
          product.description,
          product.info,
          product.type,
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

  const heroProduct = useMemo(() => (
    products.find((product) => product.type === productTypeLabels.gifts)
    || products.find((product) => product.type === productTypeLabels.care)
    || products[0]
  ), [products]);

  const activeFilterMeta = filterOptions.find((option) => option.id === activeFilter) || filterOptions[0];

  const handleFilter = (filterId) => {
    setActiveFilter(filterId);
    const next = new URLSearchParams(searchParams);
    if (filterId === productTypeLabels.all) next.delete('filter');
    else next.set('filter', filterId);
    setSearchParams(next, { replace: true });
  };

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-[#F8F6F1] text-[#11110E]"
    >
      <Navbar />

      <main className="pt-[82px]">
        <section className="relative overflow-hidden border-b border-[#11110E]/10 bg-[#F8F6F1]">
          <div className="mx-auto grid min-h-[calc(100vh-82px)] w-[90vw] max-w-[1720px] grid-cols-1 lg:grid-cols-[minmax(0,0.88fr)_minmax(560px,1.12fr)]">
            <div className="flex flex-col justify-center px-6 py-16 md:px-10 lg:px-16">
              <Motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="font-label text-[10px] uppercase tracking-[0.34em] text-[#6D695F]"
              >
                Gift Plants, Care Tools & Home Pieces
              </Motion.p>
              <Motion.h1
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="mt-5 max-w-[680px] font-headline text-[62px] leading-[0.86] tracking-tight md:text-[96px] xl:text-[112px]"
              >
                The Gift
                <span className="block italic font-light">Suite</span>
              </Motion.h1>
              <Motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="mt-9 max-w-[620px] font-body text-[17px] leading-8 text-[#4F4B43]"
              >
                Shop gift-ready plants, care tools, vessels, and small botanical pieces that feel polished enough to send and simple enough to keep alive.
              </Motion.p>
              <Motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="mt-9 flex flex-wrap gap-3"
              >
                <button
                  type="button"
                  onClick={() => {
                    handleFilter(productTypeLabels.gifts);
                    document.getElementById('gift-shop')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-[#11110E] px-7 py-4 font-label text-[10px] font-bold uppercase tracking-[0.2em] text-[#FBF9F4] transition-colors hover:bg-[#0F3A3A]"
                >
                  Shop Gifts
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleFilter(productTypeLabels.care);
                    document.getElementById('gift-shop')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="border border-[#11110E] px-7 py-4 font-label text-[10px] font-bold uppercase tracking-[0.2em] text-[#11110E] transition-colors hover:bg-[#11110E] hover:text-[#FBF9F4]"
                >
                  Care Tools
                </button>
              </Motion.div>
            </div>

            <Motion.div
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
              className="relative min-h-[560px] border-t border-[#11110E]/10 bg-[#E4E2DA] lg:border-l lg:border-t-0"
            >
              <img
                src={heroProduct?.image || productAssetImages.terrarium}
                alt={heroProduct?.name || 'Gift-ready plant arrangement'}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-[#F8F6F1]/18" />
              <div className="absolute bottom-8 left-6 right-6 border border-[#11110E]/14 bg-[#FFFEFA]/94 p-5 shadow-[0_26px_80px_rgba(17,17,14,0.16)] backdrop-blur-sm md:left-auto md:right-10 md:w-[360px]">
                <p className="font-label text-[9px] uppercase tracking-[0.24em] text-[#6D695F]">Featured Gift Pick</p>
                <h2 className="mt-3 font-headline text-[36px] leading-[0.95] text-[#11110E]">{heroProduct?.name || 'Terrarium Gift Set'}</h2>
                <p className="mt-3 font-body text-[14px] leading-relaxed text-[#5E6058]">
                  {heroProduct?.info || heroProduct?.description || 'A compact botanical gift with a clean silhouette and easy care rhythm.'}
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-[#11110E]/10 pt-4">
                  <span className="font-label text-[9px] uppercase tracking-[0.2em] text-[#6D695F]">{heroProduct?.type || 'Gifts'}</span>
                  <span className="font-headline text-[20px] text-[#11110E]">{heroProduct?.displayPrice || 'Shop'}</span>
                </div>
              </div>
            </Motion.div>
          </div>
        </section>

        <section className="border-b border-[#11110E]/10 bg-[#FFFEFA] px-6 py-12 text-center md:px-10 md:py-16">
          <p className="mx-auto max-w-[760px] font-headline text-[28px] italic leading-snug text-[#11110E] md:text-[38px]">
            A thoughtful plant gift needs the plant, the vessel, and the care rhythm. This page keeps all three within reach.
          </p>
        </section>

        <section id="gift-shop" className="scroll-mt-[96px] bg-[#F8F6F1] px-6 py-14 md:px-10 md:py-20">
          <div className="mx-auto grid w-[90vw] max-w-[1720px] gap-10 lg:grid-cols-[330px_1fr]">
            <aside className="h-fit border border-[#11110E]/12 bg-[#FFFEFA] p-6 lg:sticky lg:top-[104px]">
              <div className="flex items-center justify-between border-b border-[#11110E]/12 pb-5">
                <div>
                  <p className="font-label text-[9px] uppercase tracking-[0.32em] text-[#6D695F]">Shop Filters</p>
                  <h2 className="mt-2 font-headline text-[38px] leading-none text-[#11110E]">Find The Right Gift</h2>
                </div>
                <SlidersHorizontal className="h-4 w-4 text-[#6D695F]" />
              </div>

              <div className="mt-6 space-y-2">
                {filterOptions.map((option) => {
                  const Icon = option.icon;
                  const active = activeFilter === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleFilter(option.id)}
                      className={`w-full border px-4 py-4 text-left transition-colors ${
                        active
                          ? 'border-[#11110E] bg-[#11110E] text-[#FBF9F4]'
                          : 'border-[#11110E]/12 bg-[#F8F6F1] text-[#11110E] hover:border-[#11110E]/38'
                      }`}
                    >
                      <span className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-3">
                          <Icon className="h-4 w-4" />
                          <span className="font-label text-[10px] font-bold uppercase tracking-[0.18em]">{option.label}</span>
                        </span>
                        <span className="font-body text-[13px] opacity-65">{counts[option.id] || 0}</span>
                      </span>
                      <span className={`mt-3 block font-body text-[14px] leading-relaxed ${active ? 'text-[#FBF9F4]/70' : 'text-[#5E6058]'}`}>
                        {option.copy}
                      </span>
                    </button>
                  );
                })}
              </div>

              <label className="mt-7 flex items-center gap-3 border border-[#11110E]/12 bg-[#F8F6F1] px-4 py-3">
                <Search className="h-4 w-4 text-[#797C73]" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search gifts or tools"
                  className="min-w-0 flex-1 bg-transparent font-body text-sm text-[#31332C] outline-none placeholder:text-[#797C73]/70"
                />
              </label>

              <div className="mt-4 border border-[#11110E]/12 bg-[#F8F6F1] px-4 py-3">
                <select
                  value={activeSort}
                  onChange={(event) => setActiveSort(event.target.value)}
                  className="w-full bg-transparent font-label text-[11px] font-bold uppercase tracking-[0.14em] text-[#31332C] outline-none"
                >
                  {sortOptions.map((sort) => (
                    <option key={sort} value={sort}>{sort}</option>
                  ))}
                </select>
              </div>
            </aside>

            <div>
              <div className="mb-8 flex flex-col gap-4 border-b border-[#11110E]/12 pb-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="font-label text-[10px] uppercase tracking-[0.32em] text-[#6D695F]">{activeFilterMeta.label}</p>
                  <h2 className="mt-3 font-headline text-[44px] leading-none text-[#11110E] md:text-[64px]">
                    {loading ? 'Loading products' : `${filteredProducts.length} item${filteredProducts.length === 1 ? '' : 's'} ready`}
                  </h2>
                </div>
                <Link to="/discovery" className="inline-flex items-center gap-3 font-label text-[10px] font-bold uppercase tracking-[0.2em] text-[#11110E]">
                  Shop full plant collection
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {loading ? (
                <div className="flex min-h-[380px] items-center justify-center border border-[#11110E]/12 bg-[#FFFEFA]">
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
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {filteredProducts.map((product, index) => (
                    <ProductTile key={product.id} product={product} index={index} />
                  ))}
                </div>
              ) : (
                <div className="grid min-h-[360px] place-items-center border border-[#11110E]/12 bg-[#FFFEFA] p-8 text-center">
                  <div className="max-w-lg">
                    <Gift className="mx-auto h-10 w-10 text-[#0F3A3A]" />
                    <h2 className="mt-6 font-headline text-[42px] leading-none text-[#1D241F]">No items in this section yet</h2>
                    <p className="mt-4 font-body text-sm leading-relaxed text-[#5E6058]">
                      Add care tools, gifts, or plant listings from the admin inventory. They will appear here, in discovery, and inside AI diagnosis recommendations.
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
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </Motion.div>
  );
};

export default ProductCataloguePage;
