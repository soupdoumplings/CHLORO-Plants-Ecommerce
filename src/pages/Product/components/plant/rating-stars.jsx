export const RatingStars = ({ rating = 5 }) => {
  const roundedRating = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1 text-[#D8B56D]" aria-label={`${roundedRating} out of 5 rating`}>
        {Array.from({ length: 5 }).map((_, index) => (
          <span key={index} className="material-symbols-outlined text-[18px]">
            {index < roundedRating ? 'star' : 'star_outline'}
          </span>
        ))}
      </div>
      <span className="font-label text-[9px] font-bold uppercase tracking-[0.16em] text-[#797C73]">
        Care rated
      </span>
    </div>
  );
};
