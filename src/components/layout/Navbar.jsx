import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, LogOut, LayoutDashboard, ChevronDown, Home } from 'lucide-react';
import { API_BASE } from '../../services/api';
import { useContact } from '../../hooks/useContact';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { contact } = useContact();

  const isHomePage = location.pathname === '/';

  // Auth state
  const token = localStorage.getItem('admin_token');
  const username = localStorage.getItem('admin_username');

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setLogoutLoading(true);
    setLogoutMessage('Memproses logout...');
    try {
      await fetch(`${API_BASE}/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch (err) {}
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_username');
    setLogoutLoading(false);
    setIsDropdownOpen(false);
    navigate('/');
    setTimeout(() => setLogoutMessage(null), 3000);
  };

  const navLinks = [
    { name: 'Beranda', href: '#' },
    { name: 'Wisata', href: '#destinations' },
    { name: 'Kesenian & Adat', href: '#traditions' },
    { name: 'Paket & Akomodasi', href: '#packages' },
    { name: 'Kontak', href: '#contact' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[#1B3461] shadow-lg' : 'bg-[#1B3461]'
      }`}
    >
      {logoutMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-fadeIn">
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {logoutMessage}
          </div>
        </div>
      )}

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-12 xl:px-20">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-white/20 bg-white/10 flex items-center justify-center shrink-0 overflow-hidden">
              <img src="/favicon.png" alt="Desa Sibetan" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-poppins font-bold tracking-widest text-base sm:text-lg text-white leading-none mb-1">
                DESA SIBETAN
              </h1>
              <p className="font-jakarta text-white/60 text-[10px] sm:text-xs line-clamp-1 max-w-[200px]">
                {contact?.address?.split(',')[1]?.trim() || "Kec. Bebandem - Karangasem"}
              </p>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            <ul className="flex items-center gap-6 font-jakarta text-sm font-medium text-white/90">
              {navLinks.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="hover:text-white transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
            
            {/* Auth Menu Desktop (only visible when logged in) */}
            {token && (
              <div className="relative ml-2" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg border border-white/20 transition-colors font-jakarta text-sm font-semibold cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span>{username || 'Admin'}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden py-1 animate-fadeIn">
                    <Link 
                      to="/admin" 
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand font-medium transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dasbor Admin
                    </Link>
                    {!isHomePage && (
                      <Link 
                        to="/" 
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand font-medium transition-colors"
                      >
                        <Home className="w-4 h-4" />
                        Kembali ke Laman
                      </Link>
                    )}
                    <button 
                      disabled={logoutLoading}
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 font-medium transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {logoutLoading ? (
                        <div className="w-4 h-4 border-2 border-rose-600/30 border-t-rose-600 rounded-full animate-spin"></div>
                      ) : (
                        <LogOut className="w-4 h-4" />
                      )}
                      {logoutLoading ? 'Memproses...' : 'Logout'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden text-white p-2 cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#1B3461] border-t border-white/10 px-6 py-4">
          <ul className="flex flex-col gap-4 font-jakarta text-sm font-medium text-white/90">
            {navLinks.map((link, idx) => (
              <li key={idx}>
                <a 
                  href={link.href} 
                  className="block py-2 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              </li>
            ))}
            
            {/* Auth Menu Mobile (only visible when logged in) */}
            {token && (
              <li className="pt-4 border-t border-white/10">
                <div className="flex flex-col gap-2">
                  <div className="text-white/60 text-xs mb-1">Masuk sebagai: {username || 'Admin'}</div>
                  <Link 
                    to="/admin" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 py-2 text-white hover:text-brand-light transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dasbor Admin
                  </Link>
                  {!isHomePage && (
                    <Link 
                      to="/" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 py-2 text-white hover:text-brand-light transition-colors"
                    >
                      <Home className="w-4 h-4" />
                      Kembali ke Laman
                    </Link>
                  )}
                  <button 
                    disabled={logoutLoading}
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 py-2 text-rose-400 hover:text-rose-300 transition-colors text-left w-full disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {logoutLoading ? (
                      <div className="w-4 h-4 border-2 border-rose-400/30 border-t-rose-400 rounded-full animate-spin"></div>
                    ) : (
                      <LogOut className="w-4 h-4" />
                    )}
                    {logoutLoading ? 'Memproses...' : 'Logout'}
                  </button>
                </div>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
