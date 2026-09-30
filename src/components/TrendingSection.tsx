import React from 'react';
import { ArrowRight, Flame, Sparkles } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { ProductCard } from './ProductCard';
import { useCart } from '../context/CartContext';

export const TrendingSection: React.FC = () => {
  const { navigate } = useCart();
  // Grab top trending products
  const trendingProducts = PRODUCTS.slice(0, 4);

  return (
    <section id="trending" className="py-14 sm:py-20 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E85D32]/10 border border-[#E85D32]/20 text-[#E85D32] text-xs font-bold uppercase tracking-wider mb-3">
            <Flame className="w-3.5 h-3.5 fill-[#E85D32]" />
            <span>Trending Right Now</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#241A14] tracking-tight">
            MAKANAN YANG LAGI RAME
          </h2>
          <p className="mt-2 text-base sm:text-lg text-[#6B5546]">
            Makanan yang lagi ramai dibicarakan netizen. Sudah dicoba langsung, ini hasilnya.
          </p>
        </div>

        <button
          onClick={() => navigate('/discover')}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#241A14] hover:text-[#E85D32] transition-colors group self-start sm:self-auto py-2"
        >
          <span>Lihat Semua Trending</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-[#E85D32]" />
        </button>
      </div>

      {/* Grid on desktop, horizontal snap scroll on mobile */}
      <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-5 overflow-x-auto pb-4 sm:pb-0 scrollbar-none snap-x snap-mandatory">
        {trendingProducts.map((product) => (
          <div
            key={product.id}
            className="min-w-[280px] sm:min-w-0 w-full snap-center"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};
