import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import EditorialHero from '../../components/EditorialHero';
import { productAssetImages } from '../../lib/localImages';

const reportScopes = [
  { id: 'all', label: 'All', icon: 'dashboard', copy: 'Statistics, inventory, orders, and order items.' },
  { id: 'statistics', label: 'Statistics', icon: 'monitoring', copy: 'Summary totals, paid revenue, and stock health.' },
  { id: 'inventory', label: 'Inventory', icon: 'inventory_2', copy: 'Product listings, stock, pricing, tags, and model URLs.' },
  { id: 'orders', label: 'Orders', icon: 'receipt_long', copy: 'Customer orders, payments, shipping, and line items.' },
];

const reportFormats = [
  { id: 'json', label: 'JSON', icon: 'data_object', copy: 'Structured data for backup or development review.' },
  { id: 'csv', label: 'CSV', icon: 'table_view', copy: 'Spreadsheet-friendly rows for Excel or Google Sheets.' },
];

const ArchiveHeader = ({ onDownloadReport, reportDisabled = false }) => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportScope, setReportScope] = useState('all');
  const [reportFormat, setReportFormat] = useState('json');

  useEffect(() => {
    if (!isReportModalOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsReportModalOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isReportModalOpen]);

  const handleDownload = () => {
    onDownloadReport?.({ format: reportFormat, scope: reportScope });
    setIsReportModalOpen(false);
  };

  return (
    <div className="mb-12 lg:mb-16">
      <EditorialHero
        compact={true}
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
            <button
              type="button"
              onClick={() => setIsReportModalOpen(true)}
              disabled={reportDisabled}
              className="flex items-center justify-center gap-2 border border-[#FBF9F4]/35 px-6 py-3 font-label text-[10px] font-bold uppercase tracking-[0.18em] text-[#FBF9F4]/82 transition-colors hover:border-[#FBF9F4] hover:text-[#FBF9F4] disabled:cursor-not-allowed disabled:opacity-45"
            >
              <span className="material-symbols-outlined text-[15px]">download</span>
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

      <AnimatePresence>
        {isReportModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <Motion.button
              type="button"
              aria-label="Close report dialog"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsReportModalOpen(false)}
              className="absolute inset-0 cursor-default bg-[#071F1F]/60 backdrop-blur-sm"
            />
            <Motion.div
              initial={{ opacity: 0, y: 22, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-h-[calc(100vh-48px)] w-full max-w-3xl overflow-y-auto border border-[#D9DBCF] bg-[#FBF9F4] p-6 shadow-2xl shadow-black/25 sm:p-8"
              role="dialog"
              aria-modal="true"
              aria-labelledby="report-dialog-title"
            >
              <div className="flex items-start justify-between gap-5 border-b border-[#D9DBCF] pb-5">
                <div>
                  <p className="font-label text-[10px] font-bold uppercase tracking-[0.22em] text-[#785A1A]">
                    Admin Export
                  </p>
                  <h2 id="report-dialog-title" className="mt-2 font-headline text-4xl leading-none text-[#31332C]">
                    How would you like to generate the report?
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#31332C]/15 text-[#31332C] transition-colors hover:bg-[#31332C] hover:text-white"
                  aria-label="Close report dialog"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <div className="mt-6">
                <p className="font-label text-[10px] font-bold uppercase tracking-[0.18em] text-[#5E6058]">
                  What would you like to generate?
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {reportScopes.map((scope) => {
                    const isActive = reportScope === scope.id;

                    return (
                      <button
                        key={scope.id}
                        type="button"
                        onClick={() => setReportScope(scope.id)}
                        className={`flex min-h-[112px] gap-4 border p-4 text-left transition-colors ${
                          isActive
                            ? 'border-[#0F3A3A] bg-[#0F3A3A] text-white'
                            : 'border-[#D9DBCF] bg-white text-[#31332C] hover:border-[#785A1A]'
                        }`}
                        aria-pressed={isActive}
                      >
                        <span className={`material-symbols-outlined text-[24px] ${isActive ? 'text-[#C6E9E9]' : 'text-[#785A1A]'}`}>
                          {scope.icon}
                        </span>
                        <span>
                          <span className="block font-label text-[10px] font-bold uppercase tracking-[0.16em]">{scope.label}</span>
                          <span className={`mt-2 block font-body text-sm leading-5 ${isActive ? 'text-white/75' : 'text-[#5E6058]'}`}>
                            {scope.copy}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-7">
                <p className="font-label text-[10px] font-bold uppercase tracking-[0.18em] text-[#5E6058]">
                  Choose download format
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {reportFormats.map((format) => {
                    const isActive = reportFormat === format.id;

                    return (
                      <button
                        key={format.id}
                        type="button"
                        onClick={() => setReportFormat(format.id)}
                        className={`flex items-start gap-4 border p-4 text-left transition-colors ${
                          isActive
                            ? 'border-[#785A1A] bg-[#F5F4ED] text-[#31332C]'
                            : 'border-[#D9DBCF] bg-white text-[#31332C] hover:border-[#785A1A]'
                        }`}
                        aria-pressed={isActive}
                      >
                        <span className="material-symbols-outlined text-[24px] text-[#785A1A]">{format.icon}</span>
                        <span>
                          <span className="block font-label text-[10px] font-bold uppercase tracking-[0.16em]">{format.label}</span>
                          <span className="mt-2 block font-body text-sm leading-5 text-[#5E6058]">{format.copy}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#D9DBCF] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="border border-[#31332C]/20 px-6 py-3 font-label text-[10px] font-bold uppercase tracking-[0.16em] text-[#31332C] transition-colors hover:bg-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="bg-[#31332C] px-6 py-3 font-label text-[10px] font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#0F3A3A]"
                >
                  Generate {reportFormat.toUpperCase()} Report
                </button>
              </div>
            </Motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ArchiveHeader;
