import { Link } from 'react-router-dom';

export const DetailHeader = () => (
  <div className="mx-auto mt-[82px] flex w-[90vw] max-w-[1720px] items-center justify-between pt-8">
    <Link
      to="/products-gifts"
      className="font-label text-[10px] font-bold uppercase tracking-[0.18em] text-[#5E6058] transition-colors hover:text-[#11110E]"
    >
      Back to products
    </Link>
    <span className="font-label text-[9px] uppercase tracking-[0.24em] text-[#797C73]">
      Specimen detail
    </span>
  </div>
);
