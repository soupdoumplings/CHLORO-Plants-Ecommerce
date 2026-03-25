import { ArrowRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#2D5A3D] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-b border-white/20 pb-12">
          {/* Column 1 - Newsletter */}
          <div>
            <h3 className="text-4xl mb-4 text-[#f5dcc3]" style={{ fontFamily: '"Ingrid Darling", cursive', fontWeight: 300 }}>
              Petals and Pots
            </h3>
            <p className="text-sm text-white/80 mb-6 leading-relaxed">
              Stay in the loop with special offers, plant-parenting tips, and more fresh news.
            </p>
            <div className="flex max-w-sm">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 rounded-l bg-white/10 border border-white/20 focus:outline-none focus:border-[#f5dcc3] text-sm text-white placeholder-white/50"
              />
              <button className="bg-[#f5dcc3] text-[#2D5A3D] px-5 py-3 rounded-r hover:bg-white transition-colors flex items-center justify-center">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Column 2 - Company */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider mb-6 text-[#f5dcc3]">COMPANY</h3>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="text-white/80 hover:text-white transition-colors">Our Story</a></li>
              <li><a href="#" className="text-white/80 hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="text-white/80 hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Column 3 - Support */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider mb-6 text-[#f5dcc3]">SUPPORT</h3>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="text-white/80 hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="text-white/80 hover:text-white transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="text-white/80 hover:text-white transition-colors">Track Your Order</a></li>
            </ul>
          </div>

          {/* Column 4 - Socials */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider mb-6 text-[#f5dcc3]">FOLLOW US</h3>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="text-white/80 hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" className="text-white/80 hover:text-white transition-colors">TikTok</a></li>
              <li><a href="#" className="text-white/80 hover:text-white transition-colors">Pinterest</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-white/50">
          <p>© 2026 Petals and Pots. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
