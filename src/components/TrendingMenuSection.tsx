import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Flame, ShoppingBag, Lightbulb, ChefHat, Check } from 'lucide-react';
import { useAiTrends } from '../context/AiTrendsContext';
import { useCart } from '../context/CartContext';
import { formatRupiah } from '../lib/utils';
import { NewMenuItem } from '../types';

export const TrendingMenuSection: React.FC = () => {
  const { menus, loading, isRefreshing } = useAiTrends();
  const { addNewMenuToCart } = useCart();

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Container */}
      <div className="bg-gradient-to-r from-[#241A14] via-[#33251D] to-[#241A14] rounded-[36px] p-6 sm:p-10 text-white relative overflow-hidden shadow-xl mb-10 border border-[#D9C7AE]/30">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#E85D32]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-[#CA9344]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#E85D32] text-white shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-white animate-spin" />
              <span>GENERATOR MENU BARU OTOMATIS</span>
            </span>
            <span className="text-[11px] text-[#D9C7AE] font-semibold hidden sm:inline">
              • AI-Powered Culinary R&amp;D
            </span>
          </div>

          <h2 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight">
            Menu Baru Minggu Ini (Trending Menu)
          </h2>
          <p className="text-xs sm:text-sm text-[#D9C7AE] mt-2 leading-relaxed">
            Kreasi menu inovatif hasil analisis tren jajanan viral minggu ini di Indonesia. Diciptakan dengan rasa berani, gurih, dan tekstur nagih khas Kawan Lokal.
          </p>
        </div>
      </div>

      {/* Grid of 2-3 New Menu Items */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {loading || isRefreshing ? (
          // Skeleton Loading
          Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="p-6 rounded-[32px] bg-[#FFFDF8] border border-[#D9C7AE]/60 shadow-sm animate-pulse flex flex-col justify-between h-[340px]"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="w-24 h-6 bg-[#EADDCC]/60 rounded-full" />
                  <div className="w-20 h-5 bg-[#EADDCC]/50 rounded-full" />
                </div>
                <div className="w-3/4 h-7 bg-[#EADDCC]/70 rounded-xl mb-3" />
                <div className="w-full h-4 bg-[#EADDCC]/40 rounded-lg mb-2" />
                <div className="w-5/6 h-4 bg-[#EADDCC]/40 rounded-lg mb-5" />
                <div className="w-full h-16 bg-[#EADDCC]/30 rounded-2xl mb-4" />
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-[#EADDCC]/40">
                <div className="w-24 h-6 bg-[#EADDCC]/70 rounded-lg" />
                <div className="w-28 h-9 bg-[#EADDCC]/80 rounded-full" />
              </div>
            </div>
          ))
        ) : (
          menus.map((item: NewMenuItem, idx: number) => {
            const isTrending = (item.badge || '').includes('Trending');
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.35 }}
                className="p-6 sm:p-7 rounded-[32px] bg-[#FFFDF8] border border-[#D9C7AE]/60 hover:border-[#E85D32] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Top Badge & Category */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        isTrending
                          ? 'bg-[#E85D32] text-white shadow-sm'
                          : 'bg-[#6D8B57] text-white shadow-sm'
                      }`}
                    >
                      {item.badge || '🔥 Trending'}
                    </span>
                    <span className="text-[11px] font-bold text-[#6B5546] bg-[#F8F5EF] px-2.5 py-0.5 rounded-full border border-[#D9C7AE]/40 truncate max-w-[140px]">
                      {item.kategori}
                    </span>
                  </div>

                  {/* Menu Name */}
                  <h3 className="font-display font-black text-lg sm:text-xl text-[#241A14] group-hover:text-[#E85D32] transition-colors leading-snug mb-2.5">
                    {item.nama_menu}
                  </h3>

                  {/* Appetite Description */}
                  <p className="text-xs sm:text-sm text-[#6B5546] leading-relaxed mb-4">
                    {item.deskripsi_menggugah_selera}
                  </p>

                  {/* Why it's popular badge box */}
                  <div className="p-3.5 rounded-2xl bg-[#FFF8EE] border border-[#E85D32]/20 mb-6">
                    <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#CA9344] mb-1">
                      <Lightbulb className="w-3.5 h-3.5 text-[#E85D32]" />
                      <span>Kenapa Lagi Viral?</span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-[#241A14] leading-relaxed">
                      {item.alasan_populer}
                    </p>
                  </div>
                </div>

                {/* Footer: Price & Add to Cart Action */}
                <div className="pt-4 border-t border-[#D9C7AE]/40 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#6B5546] block">
                      Estimasi Harga
                    </span>
                    <span className="font-display font-black text-base sm:text-lg text-[#241A14]">
                      {formatRupiah(item.estimasi_harga_rupiah || 25000)}
                    </span>
                  </div>

                  <button
                    onClick={() => addNewMenuToCart(item)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#241A14] hover:bg-[#E85D32] text-white text-xs font-bold transition-all shadow-sm hover:shadow active:scale-95 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[#D9C7AE]" />
                    <span>Pesan Menu Ini</span>
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </section>
  );
};
