import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, User, Menu, X, ArrowRight, Sparkles, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  variant?: 'floating' | 'sticky';
}

export const Navbar: React.FC<NavbarProps> = () => {
  const { totalItems, openCart, cartBounced, openSearch, currentPath, navigate } = useCart();
  const { profile, addresses, openAuthModal, openAccountDrawer } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (path: string) => {
    setMobileMenuOpen(false);
    if (path.startsWith('/#')) {
      const id = path.replace('/#', '');
      if (currentPath !== '/') {
        navigate('/');
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(path);
    }
  };

  const isHome = currentPath === '/';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 pointer-events-none ${
          scrolled || !isHome ? 'py-3' : 'py-5'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <nav
            id="main-navbar"
            aria-label="Navigasi Utama"
            className={`pointer-events-auto flex items-center justify-between px-5 sm:px-7 py-3 transition-all duration-300 rounded-full border ${
              scrolled || !isHome
                ? 'bg-[#FFFDF8]/95 backdrop-blur-md border-[#D9C7AE]/60 shadow-[0_8px_30px_rgb(36,26,20,0.08)]'
                : 'bg-[#FFFDF8]/90 backdrop-blur-sm border-[#D9C7AE]/40 shadow-[0_4px_20px_rgb(36,26,20,0.04)]'
            }`}
          >
            {/* Logo */}
            <button
              id="navbar-logo-btn"
              onClick={() => handleNavClick('/')}
              className="flex items-center group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CA9344] rounded-xl transition-transform active:scale-95"
              aria-label="Kawan Lokal Beranda"
            >
              <BrandLogo variant="horizontal" size="sm" />
            </button>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-7 text-sm font-medium text-[#6B5546]">
              <button
                id="nav-link-discover"
                onClick={() => handleNavClick('/discover')}
                className={`transition-colors hover:text-[#241A14] ${
                  currentPath === '/discover' ? 'text-[#241A14] font-semibold' : ''
                }`}
              >
                Discover
              </button>
              <button
                id="nav-link-articles"
                onClick={() => handleNavClick('/articles')}
                className={`transition-colors hover:text-[#241A14] ${
                  currentPath.startsWith('/article') ? 'text-[#241A14] font-semibold' : ''
                }`}
              >
                Artikel
              </button>
              <button
                id="nav-link-reviews"
                onClick={() => handleNavClick('/#reviews')}
                className="transition-colors hover:text-[#241A14]"
              >
                Reviews
              </button>
              <button
                id="nav-link-trending"
                onClick={() => handleNavClick('/#trending')}
                className="transition-colors hover:text-[#241A14]"
              >
                Trending
              </button>
              <button
                id="nav-link-categories"
                onClick={() => handleNavClick('/#categories')}
                className="transition-colors hover:text-[#241A14]"
              >
                Categories
              </button>
            </div>

            {/* Actions: Search, Cart, Profile, CTA */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                id="nav-search-btn"
                onClick={openSearch}
                aria-label="Cari makanan viral"
                className="p-2 sm:p-2.5 text-[#241A14] hover:text-[#E85D32] hover:bg-[#F8F5EF] rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D32]"
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                id="nav-cart-btn"
                onClick={openCart}
                aria-label={`Keranjang Belanja (${totalItems} item)`}
                className="relative p-2 sm:p-2.5 text-[#241A14] hover:text-[#E85D32] hover:bg-[#F8F5EF] rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D32]"
              >
                <motion.div
                  animate={cartBounced ? { scale: [1, 1.35, 0.9, 1.15, 1], rotate: [0, -10, 10, -5, 0] } : { scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <ShoppingBag className="w-5 h-5" />
                </motion.div>

                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 bg-[#E85D32] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </button>

              {profile ? (
                <button
                  id="nav-profile-btn"
                  onClick={openAccountDrawer}
                  aria-label={`Akun Saya (${profile.displayName})`}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 bg-[#F8F5EF] hover:bg-[#241A14] hover:text-white text-[#241A14] rounded-full border border-[#D9C7AE]/60 transition-all text-xs font-bold"
                >
                  <div className="w-6 h-6 rounded-full bg-[#241A14] text-white flex items-center justify-center text-[10px] font-black">
                    {profile.displayName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:inline max-w-[85px] truncate">
                    {profile.displayName?.split(' ')[0]}
                  </span>
                </button>
              ) : (
                <button
                  id="nav-profile-btn"
                  onClick={() => openAuthModal('login')}
                  aria-label="Masuk ke Akun"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[#241A14] hover:text-[#E85D32] hover:bg-[#F8F5EF] rounded-full transition-colors text-xs font-bold border border-transparent hover:border-[#D9C7AE]/60"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Masuk</span>
                </button>
              )}

              {/* CTA button */}
              <button
                id="nav-cta-btn"
                onClick={() => handleNavClick('/discover')}
                className="hidden lg:flex items-center gap-2 pl-4 pr-3.5 py-2 bg-[#241A14] hover:bg-[#191614] text-white text-xs font-semibold rounded-full transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Jelajahi Sekarang</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D9C7AE]" />
              </button>

              {/* Mobile menu toggle */}
              <button
                id="nav-mobile-menu-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Menu"
                className="md:hidden p-2 text-[#241A14] hover:bg-[#F8F5EF] rounded-full transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-nav-drawer"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-20 z-40 bg-[#FFFDF8] border border-[#D9C7AE]/60 rounded-3xl p-6 shadow-2xl md:hidden"
          >
            {/* Brand Logo Card in Mobile Drawer */}
            <div className="flex justify-center pb-4 mb-2 border-b border-[#EADDCC]">
              <BrandLogo variant="card" size="xs" showTagline className="w-full bg-[#FAF5ED]" />
            </div>

            {/* User Account Bar in Mobile Drawer */}
            <div className="pb-3 mb-2 border-b border-[#EADDCC]">
              {profile ? (
                <div
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAccountDrawer();
                  }}
                  className="p-3 bg-[#FAF5ED] rounded-2xl border border-[#D9C7AE]/60 flex items-center justify-between cursor-pointer hover:bg-[#F2ECE1] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#241A14] text-white flex items-center justify-center font-bold text-xs">
                      {profile.displayName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-bold text-xs text-[#241A14] leading-tight">
                        {profile.displayName}
                      </p>
                      <p className="text-[10px] text-[#6B5546]">
                        {addresses.length} Alamat • Kelola Akun
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#CA9344]" />
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('login');
                  }}
                  className="w-full p-3 rounded-2xl bg-[#241A14] text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#E85D32] transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Masuk / Buat Akun Baru</span>
                </button>
              )}
            </div>

            <div className="flex flex-col gap-3 text-base font-semibold text-[#241A14]">
              <button
                onClick={() => handleNavClick('/')}
                className="flex items-center justify-between py-2 border-b border-[#F8F5EF] text-left"
              >
                <span>Beranda Toko</span>
                <span className="text-[#CA9344]">🌿</span>
              </button>
              <button
                onClick={() => handleNavClick('/discover')}
                className="flex items-center justify-between py-2 border-b border-[#F8F5EF] text-left"
              >
                <span>Katalog Makanan &amp; Bubuk Minuman</span>
                <ArrowRight className="w-4 h-4 text-[#6B5546]" />
              </button>
              <button
                onClick={() => handleNavClick('/#categories')}
                className="flex items-center justify-between py-2 border-b border-[#F8F5EF] text-left text-[#CA9344]"
              >
                <span className="flex items-center gap-2">
                  <span>🧋</span>
                  <span>Koleksi Bubuk Minuman Kafe</span>
                </span>
                <ArrowRight className="w-4 h-4 text-[#CA9344]" />
              </button>
              <button
                onClick={() => handleNavClick('/articles')}
                className="flex items-center justify-between py-2 border-b border-[#F8F5EF] text-left"
              >
                <span>Artikel &amp; Panduan Seduh</span>
                <ArrowRight className="w-4 h-4 text-[#6B5546]" />
              </button>
              <button
                onClick={() => handleNavClick('/#reviews')}
                className="flex items-center justify-between py-2 border-b border-[#F8F5EF] text-left"
              >
                <span>Latest Reviews</span>
                <ArrowRight className="w-4 h-4 text-[#6B5546]" />
              </button>
              <button
                onClick={() => handleNavClick('/#trending')}
                className="flex items-center justify-between py-2 border-b border-[#F8F5EF] text-left"
              >
                <span>Trending Right Now</span>
                <ArrowRight className="w-4 h-4 text-[#6B5546]" />
              </button>
              <button
                onClick={() => handleNavClick('/#creator')}
                className="flex items-center justify-between py-2 border-b border-[#F8F5EF] text-left"
              >
                <span>Tentang Reno (Creator)</span>
                <ArrowRight className="w-4 h-4 text-[#6B5546]" />
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openSearch();
                }}
                className="flex items-center gap-2 p-3 mt-2 bg-[#F8F5EF] rounded-xl text-[#6B5546] text-sm"
              >
                <Search className="w-4 h-4 text-[#E85D32]" />
                <span>Cari croissant, ramen, cheesecake...</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
