import { Droplets, Sun, Heart, Cat } from "lucide-react";

const iconMap = {
  watering: Droplets,
  light: Sun,
  benefit: Heart,
  "pet-friendly": Cat,
};

export function FeatureCard({ feature }) {
  const Icon = iconMap[feature.icon];

  return (
    <div className="group bg-white rounded-2xl p-5 flex items-start gap-4 shadow-[0_4px_20px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-shadow cursor-pointer border border-gray-100">
      <div className="flex-shrink-0 w-12 h-12 bg-[#C8E6C9]/50 rounded-xl flex items-center justify-center group-hover:bg-[#2D7A4E] transition-colors">
        <Icon className="w-6 h-6 text-[#2D5A3D] group-hover:text-white transition-colors" />
      </div>
      <div className="flex-1 min-w-0 pt-1">
        <h4 className="text-gray-900 font-bold text-[15px] mb-1.5">{feature.title}</h4>
        <p className="text-gray-500 text-[13px] leading-relaxed line-clamp-2">
          {feature.description}
        </p>
      </div>
    </div>
  );
}
