import React, { useState, useMemo } from 'react';
import { Search, Clock, ArrowRight, BookOpen, Sparkles, Filter, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ARTICLES } from '../data/articles';
import { useCart } from '../context/CartContext';
import { Article } from '../types';

export const ArticlesPage: React.FC = () => {
  const { navigate } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['Semua', 'Tren Kuliner Viral', 'Battle Review', 'Tren Keranjang Kuning', 'Resep & Tips', 'Panduan Jajan', 'Review Jujur'];

  const filteredArticles = useMemo(() => {
    return ARTICLES.filter((article) => {
      const matchCategory = selectedCategory === 'Semua' || article.category === selectedCategory;
      const matchQuery =
        searchQuery.trim() === '' ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchCategory && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="pt-28 pb-20 bg-[#F8F5EF] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#6B5546] mb-6">
          <button onClick={() => navigate('/')} className="hover:text-[#241A14] transition-colors">
            Beranda
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-[#D9C7AE]" />
          <span className="text-[#241A14] font-semibold">Artikel & Panduan Jajan</span>
        </div>

        {/* Page Header */}
        <div className="bg-[#FFFDF8] rounded-3xl p-6 sm:p-10 border border-[#D9C7AE]/60 shadow-[0_8px_30px_rgb(36,26,20,0.04)] mb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E85D32]/10 text-[#E85D32] text-xs font-bold tracking-wider uppercase mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Editorial & Food Stories</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-[#241A14] tracking-tight leading-tight">
              Artikel, Resep, & Panduan Jajan Viral
            </h1>
            <p className="mt-3 text-base text-[#6B5546] leading-relaxed">
              Jurnal kuliner terlengkap untuk para pecinta street food Nusantara dan pemburu cemilan hits TikTok. Dari teknik masak anti gagal sampai komparasi rasa jujur tanpa endorse.
            </p>
          </div>

          {/* Search bar & Category filters */}
          <div className="mt-8 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            {/* Search Input */}
            <div className="relative flex-grow max-w-md">
              <Search className="w-4 h-4 text-[#917562] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari artikel (misal: cuanki, latiao, resep, seblak)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#F8F5EF] border border-[#D9C7AE]/60 text-sm text-[#241A14] placeholder:text-[#917562] focus:outline-none focus:ring-2 focus:ring-[#E85D32] focus:bg-[#FFFDF8] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#917562] hover:text-[#241A14]"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Total Results */}
            <div className="text-xs font-medium text-[#6B5546]">
              Menampilkan <span className="font-bold text-[#241A14]">{filteredArticles.length}</span> artikel
            </div>
          </div>

          {/* Categories Pill Bar */}
          <div className="mt-6 flex flex-wrap gap-2 pt-6 border-t border-[#F0E8DC]">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#E85D32] text-white shadow-sm'
                    : 'bg-[#F8F5EF] text-[#6B5546] hover:bg-[#EAE2D5] hover:text-[#241A14]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredArticles.map((article, idx) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                onClick={() => navigate(`/article/${article.slug}`)}
                className="bg-[#FFFDF8] rounded-2xl sm:rounded-3xl border border-[#D9C7AE]/60 overflow-hidden shadow-[0_4px_20px_rgb(36,26,20,0.03)] hover:shadow-[0_12px_32px_rgb(36,26,20,0.09)] transition-all duration-300 flex flex-col group cursor-pointer"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#EAE2D5]">
                  <img
                    src={article.heroImage}
                    alt={article.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-3 py-0.5 rounded-full bg-[#241A14]/90 backdrop-blur-sm text-white text-xs font-bold">
                      {article.category}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FFFDF8]/90 backdrop-blur-sm text-[#241A14] text-[11px] font-semibold flex items-center gap-1 shadow-sm">
                      <Clock className="w-3 h-3 text-[#E85D32]" />
                      {article.readTime}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="text-xs text-[#917562] mb-2 font-medium">
                      {article.date} • Oleh {article.author.name}
                    </div>
                    <h2 className="font-display text-lg font-bold text-[#241A14] group-hover:text-[#E85D32] transition-colors line-clamp-2 leading-snug">
                      {article.title}
                    </h2>
                    <p className="mt-2 text-xs text-[#6B5546] line-clamp-3 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#F0E8DC]">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {article.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded-md bg-[#F4EFE6] text-[#6B5546] text-[10px] font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#E85D32] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Baca Selengkapnya <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#FFFDF8] rounded-3xl border border-[#D9C7AE]/60 p-8">
            <BookOpen className="w-12 h-12 text-[#D9C7AE] mx-auto mb-3" />
            <h3 className="font-display text-lg font-bold text-[#241A14]">Tidak Ada Artikel Ditemukan</h3>
            <p className="mt-1 text-sm text-[#6B5546]">
              Coba gunakan kata kunci lain seperti "seblak", "cuanki", atau "latiao".
            </p>
            <button
              onClick={() => {
                setSelectedCategory('Semua');
                setSearchQuery('');
              }}
              className="mt-4 px-5 py-2 rounded-full bg-[#E85D32] text-white text-xs font-bold hover:bg-[#C74820] transition-colors"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
