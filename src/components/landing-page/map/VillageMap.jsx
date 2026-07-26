import React from 'react';
import SectionHeader from '../../ui/SectionHeader';
import mapDesaImg from '../../../assets/MapDesa.webp';

const VillageMap = () => {
  return (
    <section id="village-map" className="py-10 md:py-12 px-6 md:px-12 lg:px-12 xl:px-20 bg-surface border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <SectionHeader 
          pillText="PETA DESA"
          title="Peta Wilayah Desa Wisata Sibetan"
          description="Peta visual tata guna lahan dan batas wilayah Desa Wisata Sibetan."
        />

        <div className="mt-8 flex flex-col items-center">
          <div className="w-full bg-white p-3 md:p-4 rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <img 
              src={mapDesaImg} 
              alt="Peta Desa Wisata Sibetan" 
              className="w-full h-auto object-contain rounded-xl"
              loading="lazy"
            />
          </div>
          
          <p className="mt-3 text-xs md:text-sm text-gray-500 font-jakarta text-center italic">
            Dibuat oleh KKN PPM UGM Arunika Karangasem Periode II 2026
          </p>
        </div>
      </div>
    </section>
  );
};

export default VillageMap;
