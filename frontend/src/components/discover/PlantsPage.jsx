import { useState } from 'react';
import { ChevronDown, ChevronUp, ShoppingCart } from 'lucide-react';
import { Header } from '../homepage/Header';
import { Footer } from '../homepage/Footer';

const plants = [
  { id: 1, name: 'Money Tree', category: 'EASY CARE', price: 48, image: 'https://images.pexels.com/photos/6915358/pexels-photo-6915358.jpeg' },
  { id: 2, name: 'Red Prayer Plant', category: 'PET FRIENDLY', price: 38, image: 'https://images.pexels.com/photos/6964562/pexels-photo-6964562.jpeg' },
  { id: 3, name: 'Bamboo Palm', category: 'LOW LIGHT', price: 85, image: 'https://images.pexels.com/photos/4671039/pexels-photo-4671039.jpeg' },
  { id: 4, name: 'Snake Plant', category: 'EASY CARE', price: 32, image: 'https://images.pexels.com/photos/7655923/pexels-photo-7655923.jpeg' },
  { id: 5, name: 'Fiddle Leaf Fig', category: 'STATEMENT', price: 120, image: 'https://images.pexels.com/photos/4671039/pexels-photo-4671039.jpeg' },
  { id: 6, name: 'Pothos Golden', category: 'EASY CARE', price: 25, image: 'https://images.pexels.com/photos/7655923/pexels-photo-7655923.jpeg' },
  { id: 7, name: 'Peace Lily', category: 'LOW LIGHT', price: 42, image: 'https://images.pexels.com/photos/6915358/pexels-photo-6915358.jpeg' },
  { id: 8, name: 'Calathea Orbifolia', category: 'PET FRIENDLY', price: 55, image: 'https://images.pexels.com/photos/6964562/pexels-photo-6964562.jpeg' },
];

const filterSections = [
  { label: 'INDOOR LIGHT', key: 'light' },
  { label: 'PLANT SIZE', key: 'size' },
  { label: 'POT COLOR', key: 'potColor' },
  { label: 'DIFFICULTY', key: 'difficulty' },
  { label: 'PET-FRIENDLY', key: 'petFriendly' },
  { label: 'AIR CLEANER', key: 'airCleaner' },
  { label: 'PRICE', key: 'price' },
];

function FilterSection({ label, isOpen, onToggle }) {
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left cursor-pointer bg-transparent border-none"
      >
        <span className="text-sm font-medium tracking-[0.05em] text-[#2D5A3D]">{label}</span>
        {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {isOpen && (
        <div className="pb-4 text-sm text-gray-500">
          <p className="text-xs text-gray-400 italic">Coming soon</p>
        </div>
      )}
    </div>
  );
}

export function PlantsPage() {
  const [openFilter, setOpenFilter] = useState(null);
  const [sortBy, setSortBy] = useState('featured');

  const toggleFilter = (key) => {
    setOpenFilter(openFilter === key ? null : key);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl text-[#2D5A3D]" style={{ fontFamily: 'Lora, serif' }}>Indoor Plants</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 uppercase tracking-wider">Sort by</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-200 rounded px-3 py-2 text-sm text-[#2D5A3D] bg-white cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        <div className="flex gap-10">
          <aside className="w-56 shrink-0 hidden md:block">
            {filterSections.map((section) => (
              <FilterSection
                key={section.key}
                label={section.label}
                isOpen={openFilter === section.key}
                onToggle={() => toggleFilter(section.key)}
              />
            ))}
            <button className="mt-6 w-full py-2.5 border border-[#2D5A3D] text-[#2D5A3D] text-sm font-medium tracking-[0.05em] rounded-full hover:bg-[#2D5A3D] hover:text-white transition-colors cursor-pointer bg-white">
              CLEAR FILTERS
            </button>
          </aside>

          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {plants.map((plant) => (
                <div key={plant.id} className="group cursor-pointer">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-4">
                    <img
                      src={plant.image}
                      alt={plant.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold tracking-wider text-[#2D5A3D]">
                      {plant.category}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 translate-y-[150%] group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button className="w-full py-2.5 bg-[#2D5A3D] text-white text-sm font-medium rounded-full hover:bg-[#1E4A2E] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg">
                        Add to Cart
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-light text-gray-900" style={{ fontFamily: 'Lora, serif' }}>{plant.name}</h3>
                    <span className="text-lg font-light text-[#2D5A3D]">${plant.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
