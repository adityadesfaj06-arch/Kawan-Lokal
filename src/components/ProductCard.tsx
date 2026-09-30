import React from 'react';
import { motion } from 'motion/react';
import { Star, MapPin, ShoppingBag, Eye, Flame } from 'lucide-react';
import { Product } from '../types';
import { formatRupiah } from '../lib/utils';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, priority = false }) => {
  const { navigate, addToCart } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultVariant = product.variants[0];
    const defaultPackage = product.packageOptions[0];
    addToCart(product, defaultVariant, defaultPackage, 1);
  };

  const handleViewDetail = () => {
    navigate(`/food/${product.slug}`);
  };

  const verdictColor =
    product.review.verdictTag === 'MUST TRY'
      ? 'bg-[#E85D32] text-white'
      : product.review.verdictTag === 'WORTH TRYING'
      ? 'bg-[#241A14] text-[#FFFDF8]'
      : 'bg-[#6B5546] text-white';

  return (
    <motion.article
      id={`product-card-${product.slug}`}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      onClick={handleViewDetail}
      className="group flex flex-col bg-[#FFFDF8] rounded-[24px] sm:rounded-[28px] border border-[#D9C7AE]/50 hover:border-[#E85D32]/60 overflow-hidden shadow-[0_4px_20px_rgb(36,26,20,0.04)] hover:shadow-[0_16px_35px_rgb(36,26,20,0.1)] transition-all duration-300 cursor-pointer h-full"
    >
      {/* Product Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F8F5EF]">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          loading={priority ? 'eager' : 'lazy'}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Gradient Shadow overlay on bottom of image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 pointer-events-none">
          {product.productType === 'beverage' ? (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#54382B] text-[#FFFDF8] text-[11px] font-bold tracking-wide shadow-md">
              <span>🧋</span>
              <span>{product.powderWeight || 'Bubuk Minuman'}</span>
            </span>
          ) : product.viralStatus ? (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#E85D32] text-white text-[11px] font-bold tracking-wide shadow-md">
              <Flame className="w-3 h-3 fill-white" />
              <span>{product.viralBadgeText || '🔥 VIRAL'}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#637848] text-white text-[11px] font-bold tracking-wide shadow-md">
              <span>🌿</span>
              <span>LOKAL PICK</span>
            </span>
          )}

          {/* Location / Origin / Servings Badge */}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white/95 text-[11px] font-medium ml-auto">
            {product.productType === 'beverage' ? (
              <>
                <span className="text-[#CA9344]">☕</span>
                <span>{product.servingsPerPack || '10-25 Cup'}</span>
              </>
            ) : (
              <>
                <MapPin className="w-3 h-3 text-[#D9C7AE]" />
                <span>{product.location}</span>
              </>
            )}
          </span>
        </div>

        {/* Creator Verdict Tag on bottom of image */}
        <div className="absolute bottom-3 left-3.5 pointer-events-none">
          <span className={`inline-block px-3 py-1 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-sm ${verdictColor}`}>
            Verdict: {product.review.verdictTag}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex-1 flex flex-col p-5 sm:p-6 justify-between gap-4">
        <div>
          {/* Rating and Category */}
          <div className="flex items-center justify-between gap-2 mb-2 text-xs">
            <span className="text-[#6B5546] font-semibold tracking-wide uppercase">
              {product.category}
            </span>
            <div className="flex items-center gap-1 font-bold text-[#241A14]">
              <Star className="w-3.5 h-3.5 fill-[#E85D32] text-[#E85D32]" />
              <span>{product.rating.toFixed(1)}/10</span>
              <span className="text-[#6B5546] font-normal text-[11px]">
                ({product.reviewCount})
              </span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="font-display font-bold text-lg sm:text-xl text-[#241A14] group-hover:text-[#E85D32] transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Short Creator Note / Excerpt */}
          <p className="mt-1.5 text-xs sm:text-sm text-[#6B5546] line-clamp-2 leading-relaxed italic">
            &ldquo;{product.subtitle}&rdquo;
          </p>
        </div>

        {/* Footer info & CTA buttons */}
        <div className="pt-3 border-t border-[#D9C7AE]/40 flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-[#6B5546]">Mulai dari</span>
            <span className="font-display font-extrabold text-base sm:text-lg text-[#241A14]">
              {formatRupiah(product.price)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleViewDetail();
              }}
              className="w-full py-2.5 px-3 rounded-full bg-[#F8F5EF] hover:bg-[#D9C7AE]/40 text-[#241A14] font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5 text-[#6B5546]" />
              <span>Read Review</span>
            </button>

            <button
              onClick={handleQuickAdd}
              aria-label={`Tambah ${product.name} ke keranjang`}
              className="w-full py-2.5 px-3 rounded-full bg-[#241A14] hover:bg-[#E85D32] text-white font-semibold text-xs transition-colors duration-200 flex items-center justify-center gap-1.5 shadow-sm"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
};
