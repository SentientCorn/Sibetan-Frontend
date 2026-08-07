import React, { useState } from 'react';
import ImageWithSkeleton from '../../ui/ImageWithSkeleton';

const DestinationModalContent = ({ destination }) => {
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  const images = destination.images || [destination.image];

  const formatWhatsAppNumber = (phone) => {
    if (!phone) return '';
    let cleaned = String(phone).replace(/[^0-9]/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.slice(1);
    }
    return cleaned;
  };

  const contactName = destination.contactPerson || destination.contactName || destination.contact?.name || '';
  const contactPhone = destination.whatsapp || destination.contactPhone || destination.contact?.phone || '';
  const contactNote = destination.contactNote || destination.contact?.note || '';
  const whatsappNumber = formatWhatsAppNumber(contactPhone);
  const hasContact = Boolean(contactName || contactPhone || contactNote);

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

        {/* Contact Info */}
        {hasContact && (
          <div className="bg-surface rounded-xl p-5 border border-gray-100 mb-8">
            <h4 className="font-jakarta font-bold text-accent text-sm mb-4 uppercase tracking-wide">
              Informasi Kontak
            </h4>
            
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-lg shrink-0">
                {(contactName || 'P').charAt(0).toUpperCase()}
              </div>
              <div>
                {contactName && (
                  <h5 className="font-poppins font-bold text-brand">{contactName}</h5>
                )}
                {contactPhone && (
                  <p className="font-jakarta text-content-muted text-sm mb-2">{contactPhone}</p>
                )}
                {contactNote && (
                  <p className="font-jakarta text-content-main text-sm">
                    {contactNote}
                  </p>
                )}
              </div>
            </div>
            
            {whatsappNumber && (
              <a 
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-jakarta font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12c0 2.17.7 4.19 1.94 5.86L3 22l4.28-.94A9.953 9.953 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm5.48 13.56c-.24.68-1.4 1.3-1.95 1.36-.5.05-1.12.16-3.21-.7-2.52-1.03-4.14-3.6-4.26-3.76-.12-.16-1.02-1.36-1.02-2.59 0-1.23.64-1.83.87-2.07.23-.24.5-.3.67-.3h.48c.17 0 .4.06.63.63.24.58.7 1.7.76 1.83.06.13.1.28.02.43-.08.15-.12.24-.24.38-.12.14-.25.32-.35.43-.12.13-.26.27-.1.54.16.27.7 1.15 1.5 1.87.97.87 1.8 1.14 2.07 1.27.27.13.43.1.59-.08.16-.18.7-1.18.88-1.58.18-.4.36-.33.61-.24.25.1 1.58.75 1.85.88.27.14.45.2.52.33.07.13.07.76-.17 1.44z" clipRule="evenodd"/>
                </svg>
                Hubungi via WhatsApp
              </a>
            )}
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
