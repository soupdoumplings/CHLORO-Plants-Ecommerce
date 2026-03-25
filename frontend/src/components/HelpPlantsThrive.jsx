import { ArrowRight, Leaf, Shield, CheckCircle, BookOpen, Lightbulb, Calendar } from 'lucide-react';

export function HelpPlantsThrive() {
  const resources = [
    {
      icon: BookOpen,
      title: 'Plant Care Guides',
      description: 'Plant-specific guides covering light, water, soil, and troubleshooting for every species we sell.',
      link: 'BROWSE GUIDES',
      image: 'https://images.unsplash.com/photo-1755668739702-fc00c9701cc9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5rJTIwY2FsYWRpdW0lMjBwbGFudCUyMGxlYXZlc3xlbnwxfHx8fDE3NzQyMDk0MjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      icon: Lightbulb,
      title: 'Plant Tips & How-Tos',
      description: 'From repotting basics to pest prevention, our growing library of articles helps you build confidence.',
      link: 'READ TIPS',
      image: 'https://images.unsplash.com/photo-1772093977989-f01c3be981e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZXJuJTIwa29rZWRhbWElMjBtb3NzJTIwYmFsbHxlbnwxfHx8fDE3NzQyMDk0MjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      icon: Calendar,
      title: 'Seasonal Care',
      description: 'Plants need different things throughout the year. Stay ahead with seasonal watering and feeding advice.',
      link: 'SEASONAL ADVICE',
      image: 'https://images.unsplash.com/photo-1611866972879-3f7c79e1282d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvb3IlMjBwbGFudHMlMjBsaXZpbmclMjByb29tJTIwZGVjb3J8ZW58MXx8fHwxNzc0MjA5NDI2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="w-full mx-auto px-6 md:px-12 xl:px-20">
        {/* Main Feature */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20 items-center">
          {/* Image */}
          <div className="rounded-3xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1573947519611-72795aed568f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGhvbGRpbmclMjBwbGFudCUyMGJveCUyMGRlbGl2ZXJ5fGVufDF8fHx8MTc3NDIwOTQyNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Woman holding Bloomscape box"
              className="w-full h-[600px] object-cover"
            />
          </div>

          {/* Content */}
          <div>
            <p className="text-sm text-[#2D7A4E] uppercase tracking-wider mb-4">
              GROW-HOW® RESOURCES
            </p>
            <h2 className="text-5xl text-[#2D5A3D] mb-6 leading-tight" style={{ fontFamily: 'Lora, serif' }}>
              We help your plants thrive
            </h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Straight to your living room, every Bloomscape plant comes with detailed Grow-How® care instructions and unlimited access to our team of plant experts.
            </p>

            {/* Features */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C8E6C9] flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-[#2D7A4E]" />
                </div>
                <span className="text-gray-700">Expertly grown</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C8E6C9] flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[#2D7A4E]" />
                </div>
                <span className="text-gray-700">Shipped with care</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C8E6C9] flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-[#2D7A4E]" />
                </div>
                <span className="text-gray-700">30 day guarantee</span>
              </div>
            </div>

            <button className="text-[#2D7A4E] hover:text-[#235F3D] flex items-center gap-2 group">
              <span className="uppercase tracking-wider text-sm">LEARN MORE ABOUT GROW-HOW</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {resources.map((resource) => {
            const Icon = resource.icon;
            return (
              <div key={resource.title} className="bg-[#F5F1ED] rounded-2xl overflow-hidden group cursor-pointer">
                <div className="h-64 overflow-hidden">
                  <img
                    src={resource.image}
                    alt={resource.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-8">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[#2D7A4E]" />
                  </div>
                  <h3 className="text-xl text-[#2D5A3D] mb-3" style={{ fontFamily: 'Lora, serif' }}>
                    {resource.title}
                  </h3>
                  <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                    {resource.description}
                  </p>
                  <button className="text-[#2D7A4E] hover:text-[#235F3D] flex items-center gap-2 text-sm group-hover:gap-3 transition-all">
                    <span className="uppercase tracking-wider">{resource.link}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
