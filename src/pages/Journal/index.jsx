import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import heroImage from '../../assets/hero.png';
import discoveryImage from '../../assets/discovery-hero.png';
import profileImage from '../../assets/profile-photo.png';
import lycasteImage from '../../assets/products/lycaste.png';
import monsteraImage from '../../assets/products/monstera.png';

const taxonomyCards = [
  {
    title: 'Bryophytes',
    description: 'Non-vascular land plants, including mosses and liverworts. Pioneers of terrestrial life.',
    entries: '1,240 Entries',
    icon: 'spa',
    featured: false,
  },
  {
    title: 'Pteridophytes',
    description: 'Vascular plants that reproduce via spores. Explore the ancient lineages of ferns and horsetails.',
    entries: '3,800 Entries',
    icon: 'psychiatry',
    featured: false,
  },
  {
    title: 'Angiosperms',
    description: 'The diverse world of flowering plants. From the smallest duckweed to giant mountain ash.',
    entries: '25,000+ Entries',
    icon: 'filter_vintage',
    featured: true,
  },
];

const featuredSpecimens = [
  {
    family: 'Orchidaceae',
    name: 'Paphiopedilum rothschildianum',
    description: 'One of the rarest orchids in the world, endemic to Mt. Kinabalu. Known as the Gold of Kinabalu.',
    image: lycasteImage,
  },
  {
    family: 'Araceae',
    name: 'Monstera deliciosa',
    description: 'This Swiss cheese plant is native to southern Mexico and Panama, famous for its fenestrated leaves.',
    image: monsteraImage,
  },
];

const expeditions = [
  {
    title: "Chasing the Silver Fern: New Zealand's South Island",
    summary:
      'A fourteen-day journal through the temperate rainforests of the West Coast, documenting rare bryophytes and ancient pteridophytes.',
    date: 'September 12, 2024',
    image: discoveryImage,
  },
  {
    title: 'The Alchemy of Soil: Understanding pH Dynamics',
    summary:
      'Why certain species thrive in acidic peat while others perish. A technical dive into soil composition and nutrient bioavailability.',
    date: 'August 28, 2024',
    image: profileImage,
  },
];

const JournalPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-[#F4F2EC] text-[#1D241F]"
    >
      <Navbar />

      <main className="mx-auto grid w-full max-w-[1240px] grid-cols-1 gap-8 px-5 pb-12 pt-[114px] lg:grid-cols-[210px_1fr] lg:px-8">
        <aside className="pr-6 lg:border-r lg:border-[#1D241F]/10">
          <div className="space-y-2">
            <p className="font-headline text-[24px] text-[#1D241F]">The Herbarium</p>
            <p className="font-label text-[10px] uppercase tracking-[0.2em] text-[#1D241F]/45">Vol. MMXXIV</p>
          </div>
          <div className="mt-10 space-y-5">
            {['Bryophytes', 'Pteridophytes', 'Gymnosperms', 'Angiosperms', 'Fungi'].map((item) => (
              <button
                key={item}
                className={`flex items-center gap-2 font-label text-[10px] uppercase tracking-[0.24em] transition-colors ${
                  item === 'Angiosperms' ? 'text-[#1D241F]' : 'text-[#1D241F]/45 hover:text-[#1D241F]/80'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">eco</span>
                {item}
              </button>
            ))}
          </div>
          <button className="mt-12 w-full border border-[#1E5B5B]/70 bg-[#1E5B5B]/95 px-4 py-3 font-label text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F4F2EC] transition-colors hover:bg-[#174949]">
            Request Sample
          </button>
          <p className="mt-4 font-label text-[9px] uppercase tracking-[0.2em] text-[#1D241F]/45">Archives</p>
        </aside>

        <section className="space-y-16 lg:space-y-20">
          <div className="border-b border-[#1D241F]/15 pb-4">
            <p className="font-label text-[9px] uppercase tracking-[0.24em] text-[#1D241F]/45">Encyclopedia Search</p>
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="font-headline text-[42px] italic leading-none text-[#1D241F]/40">Lookup Species or Genus...</p>
              <span className="material-symbols-outlined text-[22px] text-[#1D241F]/75">search</span>
            </div>
            <p className="mt-4 font-body text-[13px] text-[#1D241F]/55">Over 45,000 specimens cataloged since 1924.</p>
          </div>

          <div className="grid gap-8 xl:grid-cols-[1fr_320px]">
            <article>
              <span className="inline-block bg-[#CF9E48] px-4 py-1 font-label text-[9px] uppercase tracking-[0.24em] text-[#2E271A]">
                Specimen of the Month
              </span>
              <h2 className="mt-5 font-headline text-[56px] leading-[0.9] tracking-tight text-[#1C221E] md:text-[72px] xl:text-[88px]">
                The Blue <span className="italic">Meconopsis</span>
              </h2>
              <div className="mt-5 max-w-[540px] border border-[#1D241F]/10 bg-[#F8F6F1] p-8">
                <p className="font-headline text-[32px] italic leading-tight text-[#1D241F]/70">
                  A spectral sapphire blooming amidst the jagged peaks of the Himalayas.
                </p>
                <p className="mt-5 font-body text-[14px] leading-7 text-[#1D241F]/70">
                  Discovered in the early 20th century, this perennial poppy challenges the standard palette of the natural
                  world with its vibrant, true-blue petals and golden stamens.
                </p>
                <button className="mt-8 font-label text-[10px] font-semibold uppercase tracking-[0.2em] text-[#785A1A] transition-opacity hover:opacity-70">
                  Read Full Dossier
                </button>
              </div>
            </article>

            <img
              src={heroImage}
              alt="Blue flowering specimen"
              className="h-[460px] w-full object-cover xl:h-[520px]"
            />
          </div>

          <section className="pt-8">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
              <h3 className="font-headline text-[40px] leading-none text-[#1D241F] md:text-[48px]">Taxonomy Browser</h3>
              <p className="font-label text-[9px] uppercase tracking-[0.24em] text-[#1D241F]/45">Systematic Classification</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {taxonomyCards.map((card) => (
                <article
                  key={card.title}
                  className={`border p-7 ${card.featured ? 'border-[#1E5B5B] bg-[#2B6161] text-[#F4F2EC]' : 'border-[#1D241F]/10 bg-[#F7F5EF] text-[#1D241F]'}`}
                >
                  <span className="material-symbols-outlined text-[20px]">{card.icon}</span>
                  <h4 className="mt-6 font-headline text-[36px] leading-none">{card.title}</h4>
                  <p className={`mt-4 font-body text-[13px] leading-6 ${card.featured ? 'text-[#F4F2EC]/80' : 'text-[#1D241F]/62'}`}>
                    {card.description}
                  </p>
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

          <section className="pt-8">
            <h3 className="font-headline text-[40px] leading-none text-[#1D241F] md:text-[48px]">Featured Specimens</h3>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              {featuredSpecimens.map((specimen) => (
                <article key={specimen.name}>
                  <img src={specimen.image} alt={specimen.name} className="h-[240px] w-full object-cover" />
                  <p className="mt-4 font-label text-[9px] uppercase tracking-[0.2em] text-[#1D241F]/45">{specimen.family}</p>
                  <h4 className="mt-1 font-headline text-[38px] italic leading-none text-[#1D241F]">{specimen.name}</h4>
                  <p className="mt-3 font-body text-[14px] leading-7 text-[#1D241F]/65">{specimen.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-8 pt-8 xl:grid-cols-[1fr_250px]">
            <div className="space-y-8">
              <p className="font-label text-[9px] uppercase tracking-[0.24em] text-[#1D241F]/45">Recent Expeditions</p>
              {expeditions.map((entry) => (
                <article key={entry.title} className="grid gap-5 border-b border-[#1D241F]/10 pb-7 sm:grid-cols-[130px_1fr]">
                  <img src={entry.image} alt={entry.title} className="h-[110px] w-[130px] object-cover" />
                  <div>
                    <h4 className="font-headline text-[30px] leading-none text-[#1D241F] md:text-[40px]">{entry.title}</h4>
                    <p className="mt-3 font-body text-[14px] leading-7 text-[#1D241F]/65">{entry.summary}</p>
                    <p className="mt-4 font-label text-[9px] uppercase tracking-[0.2em] text-[#1D241F]/45">{entry.date}</p>
                  </div>
                </article>
              ))}
            </div>
            <aside className="h-fit border border-[#1D241F]/10 bg-[#F8F6F1] p-7">
              <p className="font-label text-[9px] uppercase tracking-[0.2em] text-[#1D241F]/45">Glossary of Terms</p>
              <div className="mt-6 space-y-5">
                {[
                  ['Dioecious', 'Having the male and female reproductive organs in separate individuals.'],
                  ['Inflorescence', 'The complete flower head of a plant including stems, stalks, bracts, and flowers.'],
                  ['Photosynthesis', 'The process by which green plants use sunlight to synthesize nutrients from CO2 and water.'],
                  ['Xylem', 'Vascular tissue in plants that conducts water and dissolved nutrients upward from the root.'],
                ].map(([term, definition]) => (
                  <div key={term}>
                    <h5 className="font-headline text-[32px] italic leading-none text-[#1D241F]">{term}</h5>
                    <p className="mt-2 font-body text-[13px] leading-6 text-[#1D241F]/62">{definition}</p>
                  </div>
                ))}
              </div>
            </aside>
          </section>
        </section>
      </main>

      <Footer />
    </motion.div>
  );
};

export default JournalPage;


