import React from 'react';
import { Instagram, Youtube, ArrowRight, Heart, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CREATOR_STATS } from '../data/products';
import { BrandLogo } from './BrandLogo';

export const Footer: React.FC = () => {
  const { navigate, currentPath } = useCart();

  const handleNav = (path: string) => {
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

  return (
    <footer className="bg-[#191614] text-[#FFFDF8] pt-16 sm:pt-20 pb-12 border-t border-[#6B5546]/30">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 sm:gap-12 pb-16 border-b border-white/10">
          {/* Brand Info (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="pb-1">
              <BrandLogo variant="card" size="sm" theme="dark" showTagline={true} className="bg-white/5 border border-white/10" />
            </div>

            <p className="text-[#D9C7AE] text-base font-medium max-w-sm">
              &ldquo;Teman kamu buat nyobain makanan &amp; bubuk minuman viral.&rdquo;
            </p>

            <p className="text-xs text-[#FFFDF8]/70 leading-relaxed max-w-sm">
              Official Store &amp; platform discovery kuliner nomor 1: dari jajanan pedas keranjang kuning TikTok sampai aneka bubuk minuman siap seduh cafe premium dengan bahan pilihan.
            </p>

            {/* Newsletter or Creator badge */}
            <div className="pt-2 flex items-center gap-3">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#637848] animate-pulse" />
              <span className="text-xs text-[#FFFDF8]/80 font-medium">
                Koleksi terkurasi: 100% Halal, higienis &amp; langsung siap kirim.
              </span>
            </div>

            {/* Social quick connect */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <a
                href={CREATOR_STATS.socials.tiktok}
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok Kawan Lokal @kawanlokal_"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-[#E85D32] text-[#FFFDF8] hover:text-white text-xs font-semibold transition-all border border-white/10 shadow-sm"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.88-4.48V8.62a8.28 8.28 0 0 0 4.89 1.58V6.75a4.83 4.83 0 0 1-1-.06z"/>
                </svg>
                <span>TikTok @kawanlokal_</span>
              </a>

              <a
                href={CREATOR_STATS.socials.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram Kawan Lokal @kawanlokal_"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-[#E85D32] text-[#FFFDF8] hover:text-white text-xs font-semibold transition-all border border-white/10 shadow-sm"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>Instagram</span>
              </a>
            </div>
          </div>

          {/* Navigation Columns (7 cols) */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Column 1: Explore */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#CA9344] block">
                KATALOG PRODUK
              </span>
              <ul className="space-y-2 text-sm text-[#FFFDF8]/80">
                <li>
                  <button
                    onClick={() => handleNav('/discover')}
                    className="hover:text-[#CA9344] transition-colors text-left"
                  >
                    Semua Produk
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNav('/discover?category=Bubuk%20Minuman')}
                    className="hover:text-[#CA9344] transition-colors text-left font-semibold text-[#CA9344] flex items-center gap-1.5"
                  >
                    <span>🧋</span>
                    <span>Bubuk Minuman Cafe</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNav('/discover?category=Cemilan%20Gurih')}
                    className="hover:text-[#CA9344] transition-colors text-left"
                  >
                    Cemilan Gurih &amp; Renyah
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNav('/articles')}
                    className="hover:text-[#CA9344] transition-colors text-left text-[#D9C7AE]"
                  >
                    Artikel &amp; Panduan Jajan
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNav('/#reviews')}
                    className="hover:text-[#CA9344] transition-colors text-left"
                  >
                    Ulasan &amp; Rating Jujur
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 2: About */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D9C7AE] block">
                ABOUT
              </span>
              <ul className="space-y-2 text-sm text-[#FFFDF8]/80">
                <li>
                  <button
                    onClick={() => handleNav('/#creator')}
                    className="hover:text-[#E85D32] transition-colors text-left"
                  >
                    Tentang Kawan Lokal
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNav('/#creator')}
                    className="hover:text-[#E85D32] transition-colors text-left"
                  >
                    Food Creator (Reno)
                  </button>
                </li>
                <li>
                  <span className="text-[#FFFDF8]/60 cursor-default">
                    Standar Rating Jujur
                  </span>
                </li>
                <li>
                  <span className="text-[#FFFDF8]/60 cursor-default">
                    Kerja Sama / Kolaborasi
                  </span>
                </li>
              </ul>
            </div>

            {/* Column 3: Social & Communities */}
            <div className="space-y-3 col-span-2 sm:col-span-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D9C7AE] block">
                SOCIAL
              </span>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <a
                    href={CREATOR_STATS.socials.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-[#FFFDF8]/80 hover:text-[#E85D32] transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                    <span>Instagram</span>
                  </a>
                </li>
                <li>
                  <a
                    href={CREATOR_STATS.socials.tiktok}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-[#FFFDF8]/80 hover:text-[#E85D32] transition-colors"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.88-4.48V8.62a8.28 8.28 0 0 0 4.89 1.58V6.75a4.83 4.83 0 0 1-1-.06z"/>
                    </svg>
                    <span>TikTok</span>
                  </a>
                </li>
                <li>
                  <a
                    href={CREATOR_STATS.socials.youtube}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-[#FFFDF8]/80 hover:text-[#E85D32] transition-colors"
                  >
                    <Youtube className="w-4 h-4" />
                    <span>YouTube</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#FFFDF8]/60 gap-4">
          <p>© 2026 Kawan Lokal. All rights reserved.</p>
          <div className="flex items-center gap-1.5 text-center">
            <span>&ldquo;Made for people who love discovering good food.&rdquo;</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
