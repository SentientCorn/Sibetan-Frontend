import React from 'react';
import ImageWithSkeleton from '../../ui/ImageWithSkeleton';

const truncateText = (text, maxLength = 110) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

const PackageCard = ({ pkg, onClickDetail }) => {
  const getTypeLabel = (type) => {
    if (type === 'AKOMODASI') return 'Akomodasi';
    if (type === 'WISATA_AKOMODASI') return 'Wisata & Akomodasi';
    return 'Wisata'; // WISATA atau default
  };

  const getTypeColor = (type) => {
    if (type === 'AKOMODASI') return 'bg-emerald-500 text-white';
    if (type === 'WISATA_AKOMODASI') return 'bg-violet-500 text-white';
    return 'bg-accent text-white'; // default Wisata (kuning/orange)
  };

  return (
    <div 
      onClick={onClickDetail}
      className="bg-surface-card rounded-xl overflow-hidden border border-gray-100 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow duration-300 cursor-pointer group"
    >
      {/* Image Container with Skeleton */}
      <ImageWithSkeleton
        src={pkg.image}
        alt={pkg.title}
        containerClassName="h-56 w-full"
      >
        {/* Type Tag (Top Left) */}
        <div className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1.5 rounded-full font-jakarta shadow-sm ${getTypeColor(pkg.type)}`}>
          {getTypeLabel(pkg.type)}
        </div>

        {/* Photo Count (Bottom Right) */}
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-jakarta">
          {pkg.photoCount} foto
        </div>
      </ImageWithSkeleton>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="font-poppins font-bold text-lg text-brand mb-2 leading-snug">
          {pkg.title}
        </h3>

        {/* Price */}
        <div className="font-jakarta text-accent font-bold text-base mb-2">
          {pkg.price}
        </div>

        {/* Duration / Type Pill */}
        <div className="mb-4">
          <span className="inline-block bg-surface text-content-main text-xs font-jakarta px-2.5 py-1 rounded border border-gray-100">
            {pkg.durationOrType}
          </span>
        </div>

        {/* Description */}
        <p className="font-jakarta text-content-main text-sm leading-relaxed mb-6 flex-grow line-clamp-3 text-justify">
          {truncateText(pkg.description, 110)}
        </p>

        {/* Divider */}
        <div className="border-t border-gray-100 pt-4 mt-auto"></div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className="font-jakarta text-xs text-content-muted font-medium">
            {pkg.contactPerson}
          </span>
          <button 
            onClick={onClickDetail}
            className="flex items-center gap-1 text-accent hover:text-accent/80 font-jakarta text-sm font-semibold transition-colors"
          >
            Detail <span className="text-[10px] ml-0.5">&rsaquo;</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
