import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  RefreshCw,
  Flame,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  X,
  ShoppingBag,
} from 'lucide-react';
import { useAiTrends } from '../context/AiTrendsContext';
import { useCart } from '../context/CartContext';
import { TrendingArticle } from '../types';
import { SafeImage } from './SafeImage';

export const RealtimeTrendsSection: React.FC = () => {
  const {
    articles,
    loading,
    isRefreshing,
    refreshTrends,
    todayDateFormatted,
    grounded,
  } = useAiTrends();
  const { navigate, showToast } = useCart();
  const [selectedArticle, setSelectedArticle] = useState<TrendingArticle | null>(null);

  const handleForceRefresh = async () => {
    if (isRefreshing) return;
    showToast('🔄 Menghubungkan Gemini AI & Google Search untuk cek tren terbaru hari ini...');
    await refreshTrends(true);
    showToast('✨ Artikel & tren kuliner hari ini berhasil diperbarui!');
  };

  return (
    <section id="realtime-trends" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Container */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-[#D9C7AE]/60">
        <div>
          <div className="flex items-center gap-2 mb-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#E85D32]/10 text-[#E85D32] border border-[#E85D32]/20">
              <Flame className="w-3.5 h-3.5 text-[#E85D32]" />
              <span>UPDATE VIRAL HARI INI</span>
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-[#F8F5EF] text-[#6B5546] border border-[#D9C7AE]/60">
              <Calendar className="w-3 h-3 text-[#CA9344]" />
              <span>{todayDateFormatted}</span>
            </span>
            {grounded && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#6D8B57]/15 text-[#4D6C43] border border-[#6D8B57]/30">
                <ShieldCheck className="w-3 h-3 text-[#4D6C43]" />
                <span>Google Search Grounded</span>
              </span>
            )}
          </div>

          <h2 className="font-display font-black text-2xl sm:text-4xl text-[#241A14] tracking-tight">
            Artikel &amp; Tren Terkini
          </h2>
          <p className="text-xs sm:text-sm text-[#6B5546] mt-1.5 max-w-2xl leading-relaxed">
            Eksplorasi tren kuliner, fenomena bumbu rempah viral di TikTok, dan riset jajanan lokal yang sedang hits hari ini di seluruh Indonesia.
          </p>
        </div>

        {/* Action Button: Force Refresh */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleForceRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#241A14] hover:bg-[#E85D32] text-white text-xs font-bold transition-all shadow-sm hover:shadow active:scale-95 disabled:opacity-70 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Menganalisis Tren...' : '🔄 Cek Tren Baru Sekarang'}</span>
          </button>
        </div>
      </div>

      {/* Grid of 3 Trending Articles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading || isRefreshing ? (
          // Skeleton Loading Animation with 200px Height
          Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-[32px] bg-[#FFFDF8] border border-[#D9C7AE]/60 shadow-sm animate-pulse flex flex-col justify-between"
            >
              <div>
                {/* 200px Height Skeleton */}
                <div className="w-full h-[200px] bg-gradient-to-r from-[#EADDCC]/70 via-[#F8F5EF] to-[#EADDCC]/70 rounded-2xl mb-4" />
                <div className="flex justify-between items-center mb-3">
                  <div className="w-24 h-5 bg-[#EADDCC]/70 rounded-full" />
                  <div className="w-20 h-4 bg-[#EADDCC]/50 rounded-full" />
                </div>
                <div className="w-full h-6 bg-[#EADDCC]/70 rounded-xl mb-2" />
                <div className="w-4/5 h-6 bg-[#EADDCC]/70 rounded-xl mb-3" />
                <div className="w-full h-3.5 bg-[#EADDCC]/40 rounded-lg mb-1.5" />
                <div className="w-3/4 h-3.5 bg-[#EADDCC]/40 rounded-lg" />
              </div>
              <div className="pt-4 border-t border-[#EADDCC]/40 flex justify-between items-center mt-4">
                <div className="w-28 h-4 bg-[#EADDCC]/60 rounded-lg" />
                <div className="w-4 h-4 bg-[#EADDCC]/60 rounded-full" />
              </div>
            </div>
          ))
        ) : (
          articles.map((item, index) => {
            // Guarantee specific keyword based on article index or property
            const specificKeyword =
              item.imageKeyword ||
              item.image_keyword ||
              (index === 0
                ? 'indonesian spicy basreng chips with lime leaves daun jeruk'
                : index === 1
                ? 'iced thai tea and matcha latte on cafe table'
                : 'indonesian spicy seblak and baso aci in a bowl with ceker');

            // Generator image URL with &seed=${index} to guarantee unique, non-duplicate images
            const dynamicImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
              specificKeyword
            )}?width=600&height=400&nologo=true&seed=${index}`;

            const fallbackCat =
              index === 0
                ? 'basreng'
                : index === 1
                ? 'beverage'
                : index === 2
                ? 'seblak'
                : 'general';

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                onClick={() => setSelectedArticle(item)}
                className="p-5 sm:p-6 rounded-[32px] bg-[#FFFDF8] border border-[#D9C7AE]/60 hover:border-[#E85D32] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer relative"
              >
                <div>
                  {/* Container with rounded corners & precise 200px height */}
                  <div className="relative mb-4 overflow-hidden rounded-2xl w-full h-[200px]">
                    <SafeImage
                      src={dynamicImageUrl}
                      alt={item.judul}
                      fallbackCategory={fallbackCat}
                      className="w-full h-[200px] rounded-2xl"
                      imageClassName="w-full h-[200px] object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#241A14]/85 text-white backdrop-blur-sm border border-white/20">
                        {item.kategori || 'Tren Kuliner'}
                      </span>
                    </div>
                  </div>

                  {/* Meta pills: Tanggal, Waktu Baca */}
                  <div className="flex items-center justify-between gap-2 mb-2.5 flex-wrap">
                    <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-semibold text-[#6B5546]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#CA9344]" />
                        <span>{item.tanggal_hari_ini || todayDateFormatted}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#6B5546]" />
                        <span>{item.waktu_baca || '2 mnt baca'}</span>
                      </span>
                    </div>
                    <span className="text-[9px] text-[#CA9344] font-medium hidden sm:inline">
                      ✨ Gambar Akurat
                    </span>
                  </div>

                  {/* Judul Artikel */}
                  <h3 className="font-display font-black text-base sm:text-lg text-[#241A14] group-hover:text-[#E85D32] transition-colors leading-snug line-clamp-2 mb-2">
                    {item.judul}
                  </h3>

                  {/* Ringkasan Singkat */}
                  <p className="text-xs sm:text-sm text-[#6B5546] leading-relaxed line-clamp-3">
                    {item.ringkasan || item.ringkasan_singkat}
                  </p>
                </div>

                {/* Action Button: Buka Modal Baca Lengkap */}
                <div className="pt-4 mt-4 border-t border-[#D9C7AE]/40 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#241A14] group-hover:text-[#E85D32] flex items-center gap-1.5 transition-colors">
                    <span>Baca Artikel Lengkap</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#E85D32] group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#E85D32] animate-pulse" />
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Pop-Up Modal Baca Lengkap Langsung di Layar */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain flex min-h-full items-center justify-center p-3 sm:p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedArticle(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl bg-[#FFFDF8] rounded-[36px] p-6 sm:p-9 border border-[#D9C7AE]/60 shadow-2xl z-10 max-h-[90vh] overflow-y-auto overscroll-contain my-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedArticle(null)}
                aria-label="Tutup"
                className="absolute top-5 right-5 p-2 rounded-full text-[#6B5546] hover:text-[#241A14] hover:bg-[#F8F5EF] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Badges & Meta */}
              <div className="flex items-center gap-2 mb-3.5 flex-wrap">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#E85D32]/10 text-[#E85D32] border border-[#E85D32]/20">
                  {selectedArticle.kategori}
                </span>
                <span className="text-xs font-semibold text-[#6B5546] flex items-center gap-1 bg-[#F8F5EF] px-2.5 py-0.5 rounded-full border border-[#D9C7AE]/40">
                  <Calendar className="w-3 h-3 text-[#CA9344]" />
                  <span>{selectedArticle.tanggal_hari_ini || todayDateFormatted}</span>
                </span>
                <span className="text-xs font-semibold text-[#6B5546] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#CA9344]" />
                  <span>{selectedArticle.waktu_baca || '2 mnt baca'}</span>
                </span>
              </div>

              {/* Judul Lengkap */}
              <h3 className="font-display font-black text-xl sm:text-2xl lg:text-3xl text-[#241A14] leading-tight mb-4">
                {selectedArticle.judul}
              </h3>

              {/* Modal Hero Image */}
              <div className="relative mb-6 overflow-hidden rounded-2xl shadow-md w-full h-[260px]">
                <SafeImage
                  src={
                    selectedArticle.imageUrl ||
                    `https://image.pollinations.ai/prompt/${encodeURIComponent(
                      selectedArticle.imageKeyword || selectedArticle.image_keyword || 'indonesian culinary food'
                    )}?width=600&height=400&nologo=true&seed=999`
                  }
                  alt={selectedArticle.judul}
                  fallbackCategory="general"
                  className="w-full h-[260px] rounded-2xl"
                  imageClassName="w-full h-[260px] object-cover rounded-2xl"
                />
              </div>

              {/* Ringkasan Box */}
              <div className="p-4 rounded-2xl bg-[#FFF8EE] border border-[#E85D32]/20 mb-6">
                <div className="text-[11px] font-black uppercase tracking-wider text-[#E85D32] mb-1 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ringkasan Tren:</span>
                </div>
                <p className="text-xs sm:text-sm text-[#241A14] font-medium leading-relaxed">
                  {selectedArticle.ringkasan || selectedArticle.ringkasan_singkat}
                </p>
              </div>

              {/* Isi Artikel Lengkap */}
              <div className="space-y-4 text-xs sm:text-sm text-[#4A3B32] leading-relaxed mb-8">
                {selectedArticle.isi_artikel_lengkap ? (
                  selectedArticle.isi_artikel_lengkap
                    .split('\n\n')
                    .map((paragraph, pIdx) => (
                      <p key={pIdx} className="leading-relaxed">
                        {paragraph}
                      </p>
                    ))
                ) : (
                  <p>
                    Tren kuliner ini terus menjadi perbincangan hangat di media sosial Indonesia berkat kombinasi rempah khas Nusantara yang berani, tekstur yang memuaskan lidah, dan kemudahan dalam penyajian.
                  </p>
                )}
              </div>

              {/* Footer Modal Action */}
              <div className="pt-5 border-t border-[#D9C7AE]/50 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={() => {
                    setSelectedArticle(null);
                    navigate('/discover');
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#241A14] hover:bg-[#E85D32] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <ShoppingBag className="w-4 h-4 text-[#D9C7AE]" />
                  <span>Cari Jajanan Terkait di Toko</span>
                </button>

                <button
                  onClick={() => setSelectedArticle(null)}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-[#6B5546] hover:text-[#241A14] transition-colors cursor-pointer text-center"
                >
                  Tutup Bacaan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
