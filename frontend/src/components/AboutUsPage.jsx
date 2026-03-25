import { Header } from "./Header";
import { Footer } from "./Footer";
import { ArrowRight } from "lucide-react";

export function AboutUsPage({ onNavigate }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#EDF2EE]">
      <Header onNavigate={onNavigate} />

      <main className="flex-grow w-full mx-auto px-6 md:px-12 xl:px-20 py-12 md:py-24 relative overflow-hidden">
        {/* Decorative Background Leaves */}
        <div className="absolute top-0 left-0 w-64 h-64 -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
          <img src="https://images.unsplash.com/photo-1611073062058-24409bb79948?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw3fHxtb25zdGVyYSUyMGxlYWZ8ZW58MXx8fHwxNzc0NDYyMDUwfDA&ixlib=rb-4.1.0&q=80&w=1080" alt="leaf" className="w-full h-full object-cover mix-blend-multiply filter blur-[2px]" />
        </div>
        <div className="absolute bottom-0 right-0 w-80 h-80 translate-x-1/3 translate-y-1/3 opacity-20 pointer-events-none">
          <img src="https://images.unsplash.com/photo-1611073062058-24409bb79948?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw3fHxtb25zdGVyYSUyMGxlYWZ8ZW58MXx8fHwxNzc0NDYyMDUwfDA&ixlib=rb-4.1.0&q=80&w=1080" alt="leaf" className="w-full h-full object-cover mix-blend-multiply filter blur-[2px]" />
        </div>

        {/* Main Dark Green Container */}
        <div className="relative w-full max-w-7xl mx-auto bg-[#23503D] rounded-[2.5rem] lg:rounded-[3.5rem] p-8 md:p-16 lg:p-24 shadow-2xl overflow-hidden flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          
          {/* Left Column: Text Content */}
          <div className="flex-1 text-center lg:text-left z-10">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl text-white mb-8 leading-[1.2] font-medium" style={{ fontFamily: 'Lora, serif' }}>
              At our company,<br />
              we turn <span className="text-[#A5CBA1] italic">your garden</span> dreams<br />
              into a living work of art
            </h1>

            <div className="space-y-6 text-[#EBF4EB]/90 mb-12" style={{ fontFamily: 'Lora, serif' }}>
              <p className="text-lg md:text-xl leading-relaxed italic font-light">
                At Petals & Pots, we believe that every space deserves a touch of nature's quiet beauty. What started as a simple love for plants has grown into a thoughtful collection of greenery designed to bring life, balance, and calm into your everyday surroundings.
              </p>
              <p className="text-lg md:text-xl leading-relaxed italic font-light">
                We bring nature closer to you. Our carefully selected plants are chosen for their beauty, simplicity, and ability to thrive in your space - helping you create a calm, refreshing environment everyday.
              </p>
            </div>

            <button 
              onClick={() => onNavigate && onNavigate('home')}
              className="inline-flex items-center gap-3 bg-transparent border-2 border-[#A5CBA1] text-[#A5CBA1] hover:bg-[#A5CBA1] hover:text-[#23503D] px-8 py-3 rounded-full text-sm font-semibold tracking-widest uppercase transition-all duration-500"
            >
              Explore Plants
            </button>
          </div>

          {/* Right Column: Image Collage */}
          <div className="flex-1 w-full max-w-2xl lg:max-w-none flex gap-4 h-[600px] z-10">
            {/* Left large vertical image */}
            <div className="w-[55%] h-full pt-12">
              <img 
                src="https://images.pexels.com/photos/7363158/pexels-photo-7363158.jpeg" 
                alt="Watering plants inside" 
                className="w-full h-full object-cover rounded-3xl border-4 border-[#3D6E57]/50 shadow-lg"
              />
            </div>
            {/* Right stacked images */}
            <div className="w-[45%] h-full flex flex-col gap-4 pb-12">
              <img 
                src="https://images.pexels.com/photos/4503273/pexels-photo-4503273.jpeg" 
                alt="Holding soil and plants" 
                className="w-full h-1/2 object-cover rounded-3xl border-4 border-[#3D6E57]/50 shadow-lg"
              />
              <img 
                src="https://images.pexels.com/photos/7656602/pexels-photo-7656602.jpeg" 
                alt="Seedling with Let yourself grow sign" 
                className="w-full h-1/2 object-cover rounded-3xl border-4 border-[#3D6E57]/50 shadow-lg"
              />
            </div>
          </div>
          
        </div>
      </main>

      <Footer />
    </div>
  );
}
