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
    <div className="group flex items-start gap-5 cursor-pointer">
      <div className="flex-shrink-0 w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center transition-colors duration-500 group-hover:border-[#2D7A4E] group-hover:bg-[#F5F1ED]">
        <Icon className="w-5 h-5 text-[#2D5A3D] opacity-80 transition-colors duration-500" strokeWidth={1.5} />
      </div>
      <div className="flex-1 pt-1">
        <h4 className="text-gray-900 font-medium tracking-widest uppercase text-[11px] mb-1.5 transition-colors duration-500 group-hover:text-[#2D7A4E]">{feature.title}</h4>
        <p className="text-gray-500 text-sm font-light leading-relaxed">
          {feature.description}
        </p>
      </div>
    </div>
  );
}
