import React from 'react';

export function FindPerfectPlant() {
  const categories = [
    { title: 'New Arrivals', image: 'https://images.unsplash.com/photo-1545241047-6083a3684587' },
    { title: 'Low-Maintenance', image: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8' },
    { title: 'Pet-Friendly', image: 'https://images.unsplash.com/photo-1534361960057-19889db9621e' },
    { title: 'Gifts', image: 'https://images.unsplash.com/photo-1509937528035-ad76254b0356' }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <p className="text-sm text-[#2D7A4E] uppercase tracking-wider mb-3">SHOP BY CATEGORY</p>
          <h2 className="text-4xl text-[#2D5A3D]" style={{ fontFamily: 'Lora, serif' }}>Find your perfect plant</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div key={category.title} className="group cursor-pointer relative overflow-hidden rounded-2xl aspect-[3/4]">
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors" />
              <div className="absolute top-4 left-4 bg-[#2D7A4E] text-white text-[10px] px-3 py-1 rounded-full uppercase font-bold tracking-wider">SALE</div>
              <h3 className="absolute bottom-6 left-6 text-white text-xl font-light">{category.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
