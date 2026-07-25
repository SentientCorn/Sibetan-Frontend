import React, { useState } from 'react';
import ImageWithSkeleton from '../../ui/ImageWithSkeleton';

const truncateText = (text, maxLength = 110) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

const TraditionCard = ({ tradition }) => {
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  const [isExpanded, setIsExpanded] = useState(false);

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIdx((prev) => (prev === tradition.images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIdx((prev) => (prev === 0 ? tradition.images.length - 1 : prev - 1));
  };

  return (
    <div className="bg-surface-card rounded-xl overflow-hidden border border-gray-100 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow duration-300">
      {/* Image Carousel with Skeleton */}
      <ImageWithSkeleton
        key={currentImageIdx}
        src={tradition.images[currentImageIdx]}
        alt={tradition.title}
        containerClassName="h-72 sm:h-80 w-full group"
      >
        {/* Navigation Arrows (Visible on hover) */}
        {tradition.images.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm z-10"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm z-10"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
            
            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {tradition.images.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === currentImageIdx ? 'bg-white' : 'bg-white/50'}`}
                />
              ))}
            </div>
          </>
        )}
      </ImageWithSkeleton>

      {/* Content */}
      <div className="p-6 lg:p-8 flex flex-col flex-grow">
        {/* Tag Pill */}
        <div className="mb-4 flex flex-wrap gap-2">
          {tradition.tag ? tradition.tag.split(',').map((t, idx) => (
            <span key={idx} className="inline-block bg-accent-light text-accent font-jakarta text-xs font-semibold px-3 py-1 rounded-full">
              {t.trim()}
            </span>
          )) : (
            <span className="inline-block bg-accent-light text-accent font-jakarta text-xs font-semibold px-3 py-1 rounded-full">
              Budaya
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-poppins font-bold text-2xl text-brand mb-3">
          {tradition.title}
        </h3>

        {/* Description */}
        <div className={`font-jakarta text-content-main text-sm leading-relaxed mb-4 transition-all duration-500 text-justify ${isExpanded ? '' : 'line-clamp-3'}`}>
          {isExpanded ? tradition.description : truncateText(tradition.description, 110)}
        </div>

        {/* Read More Link */}
        <div className="mt-auto pt-2">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 text-accent hover:text-accent/80 font-jakarta text-sm font-semibold transition-colors"
          >
            {isExpanded ? 'Tutup Selengkapnya' : 'Baca Selengkapnya'}
            <svg 
              className={`w-4 h-4 mt-0.5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TraditionCard;
