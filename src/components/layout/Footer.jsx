import React from 'react';
import { useContact } from '../../hooks/useContact';

const Footer = () => {
  const { contact } = useContact();
  
  return (
    <footer className="bg-[#1B3461] text-white pt-16 pb-6 px-6 md:px-12 lg:px-12 xl:px-20">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          
          {/* Brand & Description (Span 5 columns on desktop) */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full border border-white/20 bg-white/10 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h2 className="font-poppins font-bold tracking-widest text-lg leading-none mb-1">
                  DESA SIBETAN
                </h2>
                <p className="font-jakarta text-white/60 text-[10px] sm:text-xs line-clamp-1 max-w-[200px]">
                  {contact?.address?.split(',')[1]?.trim() || "Kec. Bebandem - Karangasem"}
                </p>
              </div>
            </div>
            <p className="font-jakarta text-white/80 text-sm leading-relaxed max-w-sm">
              Portal informasi wisata dan budaya Desa Sibetan. Menampilkan potensi alam dan kekayaan adat istiadat Bali.
            </p>
          </div>

          {/* Navigasi (Span 3 columns on desktop) */}
          <div className="md:col-span-3">
            <h3 className="font-jakarta font-semibold text-white mb-6">Navigasi</h3>
            <ul className="flex flex-col gap-4 font-jakarta text-sm text-white/80">
              <li><a href="#destinations" className="hover:text-white transition-colors">Destinasi Wisata</a></li>
              <li><a href="#traditions" className="hover:text-white transition-colors">Kesenian & Adat</a></li>
              <li><a href="#packages" className="hover:text-white transition-colors">Paket & Akomodasi</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Kontak Kami</a></li>
            </ul>
          </div>

          {/* Kontak (Span 4 columns on desktop) */}
          <div className="md:col-span-4">
            <h3 className="font-jakarta font-semibold text-white mb-6">Kontak</h3>
            <ul className="flex flex-col gap-4 font-jakarta text-sm text-white/80">
              <li>
                <p className="leading-relaxed">
                  {contact?.address || "Jl. Raya Sibetan, Kec. Bebandem, Kab. Karangasem, Bali 80861"}
                </p>
              </li>
              <li>{contact?.phone || "+62 812-3456-7890"}</li>
              <li>{contact?.website || "sibetan.desa.id"}</li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-6 text-center">
          <p className="font-jakarta text-white/60 text-xs sm:text-sm" dangerouslySetInnerHTML={{ __html: contact?.copyright || '&copy; 2026 Desa Sibetan. Dikembangkan oleh UGM.' }} />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
