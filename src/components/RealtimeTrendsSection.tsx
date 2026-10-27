import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, RefreshCw, Flame, Clock, ArrowRight, Compass, ShieldCheck } from 'lucide-react';
import { useAiTrends } from '../context/AiTrendsContext';
import { useCart } from '../context/CartContext';

export const RealtimeTrendsSection: React.FC = () => {
  const { articles, loading, isRefreshing, refreshTrends, getTimeAgo, grounded } = useAiTrends();
  const { navigate, showToast } = useCart();

  const handleManualRefresh = async () => {
    if (isRefreshing) return;
    showToast('🔍 Menghubungkan Google Search & Gemini AI untuk tren terbaru...');
    await refreshTrends(true);
    showToast('✨ Tren kuliner berhasil diperbarui secara real-time!');
  };

  return (
    <section id="realtime-trends" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Container */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#D9C7AE]/60">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#E85D32]/10 text-[#E85D32] border border-[#E85D32]/20">
              <Flame className="w-3.5 h-3.5 text-[#E85D32]" />
              <span>RADAR TREN KULINER REAL-TIME</span>
            </span>
            {grounded && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#6D8B57]/15 text-[#4D6C43] border border-[#6D8B57]/30">
                <ShieldCheck className="w-3 h-3 text-[#4D6C43]" />
                <span className="hidden sm:inline">Google Search Grounded</span>
                <span className="sm:hidden">Grounded</span>
              </span>
            )}
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-[#241A14] tracking-tight">
            Artikel &amp; Tren Viral Kuliner Indonesia
          </h2>
          <p className="text-xs sm:text-sm text-[#6B5546] mt-1.5 max-w-2xl leading-relaxed">
            Dianalisis secara real-time oleh Gemini AI berdasarkan jajanan yang sedang trending di TikTok, Instagram, dan X di seluruh Indonesia.
          </p>
        </div>

        {/* Action & Status */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden sm:block">
            <span className="text-[11px] text-[#6B5546] block flex items-center gap-1 justify-end">
              <Clock className="w-3 h-3 text-[#CA9344]" />
              <span>{getTimeAgo()}</span>
            </span>
            <span className="text-[10px] text-[#6B5546]/80">Auto-cache 24 Jam</span>
          </div>

          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#241A14] hover:bg-[#E85D32] text-white text-xs font-bold transition-all shadow-sm hover:shadow active:scale-95 disabled:opacity-70 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Mencari Tren...' : 'Refresh Update Terbaru'}</span>
          </button>
        </div>
      </div>

      {/* Grid of 3 Trending Articles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          // Skeleton Loading
          Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-[#FFFDF8] border border-[#D9C7AE]/60 shadow-sm animate-pulse flex flex-col justify-between h-[280px]"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="w-20 h-5 bg-[#EADDCC]/60 rounded-full" />
                  <div className="w-16 h-4 bg-[#EADDCC]/50 rounded-full" />
                </div>
                <div className="w-full h-6 bg-[#EADDCC]/70 rounded-xl mb-3" />
                <div className="w-3/4 h-6 bg-[#EADDCC]/70 rounded-xl mb-4" />
                <div className="w-full h-4 bg-[#EADDCC]/40 rounded-lg mb-2" />
                <div className="w-5/6 h-4 bg-[#EADDCC]/40 rounded-lg mb-2" />
                <div className="w-2/3 h-4 bg-[#EADDCC]/40 rounded-lg" />
              </div>
              <div className="w-28 h-4 bg-[#EADDCC]/60 rounded-lg mt-6" />
            </div>
          ))
        ) : (
          articles.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="p-6 rounded-3xl bg-[#FFFDF8] border border-[#D9C7AE]/60 hover:border-[#E85D32] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Meta pills */}
                <div className="flex items-center justify-between gap-2 mb-3.5">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#F8F5EF] text-[#241A14] border border-[#D9C7AE]/60">
                    {item.kategori || 'Tren Kuliner'}
                  </span>
                  <span className="text-[11px] font-semibold text-[#6B5546] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#CA9344]" />
                    <span>{item.waktu_baca || '2 mnt baca'}</span>
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-display font-black text-base sm:text-lg text-[#241A14] group-hover:text-[#E85D32] transition-colors leading-snug line-clamp-2 mb-2.5">
                  {item.judul}
                </h3>

                {/* Summary */}
                <p className="text-xs sm:text-sm text-[#6B5546] leading-relaxed line-clamp-3">
                  {item.ringkasan_singkat}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-5 mt-4 border-t border-[#D9C7AE]/40 flex items-center justify-between">
                <button
                  onClick={() => navigate('/articles')}
                  className="text-xs font-bold text-[#241A14] group-hover:text-[#E85D32] flex items-center gap-1.5 transition-colors"
                >
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#E85D32] group-hover:translate-x-1 transition-transform" />
                </button>
                <span className="w-2 h-2 rounded-full bg-[#E85D32] animate-pulse" />
              </div>
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
};
