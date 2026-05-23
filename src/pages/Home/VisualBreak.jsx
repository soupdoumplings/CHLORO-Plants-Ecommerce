import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { fallbackCatalogImage } from '../../lib/localImages';
import { formatRupees, getEffectivePrice, hasActiveSale } from '../../lib/pricing';
import { supabase } from '../../supabase';

const starterSignals = ['starter', 'beginner', 'essential', 'new gardener', 'first plant', 'basic', 'must-have'];
const careToolSignals = [
  'care tool',
  'plant care',
  'gardening tool',
  'equipment',
  'tool',
  'shear',
  'scissor',
  'secateur',
  'pruner',
  'mister',
  'spray',
  'meter',
  'probe',
  'fertilizer',
  'neem',
  'soil mix',
  'potting mix',
  'watering can',
];
const plantCategorySignals = ['indoor plant', 'outdoor plant', 'plants', 'flower', 'fresh cut'];

const productText = (product) => [
  product.name,
  product.category,
  product.description,
  product.info,
  ...(Array.isArray(product.tags) ? product.tags : []),
].join(' ').toLowerCase();

const hasAny = (text, signals) => signals.some((signal) => text.includes(signal));

const isCareToolProduct = (product) => {
  const category = String(product.category || '').toLowerCase();
  const tags = Array.isArray(product.tags) ? product.tags.join(' ').toLowerCase() : '';
  const text = productText(product);
  const explicitCategory = hasAny(category, ['care tool', 'plant care', 'gardening tool', 'equipment', 'tool']);
  const explicitTag = hasAny(tags, ['care-tool', 'care tool', 'plant-care', 'tool', 'root-care', 'pest-care']);
  const looksLikePlant = hasAny(category, plantCategorySignals);

  if (looksLikePlant && !explicitCategory && !explicitTag) return false;
  return explicitCategory || explicitTag || hasAny(text, careToolSignals);
};

const isStarterTool = (product) => starterSignals.some((signal) => productText(product).includes(signal));

const normalizeTool = (product) => ({
  ...product,
  image: product.images?.[0] || product.image || fallbackCatalogImage,
  displayPrice: formatRupees(getEffectivePrice(product)),
  isOnSale: hasActiveSale(product),
  stock: Number(product.stock ?? 0),
});

const Toolkit = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCareTools = async () => {
      setLoading(true);
      setError('');

      try {
        const { data, error: fetchError } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        const careTools = (data || [])
          .filter(isCareToolProduct)
          .map(normalizeTool);

        const starterTools = careTools.filter(isStarterTool);
        const starterToolIds = new Set(starterTools.map((tool) => tool.id));
        const remainingTools = careTools.filter((tool) => !starterToolIds.has(tool.id));
        setTools([...starterTools, ...remainingTools].slice(0, 4));
      } catch (err) {
        setError(err.message || 'Care tools could not be loaded.');
        setTools([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCareTools();
  }, []);

  const sectionCopy = useMemo(() => (
    tools.length
      ? 'Start with the essentials: watering, pruning, soil checks, and recovery support chosen from live CHLORO inventory.'
      : 'Add active care-tool products in the admin inventory and they will appear here for new gardeners.'
  ), [tools.length]);

  return (
    <section className="bg-[#fbf9f4] py-24 md:py-28">
      <div className="page-shell page-gutter">
        <Motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-14 max-w-3xl text-center md:mb-16"
        >
          <p className="mb-5 font-label text-[11px] font-bold uppercase tracking-[0.3em] text-[#31332c]">
            New Gardener Essentials
          </p>
          <h2 className="font-headline text-[clamp(2.7rem,6vw,4.25rem)] leading-[0.95] tracking-tight text-[#31332c]">
            The Care Tools Starter Kit
          </h2>
          <p className="mx-auto mt-5 max-w-xl font-body text-[14px] leading-relaxed text-[#5e6058]">
            {sectionCopy}
          </p>
        </Motion.div>

        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="min-h-[350px] animate-pulse border border-[#31332c]/8 bg-white/70 p-6 md:p-8">
                <div className="mb-8 h-44 bg-[#e8e9e0]" />
                <div className="mx-auto mb-4 h-6 w-3/4 bg-[#e8e9e0]" />
                <div className="mx-auto h-4 w-1/2 bg-[#e8e9e0]" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="mx-auto max-w-xl border border-[#9F403D]/20 bg-[#9F403D]/8 p-8 text-center">
            <p className="font-label text-[10px] font-bold uppercase tracking-[0.22em] text-[#752121]">{error}</p>
          </div>
        ) : tools.length === 0 ? (
          <div className="mx-auto max-w-xl border border-[#31332c]/10 bg-white/70 p-8 text-center">
            <p className="font-label text-[10px] font-bold uppercase tracking-[0.22em] text-[#5e6058]">
              No active care tools found in inventory.
            </p>
            <Link
              to="/admin/add-plant"
              className="mt-6 inline-flex bg-[#0F3A3A] px-5 py-3 font-label text-[9px] font-bold uppercase tracking-[0.18em] text-[#FBF9F4] transition-colors hover:bg-[#31332c]"
            >
              Add Care Tools
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7">
            {tools.map((tool, index) => (
              <Motion.article
                key={tool.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.7, delay: (index % 4) * 0.12, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="group min-h-[350px] border border-[#31332c]/8 bg-white/70 text-center transition-colors duration-300 hover:bg-[#efeee6]"
              >
                <Link to={`/catalogue/${tool.id}`} className="block h-full p-6 md:p-8">
                  <div className="relative mb-8 flex h-44 items-center justify-center overflow-hidden bg-[#efeee6]/55 transition-transform duration-300 group-hover:scale-[1.035]">
                    <img
                      src={tool.image}
                      alt={tool.name}
                      className="h-full w-full object-cover mix-blend-multiply"
                    />
                    {tool.isOnSale && (
                      <span className="absolute left-3 top-3 bg-[#785A1A] px-2.5 py-1 font-label text-[8px] font-bold uppercase tracking-[0.14em] text-white">
                        Sale
                      </span>
                    )}
                  </div>
                  <h4 className="mb-2 font-headline text-2xl text-[#31332c] transition-colors group-hover:text-[#785a1a]">
                    {tool.name}
                  </h4>
                  <p className="mb-6 min-h-[34px] font-label text-[9px] font-bold uppercase tracking-[0.2em] text-[#797c73]">
                    {tool.category || 'Care Tools'}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-serif text-lg text-[#31332c]">{tool.displayPrice}</span>
                    <span className="material-symbols-outlined text-[16px] text-[#785a1a] opacity-0 transition-opacity group-hover:opacity-100">
                      arrow_forward
                    </span>
                  </div>
                </Link>
              </Motion.article>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            to="/products-gifts?filter=Care%20Tools"
            className="inline-flex items-center gap-3 border-b border-[#31332c] pb-1.5 font-label text-[10px] font-bold uppercase tracking-[0.22em] text-[#31332c] transition-opacity hover:opacity-60"
          >
            Shop all care tools
            <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Toolkit;
