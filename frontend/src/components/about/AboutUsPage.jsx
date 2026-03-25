import { Header } from "../layout/Header";
import { Footer } from "../layout/Footer";
import { Leaf, Sun, Heart } from "lucide-react";

export function AboutUsPage({ onNavigate }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header onNavigate={onNavigate} />

      <main className="flex-grow">
        {/* Editorial Hero Section */}
        <section className="relative h-[70vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1545228515-3eb7e35b71db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw3fHxtb25zdGVyYSUyMHBsYW50JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzc0NDYzNTM1fDA&ixlib=rb-4.1.0&q=80&w=1920" 
              alt="Lush monstera leaves"
              className="w-full h-full object-cover transform transition-transform duration-[3000ms] hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30"></div>
          </div>
          <div className="relative z-10 text-center px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/90 mb-6 drop-shadow-md">
              OUR PHILOSOPHY
            </p>
            <h1 className="text-6xl md:text-8xl text-white font-medium drop-shadow-lg" style={{ fontFamily: 'Lora, serif' }}>
              Rooted in Nature
            </h1>
          </div>
        </section>

        {/* The Story Section - 50/50 Split */}
        <section className="py-24 md:py-32 px-6 md:px-12 xl:px-20 max-w-[1600px] mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="flex-1 lg:pr-12">
              <p className="text-xs font-bold text-[#2D5A3D]/70 uppercase tracking-[0.2em] mb-6">
                THE BEGINNING
              </p>
              <h2 className="text-4xl md:text-5xl text-[#2D5A3D] mb-10 leading-tight" style={{ fontFamily: 'Lora, serif' }}>
                Every space deserves a touch of quiet beauty.
              </h2>
              <div className="space-y-8 text-gray-500 font-light text-lg leading-[1.8]">
                <p>
                  At Petals & Pots, what started as a simple love for cultivating houseplants has grown into a curated collection of greenery designed to bring life, balance, and calm into your everyday surroundings. 
                </p>
                <p>
                  We believe that plants are more than just decor; they are living elements that transform the energy of a room. Our mission is to bridge the gap between nature and modern living spaces, hand-selecting each plant for its unique architectural beauty and ability to thrive indoors.
                </p>
              </div>
            </div>
            
            <div className="flex-1 w-full">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-[0_4px_40px_rgba(0,0,0,0.06)]">
                <img 
                  src="https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxM3x8Ym90YW5pY2FsJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzc0NDYzNTgyfDA&ixlib=rb-4.1.0&q=80&w=1080" 
                  alt="Elegant botanical interior"
                  className="w-full h-full object-cover transform transition-transform duration-[2000ms] hover:scale-105"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="py-24 md:py-32 bg-[#F5F1ED]">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl text-[#2D5A3D] mb-6" style={{ fontFamily: 'Lora, serif' }}>
                Our Core Values
              </h2>
              <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
                The principles that guide our curation and care.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
              {/* Value 1 */}
              <div className="text-center group">
                <div className="w-16 h-16 mx-auto rounded-full bg-white border border-gray-200 flex items-center justify-center mb-6 transition-colors duration-500 group-hover:border-[#2D7A4E] shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                  <Leaf className="w-7 h-7 text-[#2D5A3D] opacity-80" strokeWidth={1.5} />
                </div>
                <h3 className="text-sm font-bold tracking-[0.15em] uppercase text-gray-900 mb-4 group-hover:text-[#2D7A4E] transition-colors">Sustainable Growth</h3>
                <p className="text-gray-500 font-light leading-relaxed">
                  Partnering entirely with eco-conscious nurseries that prioritize organic soil and ethical growing practices.
                </p>
              </div>

              {/* Value 2 */}
              <div className="text-center group">
                <div className="w-16 h-16 mx-auto rounded-full bg-white border border-gray-200 flex items-center justify-center mb-6 transition-colors duration-500 group-hover:border-[#2D7A4E] shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                  <Sun className="w-7 h-7 text-[#2D5A3D] opacity-80" strokeWidth={1.5} />
                </div>
                <h3 className="text-sm font-bold tracking-[0.15em] uppercase text-gray-900 mb-4 group-hover:text-[#2D7A4E] transition-colors">Curated Aesthetics</h3>
                <p className="text-gray-500 font-light leading-relaxed">
                  Hand-selecting plants that offer striking architectural shapes and lush textures to elevate your home.
                </p>
              </div>

              {/* Value 3 */}
              <div className="text-center group">
                <div className="w-16 h-16 mx-auto rounded-full bg-white border border-gray-200 flex items-center justify-center mb-6 transition-colors duration-500 group-hover:border-[#2D7A4E] shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                  <Heart className="w-7 h-7 text-[#2D5A3D] opacity-80" strokeWidth={1.5} />
                </div>
                <h3 className="text-sm font-bold tracking-[0.15em] uppercase text-gray-900 mb-4 group-hover:text-[#2D7A4E] transition-colors">Expert Care</h3>
                <p className="text-gray-500 font-light leading-relaxed">
                  Providing lifelong support and detailed guides to ensure your botanical investment continues to thrive.
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
