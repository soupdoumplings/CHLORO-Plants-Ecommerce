export function FindPerfectPlant() {
  const categories = [
    {
      title: 'New Arrivals',
      image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaXIlMjBwbGFudHMlMjBkaXNwbGF5fGVufDF8fHx8MTc3NDIwODE2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      title: 'Low-Maintenance',
      image: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGJ5JTIwZmlyZXBsYWNlJTIwcGxhbnRzfGVufDF8fHx8MTc3NDIwODI2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      title: 'Pet-Friendly',
      image: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVuY2glMjBidWxsZG9nJTIwaW5kb29yJTIwcGxhbnR8ZW58MXx8fHwxNzc0MjA4MzYzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      title: 'Gifts',
      image: 'https://images.unsplash.com/photo-1509937528035-ad76254b0356?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5rJTIwcGxhbnQlMjBkZWNvcnxlbnwxfHx8fDE3NzQyMDgzOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <p className="text-sm text-[#2D7A4E] uppercase tracking-wider mb-3">
            SHOP BY CATEGORY
          </p>
          <h2 className="text-4xl text-[#2D5A3D]" style={{ fontFamily: 'Lora, serif' }}>
            Find your perfect plant
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.title}
              className="group cursor-pointer relative overflow-hidden rounded-2xl"
            >
              <div className="aspect-[3/4] relative">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 bg-[#2D7A4E] text-white text-xs px-3 py-1 rounded-full">
                  SALE
                </span>
                <h3 className="absolute bottom-6 left-6 text-white text-xl">{category.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
