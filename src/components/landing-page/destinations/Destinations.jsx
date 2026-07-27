import React, { useState } from 'react';
import SectionHeader from '../../ui/SectionHeader';
import Modal from '../../ui/Modal';
import { useDestinations } from '../../../hooks/useDestinations';
import DestinationCard from './DestinationCard';
import DestinationModalContent from './DestinationModalContent';

const Destinations = () => {
  const [showAll, setShowAll] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);
  
  const { destinations: destinationsData, loading, error } = useDestinations();

  // Show only 3 items initially, or all if showAll is true
  const visibleDestinations = showAll ? destinationsData : destinationsData.slice(0, 3);

  return (
    <section id="destinations" className="py-20 px-6 md:px-12 lg:px-12 xl:px-20 bg-surface-card">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Header Section */}
        <SectionHeader 
          pillText="Destinasi Unggulan"
          title="Jelajah Desa Sibetan"
          description="Temukan pesona alam dan wisata unik Desa Sibetan! Dari kebun salak yang rindang hingga panorama perbukitan Karangasem yang memukau."
        />

        {loading ? (
          <div className="text-center py-12 text-slate-500 font-medium">Memuat destinasi...</div>
        ) : error ? (
          <div className="text-center py-12 text-rose-500 font-medium">Gagal memuat destinasi: {error}</div>
        ) : destinationsData.length === 0 ? (
          <div className="text-center py-12 text-slate-500 font-medium bg-white rounded-2xl border border-slate-100">Coming soon</div>
        ) : (
          <>
            {/* Cards Grid */}
            <div className={`grid gap-8 xl:gap-12 mb-16 ${
              visibleDestinations.length === 1 
                ? 'grid-cols-1 max-w-md md:max-w-lg mx-auto' 
                : visibleDestinations.length === 2 
                ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' 
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
              {visibleDestinations.map((destination) => (
                <DestinationCard 
                  key={destination.id} 
                  destination={destination} 
                  onClickDetail={() => setSelectedDestination(destination)}
                />
              ))}
            </div>

            {/* View All Button */}
            {destinationsData.length > 3 && (
              <div className="text-center">
                <button 
                  onClick={() => setShowAll(!showAll)}
                  className="inline-flex items-center gap-2 border-2 border-accent/20 text-accent hover:bg-accent-light font-jakarta font-semibold px-6 py-2.5 rounded-lg transition-colors"
                >
                  {showAll ? 'Tampilkan Lebih Sedikit' : `Lihat Semua Destinasi (${destinationsData.length})`}
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

      {/* Detail Modal */}
      <Modal 
        isOpen={!!selectedDestination} 
        onClose={() => setSelectedDestination(null)}
      >
        {selectedDestination && (
          <DestinationModalContent destination={selectedDestination} />
        )}
      </Modal>
    </section>
  );
};

export default Destinations;
