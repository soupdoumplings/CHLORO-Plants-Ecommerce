export const FeatureCard = ({ feature }) => (
  <div className="flex items-center gap-4 rounded-[8px] border border-[#11110E]/10 bg-[#FFFEFA] p-4">
    <span className="material-symbols-outlined text-[22px] text-[#2D7A4E]">
      {feature.icon || 'eco'}
    </span>
    <div className="min-w-0">
      <p className="font-label text-[9px] font-bold uppercase tracking-[0.16em] text-[#797C73]">
        {feature.title}
      </p>
      <p className="mt-1 truncate font-body text-sm text-[#31332C]">
        {feature.value || 'Not specified'}
      </p>
    </div>
  </div>
);
