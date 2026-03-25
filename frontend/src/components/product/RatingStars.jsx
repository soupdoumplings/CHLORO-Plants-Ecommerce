import { Star } from "lucide-react";

export function RatingStars({ rating, showValue = true }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm inline-flex border border-gray-100">
      {showValue && (
        <span className="text-gray-900 text-lg font-bold pr-3 border-r border-gray-200">
          {rating.toFixed(1)}
        </span>
      )}
      <div className="flex gap-1.5 pl-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < fullStars
                ? "fill-[#2D7A4E] text-[#2D7A4E]"
                : i === fullStars && hasHalfStar
                  ? "fill-[#2D7A4E]/50 text-[#2D7A4E]"
                  : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
