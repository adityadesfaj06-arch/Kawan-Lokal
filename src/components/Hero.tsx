import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown, Flame, Coffee, Sparkles, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { BrandLogo } from './BrandLogo';

export const Hero: React.FC = () => {
  const { navigate } = useCart();

  const scrollToReviews = () => {
    const el = document.getElementById('reviews');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToCategories = () => {
    const el = document.getElementById('categories');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="pt-24 pb-8 px-3 sm:px-6 md:px-8 max-w-[1440px] mx-auto">
      <div
        id="hero-banner"
        className="relative w-full min-h-[580px] lg:h-[640px] rounded-[32px] sm:rounded-[44px] md:rounded-[48px] overflow-hidden shadow-2xl flex items-center justify-between"
      >
        {/* Cinematic Background Image with warm grading */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=2000&q=90"
            alt="Makanan viral TikTok keranjang kuning, bubuk minuman kekinian, cuanki, latiao, basreng dan cemilan pedas"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center scale-105 filter brightness-[0.68] contrast-[1.1] saturate-[1.2]"
            loading="eager"
          />
          {/* Editorial Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#191614]/95 via-[#241A14]/80 to-[#191614]/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#191614]/95 via-transparent to-[#191614]/50" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-4xl px-6 sm:px-12 md:px-16 py-14 flex flex-col items-start justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            {/* Brand Pill Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#FFFDF8]/20 backdrop-blur-md border border-[#CA9344]/50 text-[#FFFDF8] text-xs font-semibold tracking-wide">
              <span className="text-[#CA9344]">🌿</span>
              <span className="font-bold text-[#F8E2BE]">OFFICIAL STORE</span>
              <span className="w-1 h-1 rounded-full bg-[#CA9344]" />
              <span className="text-white/90 font-medium">Jajanan Viral &amp; Bubuk Minuman Cafe</span>
            </div>

            {/* Headline */}
            <h1 className="font-display font-black text-white text-[38px] sm:text-[50px] md:text-[62px] lg:text-[70px] leading-[1.06] tracking-tight uppercase">
              JAJANAN VIRAL &amp;
              <br />
              <span className="text-[#E4BD82]">BUBUK MINUMAN.</span>
            </h1>

            {/* Supporting text */}
            <p className="max-w-xl text-base sm:text-lg md:text-xl text-[#FFFDF8]/90 font-normal leading-relaxed">
              Dari Latiao Mala, Cuanki Bandung, Cimol Bojot, &amp; Basreng pedas, sampai aneka bubuk minuman cafe premium: Matcha Uji, Taro, Red Velvet, &amp; Es Teh Solo. Nikmati rasa viral terbaik di rumahmu!
            </p>

            {/* Dual Highlights Chips */}
            <div className="flex flex-wrap gap-2 pt-1 text-xs sm:text-sm font-medium">
              <span className="px-3.5 py-1.5 rounded-full bg-white/15 border border-white/20 text-white flex items-center gap-1.5">
                <span>🌶️</span>
                <span>Cemilan Gurih &amp; Pedas Nampol</span>
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-[#637848]/40 border border-[#637848]/60 text-[#F5FFE0] flex items-center gap-1.5">
                <span>🧋</span>
                <span>Bubuk Minuman Siap Seduh 20-50 Cup</span>
              </span>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                id="hero-primary-btn"
                onClick={() => navigate('/discover')}
                className="px-7 py-3.5 sm:py-4 rounded-full bg-[#CA9344] hover:bg-[#B58235] text-[#241A14] font-bold text-sm sm:text-base transition-all duration-200 shadow-lg hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
              >
                <Flame className="w-4 h-4 text-[#54382B]" />
                <span>Belanja Semua Produk</span>
              </button>

              <button
                id="hero-drinks-btn"
                onClick={scrollToCategories}
                className="px-6 py-3.5 sm:py-4 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white font-semibold text-sm sm:text-base transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
              >
                <Coffee className="w-4 h-4 text-[#E4BD82]" />
                <span>Bubuk Minuman 🧋</span>
              </button>

              <button
                id="hero-secondary-btn"
                onClick={scrollToReviews}
                className="px-5 py-3.5 sm:py-4 rounded-full text-white/80 hover:text-white text-sm font-medium transition-colors flex items-center gap-1.5"
              >
                <span>Review Jujur</span>
                <ArrowDown className="w-4 h-4 text-white/70" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Brand Showcase Card (Desktop only) */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="hidden xl:flex relative z-10 mr-12 flex-col items-center max-w-[320px]"
        >
          <BrandLogo
            variant="card"
            size="md"
            showTagline={true}
            className="bg-[#FAF5ED]/95 backdrop-blur-md border border-[#CA9344]/40 shadow-2xl"
          />
          <div className="mt-4 p-4 rounded-2xl bg-[#191614]/80 backdrop-blur-md border border-white/20 text-white text-xs space-y-2 w-full shadow-lg">
            <div className="flex items-center justify-between text-[#CA9344] font-semibold">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Garansi Enak</span>
              </span>
              <span className="flex items-center gap-1 text-white">
                <Star className="w-3.5 h-3.5 fill-[#CA9344] text-[#CA9344]" />
                <span className="font-bold">9.5 / 10</span>
              </span>
            </div>
            <p className="text-white/85 italic leading-relaxed text-[11px]">
              &ldquo;Dibuat dari bahan segar berkualitas, higienis, dan rasa otentik yang bikin nagih!&rdquo;
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
