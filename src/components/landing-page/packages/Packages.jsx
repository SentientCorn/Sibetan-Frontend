import React, { useState } from 'react';
import SectionHeader from '../../ui/SectionHeader';
import Modal from '../../ui/Modal';
import { usePackages } from '../../../hooks/usePackages';
import PackageCard from './PackageCard';
import PackageModalContent from './PackageModalContent';

const Packages = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [activeTab, setActiveTab] = useState('ALL');
  const { packages: packagesData, loading, error } = usePackages();

  const filteredPackages = packagesData?.filter(pkg => {
    if (activeTab === 'ALL') return true;
    return pkg.type === activeTab;
  }) || [];

  return (
    <section id="packages" className="py-20 px-6 md:px-12 lg:px-12 xl:px-20 bg-surface-card">
      <div className="max-w-[1440px] mx-auto">

        {/* Header Section from reusable UI component */}
        <SectionHeader
          pillText="Menginap & Berwisata"
          title="Paket Wisata & Akomodasi"
          description="Nikmati pengalaman wisata terbaik dengan paket perjalanan dan pilihan akomodasi nyaman di Desa Sibetan."
        />

        {/* Tabs for Filtering */}
        {!loading && !error && (
          <div className="flex flex-wrap justify-center gap-2.5 mb-12">
            {[
              { id: 'ALL', label: 'Semua' },
              { id: 'WISATA', label: 'Wisata' },
              { id: 'AKOMODASI', label: 'Akomodasi' },
              { id: 'WISATA_AKOMODASI', label: 'Wisata & Akomodasi' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-full font-jakarta text-sm transition-all duration-300 cursor-pointer ${activeTab === tab.id
                    ? 'bg-[#1B3461] text-white font-bold shadow-md shadow-[#1B3461]/20 scale-105'
                    : 'bg-white text-slate-600 font-semibold hover:bg-accent-light hover:text-brand border border-slate-200'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-slate-500 font-medium">Memuat paket wisata...</div>
        ) : error ? (
          <div className="text-center py-12 text-rose-500 font-medium">Gagal memuat paket wisata: {error}</div>
        ) : filteredPackages.length === 0 ? (
          <div className="text-center py-12 text-slate-500 font-medium bg-white rounded-2xl border border-slate-100">Coming soon</div>
        ) : (
          /* Cards Grid */
          <div className={`grid gap-6 xl:gap-8 ${filteredPackages.length === 1
              ? 'grid-cols-1 max-w-sm sm:max-w-md mx-auto'
              : filteredPackages.length === 2
                ? 'grid-cols-1 sm:grid-cols-2 max-w-3xl md:max-w-4xl mx-auto'
                : filteredPackages.length === 3
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto'
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
            }`}>
            {filteredPackages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                onClickDetail={() => setSelectedPackage(pkg)}
              />
            ))}
          </div>
        )}

      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedPackage}
        onClose={() => setSelectedPackage(null)}
      >
        {selectedPackage && (
          <PackageModalContent pkg={selectedPackage} />
        )}
      </Modal>
    </section>
  );
};

export default Packages;
