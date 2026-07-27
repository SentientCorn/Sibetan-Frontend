import React, { useState } from 'react';
import SectionHeader from '../../ui/SectionHeader';
import { useCultures } from '../../../hooks/useCultures';
import TraditionCard from './TraditionCard';

const Traditions = () => {
  const [showAll, setShowAll] = useState(false);
  
  const { cultures: traditionsData, loading, error } = useCultures();

  // Show only 2 items initially since the grid looks best with 2 large items, 
  // or show all if showAll is true
  const visibleTraditions = showAll ? traditionsData : traditionsData.slice(0, 2);

  return (
    <section id="traditions" className="py-20 px-6 md:px-12 lg:px-12 xl:px-20 bg-surface">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Header Section from reusable UI component */}
        <SectionHeader 
          pillText="Warisan Budaya"
          title="Kesenian & Adat Istiadat"
          description="Kehidupan spiritual dan budaya masyarakat Desa Sibetan yang kaya, diwariskan turun-temurun dan masih hidup hingga kini."
        />

        {loading ? (
          <div className="text-center py-12 text-slate-500 font-medium">Memuat budaya & kesenian...</div>
        ) : error ? (
          <div className="text-center py-12 text-rose-500 font-medium">Gagal memuat data: {error}</div>
        ) : traditionsData.length === 0 ? (
          <div className="text-center py-12 text-slate-500 font-medium bg-white rounded-2xl border border-slate-100">Coming soon</div>
        ) : (
          <>
            {/* Cards Grid */}
            <div className={`grid gap-8 xl:gap-12 mb-16 ${
              visibleTraditions.length === 1 
                ? 'grid-cols-1 max-w-xl md:max-w-2xl mx-auto' 
                : 'grid-cols-1 md:grid-cols-2'
            }`}>
              {visibleTraditions.map((tradition) => (
                <TraditionCard key={tradition.id} tradition={tradition} />
              ))}
            </div>

            {/* View All Button */}
            {traditionsData.length > 2 && (
              <div className="text-center">
                <button 
                  onClick={() => setShowAll(!showAll)}
                  className="inline-flex items-center gap-2 border-2 border-accent/20 text-accent hover:bg-accent-light font-jakarta font-semibold px-6 py-2.5 rounded-lg transition-colors"
                >
                  {showAll ? 'Tampilkan Lebih Sedikit' : `Lihat Semua Kesenian & Adat (${traditionsData.length})`}
                  <svg 
                    className={`w-4 h-4 transition-transform duration-300 ${showAll ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </section>
  );
};

export default Traditions;
