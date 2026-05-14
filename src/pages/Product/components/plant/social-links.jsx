export const SocialLinks = () => (
  <div className="flex items-center gap-2">
    {['share', 'favorite', 'bookmark'].map((icon) => (
      <button
        key={icon}
        type="button"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#11110E]/10 bg-white text-[#31332C] transition-colors hover:border-[#11110E]/35"
        title={icon}
      >
        <span className="material-symbols-outlined text-[17px]">{icon}</span>
      </button>
    ))}
  </div>
);
