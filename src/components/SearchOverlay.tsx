import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Star, ArrowRight, MapPin, Flame } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { ARTICLES } from '../data/articles';
import { formatRupiah } from '../lib/utils';
import { BookOpen } from 'lucide-react';

export const SearchOverlay: React.FC = () => {
  const { isSearchOpen, closeSearch, navigate } = useCart();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        closeSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, closeSearch]);

  const trimmed = query.trim().toLowerCase();

  // Search Results
  const matchedProducts = useMemo(() => {
    if (!trimmed) return PRODUCTS.slice(0, 4); // show top 4 when empty
    return PRODUCTS.filter((p) => {
      return (
        p.name.toLowerCase().includes(trimmed) ||
        p.category.toLowerCase().includes(trimmed) ||
        p.location.toLowerCase().includes(trimmed) ||
        p.subtitle.toLowerCase().includes(trimmed) ||
        p.variants.some((v) => v.name.toLowerCase().includes(trimmed))
      );
    });
  }, [trimmed]);

  const matchedReviews = useMemo(() => {
    if (!trimmed) return PRODUCTS.slice(0, 3);
    return PRODUCTS.filter((p) => {
      return (
        p.review.title.toLowerCase().includes(trimmed) ||
        p.review.creatorVerdict.toLowerCase().includes(trimmed) ||
        p.review.whoShouldTryIt.toLowerCase().includes(trimmed) ||
        p.review.whatILiked.some((item) => item.toLowerCase().includes(trimmed))
      );
    });
  }, [trimmed]);

  const matchedCategories = useMemo(() => {
    if (!trimmed) return CATEGORIES.slice(1, 6);
    return CATEGORIES.filter(
      (c) => c.id !== 'all' && c.name.toLowerCase().includes(trimmed)
    );
  }, [trimmed]);

  const matchedArticles = useMemo(() => {
    if (!trimmed) return ARTICLES.slice(0, 2);
    return ARTICLES.filter((a) => {
      return (
        a.title.toLowerCase().includes(trimmed) ||
        a.subtitle.toLowerCase().includes(trimmed) ||
        a.category.toLowerCase().includes(trimmed) ||
        a.tags.some((t) => t.toLowerCase().includes(trimmed))
      );
    });
  }, [trimmed]);

  const hasResults = matchedProducts.length > 0 || matchedReviews.length > 0 || matchedCategories.length > 0 || matchedArticles.length > 0;

  const quickKeywords = [
    'Bubuk Minuman',
    'Matcha Uji',
    'Taro Milk Tea',
    'Latiao Mala',
    'Cuanki Bandung',
    'Basreng Daun Jeruk',
    'Cimol Bojot',
    'Red Velvet',
    'Es Teh Solo',
    'Seblak Coet',
  ];

  const handleSelectProduct = (slug: string) => {
    closeSearch();
    navigate(`/food/${slug}`);
  };

  const handleSelectCategory = (catId: string) => {
    closeSearch();
    navigate(`/discover?category=${encodeURIComponent(catId)}`);
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSearch}
            className="fixed inset-0 bg-[#191614]/75 backdrop-blur-md"
          />

          {/* Search Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-3xl mx-4 my-8 sm:my-16 bg-[#FFFDF8] rounded-[32px] border border-[#D9C7AE]/60 shadow-2xl overflow-hidden z-10"
          >
            {/* Search Input Bar */}
            <div className="p-4 sm:p-6 border-b border-[#D9C7AE]/40 flex items-center gap-3 bg-[#F8F5EF]/60">
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-[#E85D32] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari makanan: croissant, matcha, ramen, bali, cokelat..."
                className="w-full bg-transparent text-base sm:text-lg text-[#241A14] placeholder:text-[#6B5546]/70 focus:outline-none font-medium"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  aria-label="Bersihkan pencarian"
                  className="p-1.5 text-[#6B5546] hover:text-[#241A14] rounded-full hover:bg-[#D9C7AE]/30"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={closeSearch}
                aria-label="Tutup pencarian"
                className="p-2 text-[#241A14] hover:bg-[#D9C7AE]/30 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Suggestion Chips */}
            <div className="px-4 sm:px-6 py-3 border-b border-[#D9C7AE]/30 bg-[#FFFDF8] flex items-center gap-2 overflow-x-auto scrollbar-none">
              <span className="text-xs font-semibold text-[#6B5546] whitespace-nowrap">
                Pencarian Populer:
              </span>
              {quickKeywords.map((kw) => (
                <button
                  key={kw}
                  onClick={() => setQuery(kw)}
                  className="px-3 py-1 rounded-full bg-[#F8F5EF] hover:bg-[#E85D32]/10 hover:text-[#E85D32] border border-[#D9C7AE]/40 text-xs text-[#241A14] font-medium whitespace-nowrap transition-colors"
                >
                  {kw}
                </button>
              ))}
            </div>

            {/* Search Results Area */}
            <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto space-y-6">
              {!hasResults && trimmed ? (
                /* Empty State */
                <div className="py-12 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-[#F8F5EF] flex items-center justify-center text-3xl mb-4">
                    🔍
                  </div>
                  <h3 className="font-display font-bold text-xl text-[#241A14]">
                    Belum ketemu makanan yang kamu cari.
                  </h3>
                  <p className="mt-1.5 text-sm text-[#6B5546] max-w-sm">
                    Coba gunakan kata kunci seperti &quot;Latiao&quot;, &quot;Cuanki&quot;, &quot;Basreng&quot;, &quot;Cimol Bojot&quot;, atau &quot;Seblak&quot;.
                  </p>
                  <button
                    onClick={() => {
                      closeSearch();
                      navigate('/discover');
                    }}
                    className="mt-5 px-6 py-2.5 rounded-full bg-[#241A14] text-white font-semibold text-xs transition-colors hover:bg-[#E85D32]"
                  >
                    Explore Trending Food
                  </button>
                </div>
              ) : (
                <>
                  {/* Category matches */}
                  {matchedCategories.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B5546] mb-3">
                        CATEGORIES
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {matchedCategories.map((c) => (
                          <button
                            key={c.id}
                            onClick={() => handleSelectCategory(c.id)}
                            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#F8F5EF] hover:bg-[#D9C7AE]/40 border border-[#D9C7AE]/40 text-xs font-semibold text-[#241A14] transition-colors"
                          >
                            <span>{c.icon}</span>
                            <span>{c.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Food Results */}
                  {matchedProducts.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B5546] mb-3">
                        FOOD PICKS ({matchedProducts.length})
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {matchedProducts.map((p) => (
                          <div
                            key={p.id}
                            onClick={() => handleSelectProduct(p.slug)}
                            className="flex items-center gap-3 p-3 rounded-2xl bg-[#F8F5EF] hover:bg-[#D9C7AE]/30 border border-[#D9C7AE]/30 cursor-pointer transition-colors group"
                          >
                            <img
                              src={p.image}
                              alt={p.name}
                              referrerPolicy="no-referrer"
                              className="w-14 h-14 rounded-xl object-cover shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between text-[11px] text-[#6B5546]">
                                <span className="font-semibold text-[#E85D32]">{p.category}</span>
                                <div className="flex items-center gap-1 font-bold text-[#241A14]">
                                  <Star className="w-3 h-3 fill-[#E85D32] text-[#E85D32]" />
                                  <span>{p.rating.toFixed(1)}</span>
                                </div>
                              </div>
                              <h5 className="font-display font-bold text-sm text-[#241A14] truncate group-hover:text-[#E85D32] transition-colors">
                                {p.name}
                              </h5>
                              <p className="text-xs font-semibold text-[#241A14]">
                                {formatRupiah(p.price)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Review Matches */}
                  {matchedReviews.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B5546] mb-3">
                        CREATOR REVIEWS
                      </h4>
                      <div className="space-y-2">
                        {matchedReviews.map((r) => (
                          <div
                            key={r.id}
                            onClick={() => handleSelectProduct(r.slug)}
                            className="p-3.5 rounded-2xl bg-[#FFFDF8] hover:bg-[#F8F5EF] border border-[#D9C7AE]/40 cursor-pointer transition-colors flex items-start justify-between gap-4 group"
                          >
                            <div>
                              <div className="flex items-center gap-2 text-xs font-semibold text-[#6B5546] mb-1">
                                <span className="text-[#E85D32]">{r.name}</span>
                                <span>•</span>
                                <span>Rating: {r.rating}/10</span>
                              </div>
                              <p className="font-display font-bold text-sm text-[#241A14] group-hover:text-[#E85D32] transition-colors">
                                &ldquo;{r.review.title}&rdquo;
                              </p>
                              <p className="text-xs text-[#6B5546] line-clamp-1 italic mt-1">
                                &ldquo;{r.review.creatorVerdict}&rdquo;
                              </p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-[#6B5546] group-hover:text-[#E85D32] shrink-0 mt-1" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Article Matches */}
                  {matchedArticles.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B5546] mb-3">
                        ARTIKEL & PANDUAN ({matchedArticles.length})
                      </h4>
                      <div className="space-y-2">
                        {matchedArticles.map((a) => (
                          <div
                            key={a.id}
                            onClick={() => {
                              closeSearch();
                              navigate(`/article/${a.slug}`);
                            }}
                            className="p-3.5 rounded-2xl bg-[#FFFDF8] hover:bg-[#F8F5EF] border border-[#D9C7AE]/40 cursor-pointer transition-colors flex items-center justify-between gap-4 group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#EAE2D5] shrink-0">
                                <img
                                  src={a.heroImage}
                                  alt={a.title}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 text-[11px] text-[#6B5546] mb-0.5">
                                  <span className="font-bold text-[#E85D32]">{a.category}</span>
                                  <span>•</span>
                                  <span>{a.readTime}</span>
                                </div>
                                <h5 className="font-display font-bold text-sm text-[#241A14] group-hover:text-[#E85D32] transition-colors line-clamp-1">
                                  {a.title}
                                </h5>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-[#6B5546] group-hover:text-[#E85D32] shrink-0" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
