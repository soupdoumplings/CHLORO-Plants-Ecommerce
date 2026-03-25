import React from 'react';

export default function CategorySection() {
  const categories = [
    { name: 'House Plants', count: 124, image: 'https://images.pexels.com/photos/7655923/pexels-photo-7655923.jpeg' },
    { name: 'Office Plants', count: 56, image: 'https://images.pexels.com/photos/4671039/pexels-photo-4671039.jpeg' },
    { name: 'Pet Friendly', count: 48, image: 'https://images.pexels.com/photos/6915358/pexels-photo-6915358.jpeg' },
    { name: 'Low Light', count: 32, image: 'https://images.pexels.com/photos/6964562/pexels-photo-6964562.jpeg' }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-light mb-12" style={{ fontFamily: 'Lora, serif' }}>Browse by and decor</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div key={cat.name} className="group cursor-pointer relative overflow-hidden rounded-2xl h-80">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-light">{cat.name}</h3>
                <p className="text-sm opacity-80">{cat.count} Items</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
