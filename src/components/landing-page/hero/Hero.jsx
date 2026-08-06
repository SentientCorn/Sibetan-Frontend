import React, { useState, useEffect } from 'react';
import { useHeroes } from '../../../hooks/useHeroes';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Hero = () => {
  const { heroes, loading, error } = useHeroes();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset index if heroes list changes and current index becomes out of bounds
  useEffect(() => {
    if (heroes && heroes.length > 0 && currentIndex >= heroes.length) {
      setCurrentIndex(0);
    }
  }, [heroes, currentIndex]);

  // Auto slide if there are multiple heroes
  useEffect(() => {
    if (!heroes || heroes.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroes.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroes]);

  const activeHero = heroes && heroes.length > 0 ? heroes[currentIndex] : null;
  const heroBg = activeHero?.imageUrl || (activeHero?.images && activeHero.images.length > 0 ? activeHero.images[0] : null) || null;
  const title = activeHero?.title || "Desa Sibetan";
  const subtitle = activeHero?.subtitle || "Karangasem, Bali";
  const description = activeHero?.description || "Desa penghasil salak terbaik di Bali, kaya akan tradisi Hindu, alam yang asri, dan keramahan warga yang tulus.";

  const handlePrev = () => {
    if (!heroes || heroes.length === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? heroes.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (!heroes || heroes.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % heroes.length);
  };

  return (
    <section className="relative w-full h-screen flex items-center px-6 md:px-12 lg:px-24 overflow-hidden bg-slate-900">
      {/* Background Image with Transition */}
      {heroBg && (
        <img
          key={heroBg}
          src={heroBg}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-700 ease-in-out"
        />
      )}

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand via-brand/70 to-transparent z-0"></div>

      <div className="relative z-10 max-w-3xl">
        {/* Top greeting */}
        <p className="font-jakarta text-sm md:text-base font-semibold tracking-wider text-gray-300 mb-2 uppercase">
          Selamat Datang Di
        </p>

        {/* Main Title - Poppins */}
        <h1 className="font-poppins text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-2 transition-all duration-300">
          {title}
        </h1>

        {/* Subtitle - Poppins */}
        <h2 className="font-poppins text-2xl md:text-3xl lg:text-4xl font-semibold text-white/90 mb-6 transition-all duration-300">
          {subtitle}
        </h2>

        {/* Description - Plus Jakarta Sans */}
        <p className="font-jakarta text-base md:text-lg text-gray-300 leading-relaxed mb-8 max-w-2xl">
          {description}
        </p>

        {/* Buttons - Plus Jakarta Sans */}
        <div className="flex flex-col sm:flex-row gap-4">
          <a href="#destinations" className="font-jakarta bg-white text-brand hover:bg-gray-100 font-semibold px-8 py-3 rounded-lg shadow-md transition-all duration-300 text-center inline-block">
            Jelajahi Wisata
          </a>
          <a href="#packages" className="font-jakarta bg-white/10 border border-white/40 text-white hover:bg-white/20 font-semibold px-8 py-3 rounded-lg backdrop-blur-sm transition-all duration-300 text-center inline-block">
            Paket & Akomodasi
          </a>
        </div>
      </div>

      {/* Carousel Navigation Arrows & Indicators if multiple slides exist */}
      {heroes && heroes.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            aria-label="Previous Slide"
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/60 text-white p-3 rounded-full backdrop-blur-sm transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next Slide"
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/60 text-white p-3 rounded-full backdrop-blur-sm transition-colors cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {heroes.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIndex ? 'w-8 bg-white' : 'w-2.5 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default Hero;
