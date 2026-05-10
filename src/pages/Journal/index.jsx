import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { fetchPlantDetail, searchPlantNames } from '../../lib/kindwise';

const topicCards = [
  {
    title: 'Watering',
    description: 'Moisture notes translated into calm, usable care rhythm.',
    entries: 'Live API Data',
    icon: 'water_drop',
    featured: false,
  },
  {
    title: 'Humidity',
    description: 'Atmosphere guidance for rooms, balconies, and seasonal shifts.',
    entries: 'Smart Estimate',
    icon: 'humidity_percentage',
    featured: false,
  },
  {
    title: 'Propagation',
    description: 'Propagation methods shaped into a neat studio reference.',
    entries: 'Care Ready',
    icon: 'compost',
    featured: true,
  },
];

const quickAnswers = [
  {
    q: 'Why are some values missing?',
    a: 'Kindwise does not have full care data for every species yet. When a field is missing, we clearly show it as unavailable.',
  },
  {
    q: 'What does watering scale mean?',
    a: 'Scale is 1 to 3. 1 means dry side, 2 means medium moisture, 3 means wet conditions.',
  },
  {
    q: 'Is humidity exact?',
    a: 'Humidity in this page is a practical estimate based on watering preference to keep guidance easy for users.',
  },
];

const editorialSearches = ['monstera', 'orchid', 'ficus', 'aloe vera'];

const mapMoisture = (value) => {
  if (value <= 1) return 'Dry';
  if (value <= 2) return 'Medium';
  return 'Wet';
};

const wateringLabel = (watering) => {
  if (!watering || watering.min == null || watering.max == null) return 'Not available';
  return `${mapMoisture(watering.min)} to ${mapMoisture(watering.max)}`;
};

const waterRetentionHint = (watering) => {
  if (!watering || watering.min == null || watering.max == null) return 'No water-retention data yet.';

  if (watering.max <= 1) return 'Low retention: let soil dry more between waterings.';
  if (watering.min >= 3) return 'High retention: keep soil consistently moist.';
  if (watering.min === 1 && watering.max === 2) return 'Moderate retention: allow topsoil to dry slightly.';

  return 'Balanced retention: keep evenly moist, avoid waterlogging.';
};

const humidityHint = (watering) => {
  if (!watering || watering.min == null || watering.max == null) return 'Humidity guidance unavailable.';

  const avg = (watering.min + watering.max) / 2;
  if (avg <= 1.2) return 'Low humidity (30-45%) is usually fine.';
  if (avg <= 2.2) return 'Medium humidity (45-60%) is recommended.';
  return 'Higher humidity (60%+) is recommended.';
};

const dropletCount = (watering) => {
  if (!watering || watering.max == null) return 0;
  return Math.max(1, Math.min(3, watering.max));
};

const stripDescription = (description) => {
  if (!description) return 'No description available for this plant yet.';
  if (typeof description === 'string') return description;
  if (description.value) return description.value;
  if (description.description) return description.description;
  return 'No description available for this plant yet.';
};

const imageFromDetails = (details) => {
  if (!details) return null;
  if (typeof details.image === 'string') return details.image;
  if (details.image?.value) return details.image.value;
  if (Array.isArray(details.images) && details.images[0]?.url) return details.images[0].url;
  return null;
};

const commonNamesText = (value) => {
  if (!value) return 'Common name not available';
  if (Array.isArray(value) && value.length) return value.slice(0, 3).join(', ');
  if (typeof value === 'object') {
    const firstList = Object.values(value).find((entry) => Array.isArray(entry) && entry.length);
    if (firstList) return firstList.slice(0, 3).join(', ');
  }
  return 'Common name not available';
};

const JournalPage = () => {
  const [query, setQuery] = useState('monstera');
  const [debouncedQuery, setDebouncedQuery] = useState('monstera');
  const [searchLoading, setSearchLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [detailError, setDetailError] = useState('');
  const [results, setResults] = useState([]);
  const [selectedToken, setSelectedToken] = useState('');
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [openAnswer, setOpenAnswer] = useState(0);

  const detailCache = useRef(new Map());

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const runSearch = async () => {
      if (!debouncedQuery) {
        setResults([]);
        setSearchError('Type a plant name to search the Kindwise database.');
        return;
      }

      setSearchLoading(true);
      setSearchError('');

      try {
        const payload = await searchPlantNames(debouncedQuery, { limit: 12, language: 'en', thumbnails: true });
        const entities = payload?.entities ?? [];
        setResults(entities);

        if (!entities.length) {
          setSearchError('No plants found for this search. Try another keyword.');
          setSelectedPlant(null);
          setSelectedToken('');
          return;
        }

        const nextToken = entities[0].access_token;
        setSelectedToken((prev) => prev || nextToken);
      } catch (error) {
        setResults([]);
        setSearchError(error.message || 'Search failed.');
      } finally {
        setSearchLoading(false);
      }
    };

    runSearch();
  }, [debouncedQuery]);

  useEffect(() => {
    const loadDetails = async () => {
      if (!selectedToken) return;

      setDetailError('');
      const cached = detailCache.current.get(selectedToken);
      if (cached) {
        setSelectedPlant(cached);
        return;
      }

      setDetailLoading(true);

      try {
        const detail = await fetchPlantDetail(selectedToken, { language: 'en' });
        detailCache.current.set(selectedToken, detail);
        setSelectedPlant(detail);
      } catch (error) {
        setSelectedPlant(null);
        setDetailError(error.message || 'Could not load plant details.');
      } finally {
        setDetailLoading(false);
      }
    };

    loadDetails();
  }, [selectedToken]);

  const visibleResults = useMemo(() => results.slice(0, 8), [results]);

  const selected = useMemo(() => {
    const entity = results.find((item) => item.access_token === selectedToken) || results[0] || null;
    const details = selectedPlant || {};

    return {
      entity,
      details,
      title: details?.name || entity?.entity_name || 'Plant Profile',
      commonNames: commonNamesText(details?.common_names),
      description: stripDescription(details?.description),
      rank: details?.rank || 'unknown',
      taxonomy: details?.taxonomy || {},
      watering: details?.watering || null,
      propagation: Array.isArray(details?.propagation_methods) ? details.propagation_methods : [],
      edibleParts: Array.isArray(details?.edible_parts) ? details.edible_parts : [],
      wikiUrl: details?.url || '',
      heroImage: imageFromDetails(details),
      synonyms: Array.isArray(details?.synonyms) ? details.synonyms : [],
    };
  }, [results, selectedPlant, selectedToken]);

  const apiKeyMissing = !import.meta.env.VITE_KINDWISE_API_KEY;

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-[#F7F3EA] text-[#11110E]"
    >
      <Navbar />

      <main className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-10 px-5 pb-20 pt-[116px] lg:grid-cols-[320px_1fr] lg:px-10">
        <aside className="h-fit pr-0 lg:sticky lg:top-[112px] lg:border-r lg:border-[#11110E]/10 lg:pr-8">
          <div className="space-y-2">
            <p className="font-label text-[9px] uppercase tracking-[0.32em] text-[#8A6A21]">CHLORO Journal</p>
            <p className="font-headline text-[42px] leading-[0.88] text-[#11110E]">The Botanical Index</p>
            <p className="max-w-[260px] font-body text-[13px] leading-relaxed text-[#6E6A60]">
              Live plant intelligence, edited into a quiet care reference.
            </p>
          </div>

          <div className="mt-10">
            <label className="font-label text-[9px] uppercase tracking-[0.24em] text-[#11110E]/45">Search plant name</label>
            <div className="mt-3 flex items-center gap-2 border border-[#11110E]/15 bg-[#FFFEFA] px-4 py-3">
              <span className="material-symbols-outlined text-[18px] text-[#11110E]/65">search</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Try: aloe vera"
                className="w-full bg-transparent font-body text-[13px] text-[#11110E] outline-none placeholder:text-[#11110E]/35"
              />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {editorialSearches.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setQuery(item)}
                  className="border border-[#11110E]/12 bg-[#EFEAE0] px-3 py-2 text-left font-label text-[8px] font-bold uppercase tracking-[0.16em] text-[#6E6A60] transition-colors hover:border-[#11110E] hover:bg-[#FFFEFA]"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 space-y-2">
            <p className="font-label text-[9px] uppercase tracking-[0.24em] text-[#11110E]/45">Matches</p>
            <div className="max-h-[380px] space-y-2 overflow-auto pr-1">
              {visibleResults.map((item) => {
                const active = item.access_token === selectedToken;
                return (
                  <button
                    key={item.access_token}
                    onClick={() => setSelectedToken(item.access_token)}
                    className={`w-full border px-4 py-3 text-left transition-colors duration-300 ${
                      active
                        ? 'border-[#11110E] bg-[#11110E] text-[#F7F3EA]'
                        : 'border-[#11110E]/12 bg-[#FFFEFA] text-[#11110E] hover:border-[#11110E]/40'
                    }`}
                  >
                    <p className="font-headline text-[24px] leading-none">{item.entity_name}</p>
                    <p className={`mt-1 font-label text-[9px] uppercase tracking-[0.15em] ${active ? 'text-[#F4F2EC]/75' : 'text-[#1D241F]/45'}`}>
                      indexed by {item.matched_in_type || 'name'}
                    </p>
                  </button>
                );
              })}

              {!searchLoading && !visibleResults.length && (
                <p className="font-body text-[12px] text-[#11110E]/60">No items found.</p>
              )}
            </div>
          </div>

          <div className="mt-8 border border-[#11110E]/12 bg-[#FFFEFA] p-5">
            <p className="font-label text-[9px] uppercase tracking-[0.24em] text-[#11110E]/45">Status</p>
            {apiKeyMissing && (
              <p className="mt-2 font-body text-[12px] leading-5 text-[#9F403D]">
                Missing `VITE_KINDWISE_API_KEY` in `.env`.
              </p>
            )}
            {!apiKeyMissing && searchLoading && <p className="mt-2 font-body text-[12px] text-[#11110E]/65">Searching Kindwise...</p>}
            {!apiKeyMissing && detailLoading && <p className="mt-2 font-body text-[12px] text-[#11110E]/65">Loading care details...</p>}
            {searchError && <p className="mt-2 font-body text-[12px] text-[#9F403D]">{searchError}</p>}
            {detailError && <p className="mt-2 font-body text-[12px] text-[#9F403D]">{detailError}</p>}
          </div>
        </aside>

        <section className="space-y-16">
          <Motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="border-b border-[#11110E]/15 pb-7"
          >
            <p className="font-label text-[9px] uppercase tracking-[0.32em] text-[#8A6A21]">Dynamic Plant Wiki</p>
            <h1 className="mt-5 max-w-[980px] font-headline text-[62px] leading-[0.84] text-[#11110E] md:text-[104px]">{selected.title}</h1>
            <p className="mt-5 font-body text-[15px] text-[#6E6A60]">{selected.commonNames}</p>
          </Motion.div>

          <div className="grid gap-8 xl:grid-cols-[1fr_360px]">
            <article className="border border-[#11110E]/10 bg-[#FFFEFA] p-7 md:p-10">
              <p className="font-label text-[9px] uppercase tracking-[0.24em] text-[#11110E]/45">About this plant</p>
              <p className="mt-6 font-body text-[15px] leading-8 text-[#4F4B43]">{selected.description}</p>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <div className="border border-[#11110E]/10 bg-[#F7F3EA] p-5">
                  <p className="font-label text-[9px] uppercase tracking-[0.2em] text-[#11110E]/45">Taxonomic rank</p>
                  <p className="mt-2 font-headline text-[31px] leading-none text-[#11110E] capitalize">{selected.rank}</p>
                </div>
                <div className="border border-[#11110E]/10 bg-[#F7F3EA] p-5">
                  <p className="font-label text-[9px] uppercase tracking-[0.2em] text-[#11110E]/45">Family</p>
                  <p className="mt-2 font-headline text-[31px] leading-none text-[#11110E]">{selected.taxonomy.family || 'Unknown'}</p>
                </div>
              </div>

              {selected.wikiUrl && (
                <a
                  href={selected.wikiUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-7 inline-flex items-center gap-2 border-b border-[#8A6A21] pb-1 font-label text-[10px] uppercase tracking-[0.2em] text-[#8A6A21] hover:opacity-70"
                >
                  Open source article
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </a>
              )}
            </article>

            {selected.heroImage ? (
              <img src={selected.heroImage} alt={selected.title} className="h-[470px] w-full object-cover grayscale-[18%]" />
            ) : (
              <div className="flex h-[470px] items-center justify-center border border-[#11110E]/10 bg-[#EFEAE0]">
                <p className="font-body text-[13px] text-[#11110E]/55">No image returned by API for this plant.</p>
              </div>
            )}
          </div>

          <section>
            <div className="mb-8 flex flex-wrap items-end justify-between gap-3 border-b border-[#11110E]/10 pb-6">
              <h2 className="font-headline text-[48px] italic text-[#11110E] md:text-[62px]">Care Snapshot</h2>
              <p className="font-label text-[10px] tracking-[0.16rem] uppercase text-[#6E6A60] font-bold">Highlighted from API</p>
            </div>

            <div className="grid grid-cols-1 gap-0 border-l border-[#11110E]/10 md:grid-cols-3">
              <article className="border-r border-[#11110E]/10 bg-[#F8F5EE] p-10">
                <span className="material-symbols-outlined text-[#8A6A21] text-3xl">water_drop</span>
                <h3 className="mt-4 font-label text-xs uppercase tracking-[0.15rem] font-black text-[#31332C]">Water Level</h3>
                <p className="mt-4 font-headline text-[40px] leading-none text-[#11110E]">{wateringLabel(selected.watering)}</p>
                <p className="mt-4 font-body text-sm leading-relaxed text-[#6E6A60]">{waterRetentionHint(selected.watering)}</p>
                <div className="mt-5 flex items-center gap-2">
                  {[1, 2, 3].map((level) => (
                    <span
                      key={level}
                      className={`material-symbols-outlined text-[18px] ${level <= dropletCount(selected.watering) ? 'text-[#1E5B5B]' : 'text-[#1D241F]/20'}`}
                    >
                      water_drop
                    </span>
                  ))}
                </div>
              </article>

              <article className="border-r border-[#11110E]/10 bg-[#EDE8DC] p-10">
                <span className="material-symbols-outlined text-[#8A6A21] text-3xl">humidity_percentage</span>
                <h3 className="mt-4 font-label text-xs uppercase tracking-[0.15rem] font-black text-[#31332C]">Humidity Hint</h3>
                <p className="mt-4 font-headline text-[40px] leading-none text-[#11110E]">{humidityHint(selected.watering)}</p>
                <p className="mt-4 font-body text-sm leading-relaxed text-[#6E6A60]">Based on Kindwise watering range so users can act quickly.</p>
              </article>

              <article className="bg-[#11110E] p-10 text-[#F7F3EA]">
                <span className="material-symbols-outlined text-3xl">compost</span>
                <h3 className="mt-4 font-label text-xs uppercase tracking-[0.15rem] font-black">Propagation</h3>
                {selected.propagation.length ? (
                  <ul className="mt-5 space-y-2 font-body text-sm leading-relaxed text-[#F4F2EC]/88">
                    {selected.propagation.slice(0, 4).map((item) => (
                      <li key={item} className="flex items-center gap-2 capitalize">
                        <span className="material-symbols-outlined text-[14px]">check</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-5 font-body text-sm leading-relaxed text-[#F4F2EC]/82">No propagation methods available in the API response for this plant.</p>
                )}
              </article>
            </div>
          </section>

          <section className="pt-2">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
              <h3 className="font-headline text-[40px] leading-none text-[#1D241F] md:text-[48px]">Data Topics</h3>
              <p className="font-label text-[9px] uppercase tracking-[0.24em] text-[#1D241F]/45">Built for simple users</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {topicCards.map((card) => (
                <article
                  key={card.title}
                  className={`border p-7 ${card.featured ? 'border-[#1E5B5B] bg-[#2B6161] text-[#F4F2EC]' : 'border-[#1D241F]/10 bg-[#F7F5EF] text-[#1D241F]'}`}
                >
                  <span className="material-symbols-outlined text-[20px]">{card.icon}</span>
                  <h4 className="mt-6 font-headline text-[30px] leading-none">{card.title}</h4>
                  <p className={`mt-4 font-body text-[13px] leading-6 ${card.featured ? 'text-[#F4F2EC]/80' : 'text-[#1D241F]/62'}`}>{card.description}</p>
                  <p
                    className={`mt-6 border-t pt-4 font-label text-[9px] uppercase tracking-[0.2em] ${
                      card.featured ? 'border-[#F4F2EC]/35 text-[#F4F2EC]/85' : 'border-[#1D241F]/18 text-[#1D241F]/45'
                    }`}
                  >
                    {card.entries}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-8 xl:grid-cols-[1fr_280px]">
            <div className="border border-[#1D241F]/12 bg-[#F8F6F1] p-7 md:p-10">
              <p className="font-label text-[9px] uppercase tracking-[0.2em] text-[#1D241F]/45">Quick Answers</p>
              <div className="mt-6 space-y-3">
                {quickAnswers.map((item, idx) => {
                  const isOpen = idx === openAnswer;
                  return (
                    <div key={item.q} className="border border-[#1D241F]/12 bg-[#F4F2EC] px-4 py-3">
                      <button onClick={() => setOpenAnswer(isOpen ? -1 : idx)} className="flex w-full items-center justify-between text-left">
                        <span className="font-headline text-[24px] leading-none text-[#1D241F]">{item.q}</span>
                        <span className="material-symbols-outlined text-[#1D241F]/70">{isOpen ? 'remove' : 'add'}</span>
                      </button>
                      {isOpen && <p className="mt-3 font-body text-[14px] leading-7 text-[#1D241F]/70">{item.a}</p>}
                    </div>
                  );
                })}
              </div>
            </div>

            <aside className="h-fit border border-[#1D241F]/10 bg-[#F8F6F1] p-7">
              <p className="font-label text-[9px] uppercase tracking-[0.2em] text-[#1D241F]/45">API Highlights</p>
              <div className="mt-6 space-y-5">
                <div>
                  <h5 className="font-headline text-[28px] italic leading-none text-[#1D241F]">Edible Parts</h5>
                  <p className="mt-2 font-body text-[13px] leading-6 text-[#1D241F]/62">
                    {selected.edibleParts.length ? selected.edibleParts.join(', ') : 'No edible parts provided for this species.'}
                  </p>
                </div>
                <div>
                  <h5 className="font-headline text-[28px] italic leading-none text-[#1D241F]">Synonyms</h5>
                  <p className="mt-2 font-body text-[13px] leading-6 text-[#1D241F]/62">
                    {selected.synonyms.length ? selected.synonyms.slice(0, 4).join(', ') : 'No synonym entries available.'}
                  </p>
                </div>
                <div>
                  <h5 className="font-headline text-[28px] italic leading-none text-[#1D241F]">Taxonomy</h5>
                  <p className="mt-2 font-body text-[13px] leading-6 text-[#1D241F]/62">
                    {Object.entries(selected.taxonomy).length
                      ? Object.entries(selected.taxonomy)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(' | ')
                      : 'No taxonomy data available.'}
                  </p>
                </div>
              </div>
            </aside>
          </section>
        </section>
      </main>

      <Footer />
    </Motion.div>
  );
};

export default JournalPage;
