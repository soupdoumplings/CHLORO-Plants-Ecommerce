import React from 'react';
import { Link } from 'react-router-dom';
import EditorialHero from '../../components/EditorialHero';
import { productAssetImages } from '../../lib/localImages';

const ArchiveHeader = () => {
  return (
    <div className="mb-12 lg:mb-16">
      <EditorialHero
        eyebrow="Botanical Asset Management"
        title="Admin"
        italic="Dashboard"
        copy="Move between customer orders, inventory, care tools, promotions, and statistics without the old endless scroll."
        image={productAssetImages.terrarium}
        imageAlt="Glass terrarium product"
        objectPosition="center"
        actions={(
          <>
            <Link to="/admin/promotions" className="flex items-center justify-center gap-2 border border-[#FBF9F4]/65 px-6 py-3 font-label text-[10px] font-bold uppercase tracking-[0.18em] text-[#FBF9F4] transition-colors hover:bg-[#FBF9F4] hover:text-[#0F3A3A]">
              <span className="material-symbols-outlined text-[15px]">sell</span>
              Promotions
            </Link>
            <Link to="/admin/add-plant" className="flex items-center justify-center gap-2 bg-[#FBF9F4] px-6 py-3 font-label text-[10px] font-bold uppercase tracking-[0.18em] text-[#0F3A3A] transition-colors hover:bg-[#C6E9E9]">
              Add Inventory Item
            </Link>
            <button type="button" className="border border-[#FBF9F4]/35 px-6 py-3 font-label text-[10px] font-bold uppercase tracking-[0.18em] text-[#FBF9F4]/82 transition-colors hover:border-[#FBF9F4] hover:text-[#FBF9F4]">
              Generate Report
            </button>
          </>
        )}
        meta={[
          { label: 'Orders', value: 'Queue' },
          { label: 'Inventory', value: 'Live' },
          { label: 'Stats', value: 'Paid' },
        ]}
      />
    </div>
  );
};

export default ArchiveHeader;
