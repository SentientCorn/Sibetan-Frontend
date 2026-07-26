import React from 'react';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/landing-page/hero/Hero';
import Destinations from '../components/landing-page/destinations/Destinations';
import Traditions from '../components/landing-page/traditions/Traditions';
import Packages from '../components/landing-page/packages/Packages';
import VillageMap from '../components/landing-page/map/VillageMap';
import Contact from '../components/landing-page/contact/Contact';
import Footer from '../components/layout/Footer';
import ScrollToTop from '../components/ui/ScrollToTop';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />
      <Hero />
      <Destinations />
      <Traditions />
      <Packages />
      <VillageMap />
      <Contact />
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default LandingPage;
