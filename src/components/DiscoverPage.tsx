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
  Check,
} from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { ProductCard } from './ProductCard';
import { Product, ProductCategory } from '../types';
import { formatRupiah } from '../lib/utils';
import { useCart } from '../context/CartContext';

export const DiscoverPage: React.FC = () => {
  const { currentPath, navigate, addToCart } = useCart();

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

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'Viral Picks') {
          if (!p.viralStatus) return false;
        } else if (selectedCategory === 'Spicy') {
          if (p.tasteProfile.spicy < 20) return false;
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
          p.category.toLowerCase().includes(query);
        if (!matches) return false;
      }

      // Rating filter
      if (minRating > 0 && p.rating < minRating) return false;

      // Price filter
      if (p.price > maxPrice) return false;

      // Viral filter
      if (viralOnly && !p.viralStatus) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'newest') return b.reviewCount - a.reviewCount;
      // Default: popular
      return b.reviewCount - a.reviewCount;
    });
  }, [selectedCategory, searchTerm, minRating, maxPrice, viralOnly, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchTerm('');
    setMinRating(0);
    setMaxPrice(100000);
    setViralOnly(false);
    setSortBy('popular');
  };

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 space-y-8">
        {/* Page Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#CA9344]/20 text-[#54382B] text-xs font-bold uppercase tracking-wider">
            <span className="text-[#CA9344]">🌿</span>
            <span>Kawan Lokal Official Store</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-[#241A14] tracking-tight">
            KATALOG MAKANAN &amp; BUBUK MINUMAN
          </h1>

          <p className="text-base sm:text-lg text-[#6B5546]">
            Koleksi lengkap jajanan viral TikTok terkurasi dan aneka bubuk minuman cafe siap seduh. Pilih porsi dan varian favoritmu dengan jaminan rasa nomor satu!
          </p>
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
              placeholder="Cari makanan viral, bahan, kota (Jakarta/Bali)..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#F8F5EF] border border-[#D9C7AE]/50 text-sm font-medium text-[#241A14] placeholder:text-[#6B5546]/70 focus:outline-none focus:ring-2 focus:ring-[#E85D32]/30"
            />
          </div>

          {/* Controls: Sort, View mode, Mobile filter toggle */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Sort Select */}
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-[#F8F5EF] border border-[#D9C7AE]/50 text-xs font-semibold text-[#241A14]">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#6B5546]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Urutkan Produk"
                className="bg-transparent focus:outline-none cursor-pointer pr-1"
              >
                <option value="popular">Terpopuler</option>
                <option value="rating">Rating Tertinggi</option>
                <option value="price-asc">Harga Terendah</option>
                <option value="newest">Review Terbaru</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center bg-[#F8F5EF] border border-[#D9C7AE]/50 rounded-2xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                aria-label="Tampilan Grid"
                className={`p-2 rounded-xl transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-[#241A14] text-white shadow-sm'
                    : 'text-[#6B5546] hover:text-[#241A14]'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('editorial')}
                aria-label="Tampilan Editorial List"
                className={`p-2 rounded-xl transition-colors ${
                  viewMode === 'editorial'
                    ? 'bg-[#241A14] text-white shadow-sm'
                    : 'text-[#6B5546] hover:text-[#241A14]'
                }`}
              >
                <ListFilter className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="md:hidden flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-[#241A14] text-white text-xs font-bold"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Main Content: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Filter Sidebar (3 Cols) */}
          <aside
            className={`lg:col-span-3 space-y-6 ${
              showMobileFilters ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="p-6 rounded-3xl bg-[#FFFDF8] border border-[#D9C7AE]/60 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#D9C7AE]/40">
                <span className="font-display font-extrabold text-base text-[#241A14]">
                  Filter Pilihan
                </span>
                <button
                  onClick={resetFilters}
                  className="text-xs font-semibold text-[#E85D32] hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Categories */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#6B5546] block">
                  KATEGORI
                </label>
                <div className="space-y-1">
                  {CATEGORIES.map((c) => {
                    const active = selectedCategory === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => setSelectedCategory(c.id)}
                        className={`w-full px-3 py-2 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors ${
                          active
                            ? 'bg-[#241A14] text-white'
                            : 'hover:bg-[#F8F5EF] text-[#6B5546] hover:text-[#241A14]'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{c.icon}</span>
                          <span>{c.name}</span>
                        </span>
                        <span className={`text-[11px] ${active ? 'text-[#D9C7AE]' : 'text-[#6B5546]'}`}>
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
                      className={`py-2 px-1 rounded-xl text-center text-xs font-bold border transition-colors ${
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
                  className="mt-4 px-6 py-3 rounded-full bg-[#241A14] text-white font-semibold text-xs tracking-wider uppercase hover:bg-[#E85D32] transition-colors"
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
                      src={p.image}
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
                        className="py-2 px-4 rounded-full bg-[#241A14] text-white text-xs font-bold hover:bg-[#E85D32] transition-colors whitespace-nowrap"
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
