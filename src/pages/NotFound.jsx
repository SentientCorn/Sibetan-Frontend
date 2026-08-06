import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass, MapPin } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="h-screen w-full bg-slate-50 flex items-center justify-center px-6 font-jakarta relative overflow-hidden">
      {/* Decorative Light Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100/70 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-10 left-10 w-72 h-72 bg-sky-100/50 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-2xl w-full text-center relative z-10">
        {/* Glowing 404 Light Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 font-mono text-sm font-semibold tracking-wider uppercase mb-6 shadow-xs">
          <Compass className="w-4 h-4 text-blue-600 animate-spin-slow" />
          <span>404 - Page Not Found</span>
        </div>

        {/* Big Display 404 Text */}
        <h1 className="font-poppins text-7xl sm:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#1B3461] via-blue-700 to-sky-600 tracking-tight leading-none mb-4">
          404
        </h1>

        {/* Title */}
        <h2 className="font-poppins text-2xl sm:text-3xl font-bold text-[#1B3461] mb-4">
          Halaman Tidak Ditemukan
        </h2>

        {/* Description */}
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8 max-w-xl mx-auto">
          Sepertinya Anda tersesat saat menjelajahi indahnya Desa Sibetan. Halaman yang Anda tuju tidak ditemukan atau telah dipindahkan.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1B3461] hover:bg-[#152a4f] text-white font-semibold px-7 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <Home className="w-5 h-5" />
            <span>Kembali ke Halaman Utama</span>
          </Link>

          <a
            href="/#destinations"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-blue-50 border border-blue-200 text-[#1B3461] font-semibold px-7 py-3.5 rounded-xl shadow-2xs hover:shadow-xs transition-all duration-300 cursor-pointer"
          >
            <MapPin className="w-5 h-5 text-amber-500" />
            <span>Jelajahi Wisata</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
