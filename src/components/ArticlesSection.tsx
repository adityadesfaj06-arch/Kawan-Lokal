import React from 'react';
import { BookOpen, ArrowRight, Clock, User, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { ARTICLES } from '../data/articles';
import { useCart } from '../context/CartContext';

export const ArticlesSection: React.FC = () => {
  const { navigate } = useCart();
  const featuredArticles = ARTICLES.slice(0, 3);

  return (
    <section id="articles" className="py-16 sm:py-20 bg-[#F4EFE6] border-t border-b border-[#E3DAC9]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E85D32]/10 text-[#E85D32] text-xs font-bold tracking-wider uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Jurnal & Panduan Kuliner</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-[#241A14] tracking-tight">
              Artikel & Review Mendalam
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#6B5546] max-w-xl">
              Kupas tuntas makanan viral TikTok, rahasia bumbu otentik, resep cobek viral, dan panduan belanja hemat di keranjang kuning.
            </p>
          </div>

          <button
            id="btn-view-all-articles"
            onClick={() => navigate('/articles')}
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-bold text-[#E85D32] hover:text-[#C74820] group transition-colors self-start md:self-auto"
          >
            <span>Lihat Semua ({ARTICLES.length} Artikel)</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Featured Big Card + 2 Smaller Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Hero Article (Column 1-7) */}
          {featuredArticles[0] && (
            <motion.article
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              onClick={() => navigate(`/article/${featuredArticles[0].slug}`)}
              className="lg:col-span-7 bg-[#FFFDF8] rounded-2xl sm:rounded-3xl border border-[#D9C7AE]/60 overflow-hidden shadow-[0_4px_20px_rgb(36,26,20,0.04)] hover:shadow-[0_12px_32px_rgb(36,26,20,0.1)] transition-all duration-300 flex flex-col group cursor-pointer"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#EAE2D5]">
                <img
                  src={featuredArticles[0].heroImage}
                  alt={featuredArticles[0].title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#241A14]/80 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#E85D32] text-white text-xs font-bold shadow-md">
                    {featuredArticles[0].category}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#241A14]/80 backdrop-blur-sm text-[#F8F5EF] text-xs font-medium flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    {featuredArticles[0].readTime}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-xs font-medium text-[#F4EFE6]/80">{featuredArticles[0].date}</span>
                  <h3 className="font-display text-xl sm:text-2xl font-bold mt-1 line-clamp-2 leading-snug group-hover:text-[#F8A07E] transition-colors">
                    {featuredArticles[0].title}
                  </h3>
                </div>
              </div>

              <div className="p-6 flex-grow flex flex-col justify-between">
                <p className="text-sm text-[#6B5546] line-clamp-3 leading-relaxed">
                  {featuredArticles[0].excerpt}
                </p>

                <div className="mt-6 pt-4 border-t border-[#F0E8DC] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={featuredArticles[0].author.avatar}
                      alt={featuredArticles[0].author.name}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-full object-cover border border-[#D9C7AE]"
                    />
                    <span className="text-xs font-semibold text-[#241A14]">{featuredArticles[0].author.name}</span>
                  </div>

                  <span className="text-xs font-bold text-[#E85D32] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    Baca Artikel <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </motion.article>
          )}

          {/* Secondary 2 Articles (Column 8-12) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {featuredArticles.slice(1, 3).map((article, idx) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                onClick={() => navigate(`/article/${article.slug}`)}
                className="bg-[#FFFDF8] rounded-2xl border border-[#D9C7AE]/60 overflow-hidden shadow-[0_4px_16px_rgb(36,26,20,0.03)] hover:shadow-[0_10px_24px_rgb(36,26,20,0.08)] transition-all duration-300 flex flex-col sm:flex-row lg:flex-col group cursor-pointer flex-1"
              >
                <div className="relative sm:w-48 lg:w-full aspect-[16/9] sm:aspect-square lg:aspect-[16/8] overflow-hidden bg-[#EAE2D5] flex-shrink-0">
                  <img
                    src={article.heroImage}
                    alt={article.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#241A14]/90 backdrop-blur-sm text-white text-[11px] font-bold">
                      {article.category}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex flex-col justify-between flex-grow">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#917562] mb-1.5">
                      <span>{article.date}</span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>
                    <h4 className="font-display text-base font-bold text-[#241A14] group-hover:text-[#E85D32] transition-colors line-clamp-2 leading-snug">
                      {article.title}
                    </h4>
                    <p className="mt-2 text-xs text-[#6B5546] line-clamp-2 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#F0E8DC] flex items-center justify-between">
                    <span className="text-xs text-[#6B5546] font-medium">{article.author.name}</span>
                    <span className="text-xs font-bold text-[#E85D32] flex items-center gap-1">
                      Baca <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        {/* Quick Topics Pills */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-[#6B5546]">
          <span className="font-bold text-[#241A14]">Topik Populer:</span>
          {['Gooey Cookies Viral', 'Cuanki vs Baso Aci', 'Rahasia Latiao TikTok', 'Resep Seblak Coet', 'Cimol Bojot Anti-Meledak', 'Basreng Daun Jeruk', 'Cokelat Dubai'].map((tag) => (
            <button
              key={tag}
              onClick={() => navigate('/articles')}
              className="px-3 py-1.5 rounded-full bg-[#FFFDF8] border border-[#D9C7AE]/60 hover:border-[#E85D32] hover:text-[#E85D32] transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
