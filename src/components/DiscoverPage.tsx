import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  LayoutGrid,
  ListFilter,
  SlidersHorizontal,
  Star,
  Flame,
  ArrowUpDown,
  RotateCcw,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { ProductCard } from './ProductCard';
import { formatRupiah } from '../lib/utils';
import { useCart } from '../context/CartContext';
import { useAiTrends } from '../context/AiTrendsContext';
import { PRODUCTS } from '../data/products';
import { TrendingMenuSection } from './TrendingMenuSection';

export const DiscoverPage: React.FC = () => {
  const { currentPath, navigate, addToCart, showToast } = useCart();
  const aiTrends = useAiTrends();
  const rawProducts = aiTrends?.products;
  const products = Array.isArray(rawProducts) && rawProducts.length > 0 ? rawProducts : PRODUCTS;
  const categories = aiTrends?.categories || [];
  const newProductsCount = aiTrends?.newProductsCount || 0;
  const isRefreshing = aiTrends?.isRefreshing || false;
  const refreshProducts = aiTrends?.refreshProducts || (async () => {});

  // Extract category from query parameter if present
  const initialCategory = useMemo(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get('category');
      if (cat) return cat;
    }
    return 'all';
  }, []);

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [minRating, setMinRating] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [viralOnly, setViralOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'price-asc' | 'newest'>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'editorial'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  // Sync category with URL changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get('category');
      if (cat) {
        setSelectedCategory(cat);
      }
    }
  }, [currentPath]);

  // Listen to auto-discovered product events for interactive toast notification
  useEffect(() => {
    const handleNewProducts = (e: any) => {
      const count = e?.detail?.count || 4;
      showToast(`✨ ${count} Produk & Kategori Baru Berhasil Ditambahkan ke Katalog Otomatis!`);
    };

    window.addEventListener('kawanlokal_new_products_discovered', handleNewProducts);
    return () => {
      window.removeEventListener('kawanlokal_new_products_discovered', handleNewProducts);
    };
  }, [showToast]);

  // Filtered & Sorted Products (includes AI auto-discovered products at top)
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Dynamic Category filter
        if (selectedCategory !== 'all') {
          if (selectedCategory === 'Viral Picks') {
            if (!p.viralStatus) return false;
          } else if (selectedCategory === 'Spicy') {
            if (p.tasteProfile?.spicy < 20) return false;
          } else if (p.category !== selectedCategory) {
            return false;
          }
        }

        // Search term
        if (searchTerm.trim()) {
          const query = searchTerm.toLowerCase();
          const matches =
            p.name.toLowerCase().includes(query) ||
            p.subtitle.toLowerCase().includes(query) ||
            p.location.toLowerCase().includes(query) ||
            (p.category && p.category.toLowerCase().includes(query));
          if (!matches) return false;
        }

        // Rating filter
        if (minRating > 0 && p.rating < minRating) return false;

        // Price filter
        if (p.price > maxPrice) return false;

        // Viral filter
        if (viralOnly && !p.viralStatus) return false;

        return true;
      })
      .sort((a, b) => {
        // Keep newly AI discovered products prioritized at top when in default sort
        if (sortBy === 'popular') {
          if (a.isAiDiscovered && !b.isAiDiscovered) return -1;
          if (!a.isAiDiscovered && b.isAiDiscovered) return 1;
          return b.reviewCount - a.reviewCount;
        }
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'newest') {
          if (a.isAiDiscovered && !b.isAiDiscovered) return -1;
          if (!a.isAiDiscovered && b.isAiDiscovered) return 1;
          return b.reviewCount - a.reviewCount;
        }
        return 0;
      });
  }, [products, selectedCategory, searchTerm, minRating, maxPrice, viralOnly, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchTerm('');
    setMinRating(0);
    setMaxPrice(100000);
    setViralOnly(false);
    setSortBy('popular');
  };

  const handleForceCheckTrends = async () => {
    showToast('🔄 Menghubungkan Gemini AI untuk menganalisis produk viral terkini...');
    await refreshProducts(true);
    showToast('✨ Katalog & kategori produk berhasil diperbarui secara otomatis!');
  };

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#D9C7AE]/60">
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CA9344]/20 text-[#54382B] text-xs font-bold uppercase tracking-wider">
                <span className="text-[#CA9344]">🌿</span>
                <span>Kawan Lokal Official Store</span>
              </span>
              {newProductsCount > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#E85D32] to-[#CA9344] text-white text-xs font-black uppercase tracking-wider shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>{newProductsCount} Produk Baru Ditambahkan Otomatis</span>
                </span>
              )}
            </div>

            <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-[#241A14] tracking-tight">
              KATALOG MAKANAN &amp; BUBUK MINUMAN
            </h1>
            <p className="text-base sm:text-lg text-[#6B5546]">
              Koleksi lengkap jajanan viral TikTok terkurasi dan aneka bubuk minuman cafe siap seduh. Kategori baru otomatis bertambah seiring tren kuliner yang sedang viral!
            </p>
          </div>

          {/* Quick Refresh Button for Auto-Discovery */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleForceCheckTrends}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#241A14] hover:bg-[#E85D32] text-white text-xs font-bold transition-all shadow-sm hover:shadow active:scale-95 disabled:opacity-70 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Menganalisis Tren...' : '🔄 Cek Tren Baru Sekarang'}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Category Filter Tabs (Horizontal Bar) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#6B5546]">
            <span>Filter Kategori Otomatis</span>
            <span className="text-[#CA9344]">
              {categories.length - 1} Kategori Aktif
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((c) => {
              const active = selectedCategory === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                    active
                      ? 'bg-[#241A14] text-white shadow-md'
                      : 'bg-[#FFFDF8] hover:bg-[#F8F5EF] text-[#6B5546] border border-[#D9C7AE]/60 hover:border-[#E85D32]/50'
                  }`}
                >
                  <span>{c.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      active ? 'bg-white/20 text-white' : 'bg-[#D9C7AE]/35 text-[#241A14]'
                    }`}
                  >
                    {c.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search & Top Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-3xl bg-[#FFFDF8] border border-[#D9C7AE]/60 shadow-sm">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B5546]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari makanan viral, bahan, kota (Jakarta/Bali/Garut)..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#F8F5EF] border border-[#D9C7AE]/50 text-sm font-medium text-[#241A14] placeholder:text-[#6B5546]/70 focus:outline-none focus:ring-2 focus:ring-[#E85D32]/30"
            />
          </div>

          {/* Controls: Sort, View, Mobile Filter */}
          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="relative flex items-center">
              <ArrowUpDown className="absolute left-3.5 w-3.5 h-3.5 text-[#6B5546] pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Urutkan Produk"
                className="pl-9 pr-8 py-3 rounded-2xl bg-[#F8F5EF] border border-[#D9C7AE]/50 text-xs font-bold text-[#241A14] focus:outline-none focus:ring-2 focus:ring-[#E85D32]/30 cursor-pointer appearance-none"
              >
                <option value="popular">Paling Populer &amp; Baru</option>
                <option value="rating">Rating Tertinggi</option>
                <option value="price-asc">Harga Terendah</option>
                <option value="newest">Ulasan Terbanyak</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center p-1 bg-[#F8F5EF] rounded-2xl border border-[#D9C7AE]/50">
              <button
                onClick={() => setViewMode('grid')}
                aria-label="Tampilan Grid"
                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#241A14] text-white shadow-sm'
                    : 'text-[#6B5546] hover:text-[#241A14]'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('editorial')}
                aria-label="Tampilan Editorial"
                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                  viewMode === 'editorial'
                    ? 'bg-[#241A14] text-white shadow-sm'
                    : 'text-[#6B5546] hover:text-[#241A14]'
                }`}
              >
                <ListFilter className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#241A14] text-white text-xs font-bold cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Main Content Layout: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar Filters (Desktop 3 Cols) */}
          <aside
            className={`${
              showMobileFilters ? 'block' : 'hidden'
            } lg:block lg:col-span-3 space-y-6 bg-[#FFFDF8] p-6 rounded-3xl border border-[#D9C7AE]/60 shadow-sm`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#D9C7AE]/40">
              <h2 className="font-display font-extrabold text-base text-[#241A14] flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#E85D32]" />
                <span>FILTER KATALOG</span>
              </h2>
              <button
                onClick={resetFilters}
                className="text-xs font-bold text-[#E85D32] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            <div className="space-y-5">
              {/* Categories list in sidebar */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#6B5546] block">
                  KATEGORI DINAMIS
                </label>
                <div className="space-y-1 max-h-[360px] overflow-y-auto pr-1">
                  {categories.map((c) => {
                    const active = selectedCategory === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => setSelectedCategory(c.id)}
                        className={`w-full px-3 py-2 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#241A14] text-white'
                            : 'hover:bg-[#F8F5EF] text-[#6B5546] hover:text-[#241A14]'
                        }`}
                      >
                        <span className="truncate pr-2">{c.name}</span>
                        <span
                          className={`text-[11px] font-bold ${
                            active ? 'text-[#D9C7AE]' : 'text-[#6B5546]'
                          }`}
                        >
                          {c.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Minimum Rating */}
              <div className="space-y-2.5 pt-3 border-t border-[#D9C7AE]/40">
                <label className="text-xs font-bold uppercase tracking-wider text-[#6B5546] block">
                  MINIMUM RATING
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[0, 8.7, 9.0].map((r) => (
                    <button
                      key={r}
                      onClick={() => setMinRating(r)}
                      className={`py-2 px-1 rounded-xl text-center text-xs font-bold border transition-colors cursor-pointer ${
                        minRating === r
                          ? 'border-[#E85D32] bg-[#E85D32]/10 text-[#241A14]'
                          : 'border-[#D9C7AE]/50 bg-[#F8F5EF] text-[#6B5546]'
                      }`}
                    >
                      {r === 0 ? 'Semua' : `⭐ ${r}+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter Slider */}
              <div className="space-y-2.5 pt-3 border-t border-[#D9C7AE]/40">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase tracking-wider text-[#6B5546]">
                    MAX HARGA
                  </span>
                  <span className="font-extrabold text-[#241A14]">
                    {formatRupiah(maxPrice)}
                  </span>
                </div>
                <input
                  type="range"
                  min={15000}
                  max={100000}
                  step={5000}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  aria-label="Filter Harga Maksimum"
                  className="w-full accent-[#CA9344] cursor-pointer"
                />
              </div>

              {/* Viral Only Toggle */}
              <div className="pt-3 border-t border-[#D9C7AE]/40">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-bold text-[#241A14] flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-[#E85D32]" />
                    <span>Hanya Makanan Viral</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={viralOnly}
                    onChange={(e) => setViralOnly(e.target.checked)}
                    aria-label="Filter hanya makanan viral"
                    className="w-4 h-4 rounded text-[#E85D32] focus:ring-[#E85D32] cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </aside>

          {/* Products View (9 Cols) */}
          <main className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center rounded-3xl bg-[#FFFDF8] border border-[#D9C7AE]/50 p-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#F8F5EF] flex items-center justify-center text-3xl mx-auto">
                  🍜
                </div>
                <h3 className="font-display font-bold text-2xl text-[#241A14]">
                  Tidak ada makanan yang cocok dengan filter
                </h3>
                <p className="text-sm text-[#6B5546] max-w-md mx-auto">
                  Coba turunkan batas rating atau reset filter pencarian kamu untuk melihat semua menu.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 px-6 py-3 rounded-full bg-[#241A14] text-white font-semibold text-xs tracking-wider uppercase hover:bg-[#E85D32] transition-colors cursor-pointer"
                >
                  Reset Semua Filter
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              /* Grid View */
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              /* Editorial List View */
              <div className="space-y-4">
                {filteredProducts.map((p) => (
                  <motion.article
                    key={p.id}
                    whileHover={{ y: -2 }}
                    onClick={() => navigate(`/food/${p.slug}`)}
                    className="p-5 rounded-3xl bg-[#FFFDF8] border border-[#D9C7AE]/60 hover:border-[#E85D32] transition-all flex flex-col sm:flex-row items-center gap-5 cursor-pointer shadow-sm group"
                  >
                    <img
                      src={
                        p.imagePrompt
                          ? `https://image.pollinations.ai/prompt/${encodeURIComponent(
                              p.imagePrompt + ', high quality food photography, studio lighting'
                            )}?width=600&height=600&nologo=true&seed=${p.id}`
                          : p.image
                      }
                      alt={p.name}
                      className="w-full sm:w-40 h-36 rounded-2xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#6B5546]">
                        <span className="text-[#E85D32]">{p.category}</span>
                        <span>•</span>
                        <span>{p.location}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1 font-bold text-[#241A14]">
                          <Star className="w-3.5 h-3.5 fill-[#E85D32] text-[#E85D32]" />
                          <span>{p.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <h3 className="font-display font-extrabold text-xl text-[#241A14] group-hover:text-[#E85D32] transition-colors">
                        {p.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#6B5546] line-clamp-2 italic">
                        &ldquo;{p.review.creatorVerdict}&rdquo;
                      </p>
                    </div>
                    <div className="sm:border-l sm:border-[#D9C7AE]/40 sm:pl-5 flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3">
                      <span className="font-display font-extrabold text-lg text-[#241A14]">
                        {formatRupiah(p.price)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(p, p.variants[0], p.packageOptions[0], 1);
                        }}
                        className="py-2 px-4 rounded-full bg-[#241A14] text-white text-xs font-bold hover:bg-[#E85D32] transition-colors whitespace-nowrap cursor-pointer"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
