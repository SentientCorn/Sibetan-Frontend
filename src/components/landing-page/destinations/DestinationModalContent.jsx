import React, { useState } from 'react';
import ImageWithSkeleton from '../../ui/ImageWithSkeleton';

const DestinationModalContent = ({ destination }) => {
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  const images = destination.images || [destination.image];

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="flex flex-col">
      {/* Header Image Carousel with Skeleton */}
      <ImageWithSkeleton
        key={currentImageIdx}
        src={images[currentImageIdx]}
        alt={destination.title}
        containerClassName="h-64 sm:h-80 w-full group"
      >
        {images.length > 1 && (
          <>
            <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm z-10">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm z-10">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {images.map((_, idx) => (
                <div key={idx} className={`w-2 h-2 rounded-full transition-colors ${idx === currentImageIdx ? 'bg-white' : 'bg-white/50'}`} />
              ))}
            </div>
          </>
        )}
      </ImageWithSkeleton>

      {/* Content */}
      <div className="p-6 sm:p-8">
        <h2 className="font-poppins font-bold text-3xl text-brand mb-4">
          {destination.title}
        </h2>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mb-6 text-content-main font-jakarta text-sm">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <span>{destination.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{destination.time}</span>
          </div>
        </div>

        <p className="font-jakarta text-content-main leading-relaxed mb-8 text-justify">
          {destination.fullDescription || destination.description}
        </p>

        {/* Tips */}
        {destination.tips && (
          <div className="bg-accent-light rounded-xl p-5 mb-8">
            <h4 className="font-jakarta font-bold text-accent text-sm mb-2 uppercase tracking-wide">
              Tips Berkunjung
            </h4>
            <p className="font-jakarta text-brand text-sm">
              {destination.tips}
            </p>
          </div>
        )}

        {/* Location Map */}
        {destination.mapEmbedUrl && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
              <h3 className="font-poppins font-bold text-xl text-brand">Lokasi</h3>
            </div>
            
            <div className="relative w-full h-64 sm:h-80 rounded-xl overflow-hidden border border-gray-200 mb-4 z-0 bg-slate-100 shadow-sm">
              <iframe 
                src={destination.mapEmbedUrl}
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              ></iframe>
            </div>

            {destination.mapLink && (
              <a 
                href={destination.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-accent hover:text-accent/80 font-jakarta text-sm font-semibold transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                Buka di Google Maps
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DestinationModalContent;
