import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Star,
  MapPin,
  Flame,
  Check,
  X,
  ArrowLeft,
  Share2,
  Heart,
  Clock,
  Package,
  Sparkles,
  Quote,
  ShoppingBag,
} from 'lucide-react';
import { Product, ProductVariant, PackageOption } from '../types';
import { formatRupiah } from '../lib/utils';
import { TasteProfile } from './TasteProfile';
import { PurchaseCard } from './PurchaseCard';
import { ProductCard } from './ProductCard';
import { BrewingGuide } from './BrewingGuide';
import { BrandLogo } from './BrandLogo';
import { PRODUCTS } from '../data/products';
import { useCart } from '../context/CartContext';

interface ProductDetailProps {
  slug: string;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ slug }) => {
  const { navigate, addToCart, showToast } = useCart();
  const product = PRODUCTS.find((p) => p.slug === slug) || PRODUCTS[0];

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const [selectedPackage, setSelectedPackage] = useState<PackageOption>(product.packageOptions[0]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  // Sync state when product slug changes
  useEffect(() => {
    setSelectedVariant(product.variants[0]);
    setSelectedPackage(product.packageOptions[0]);
    setActiveImageIndex(0);
    window.scrollTo(0, 0);
  }, [product]);

  // When variant changes, display the variant's specific image if available
  const handleVariantChange = (v: ProductVariant) => {
    setSelectedVariant(v);
  };

  const currentDisplayImage = selectedVariant.image || product.galleryImages[activeImageIndex] || product.image;

  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.review.creatorVerdict,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      showToast('Link berhasil disalin ke clipboard! 📋');
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8">
        {/* Navigation Breadcrumb / Back button */}
        <div className="flex items-center justify-between py-4 mb-4">
          <button
            onClick={() => navigate('/discover')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#6B5546] hover:text-[#241A14] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Discovery</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsSaved(!isSaved);
                showToast(isSaved ? 'Dihapus dari simpanan' : 'Disimpan ke wishlist kamu ❤️');
              }}
              aria-label="Simpan makanan"
              className={`p-2.5 rounded-full border transition-all ${
                isSaved
                  ? 'bg-[#B94A35] text-white border-[#B94A35]'
                  : 'bg-[#FFFDF8] text-[#241A14] border-[#D9C7AE]/60 hover:bg-[#F8F5EF]'
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              aria-label="Bagikan review"
              className="p-2.5 rounded-full bg-[#FFFDF8] border border-[#D9C7AE]/60 text-[#241A14] hover:bg-[#F8F5EF] transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Grid: Food Hero & Details (Left) + Sticky Commerce Purchase Card (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column (7 Cols) */}
          <div className="lg:col-span-7 space-y-10">
            {/* Top Section: Hero Image & Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-[32px] overflow-hidden bg-[#241A14] border border-[#D9C7AE]/60 shadow-xl">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentDisplayImage}
                    src={currentDisplayImage}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="w-full h-full object-cover object-center"
                  />
                </AnimatePresence>

                {/* Badges Over Image */}
                <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none">
                  <span className="px-3.5 py-1 rounded-full bg-[#E85D32] text-white text-xs font-bold tracking-wide shadow-md flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 fill-white" />
                    <span>{product.viralBadgeText || 'VIRAL HIT'}</span>
                  </span>
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#D9C7AE]" />
                    <span>{product.location}</span>
                  </span>
                </div>

                <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white text-xs font-bold flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-[#E85D32] text-[#E85D32]" />
                  <span>{product.rating.toFixed(1)} / 10 RATING</span>
                </div>
              </div>

              {/* Gallery Thumbnails */}
              {product.galleryImages.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {product.galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-16 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                        activeImageIndex === idx
                          ? 'border-[#E85D32] scale-105 shadow-md'
                          : 'border-[#D9C7AE]/50 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Preview ${idx + 1}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Title & Creator Verdict Block */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#6B5546] uppercase tracking-wider mb-2">
                  <span className="text-[#E85D32]">{product.category}</span>
                  <span>•</span>
                  <span>{product.location}</span>
                  <span>•</span>
                  <span>{product.reviewCount} Reviews</span>
                </div>

                <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-[#241A14] tracking-tight">
                  {product.name}
                </h1>

                <p className="mt-2 text-base sm:text-lg text-[#6B5546] font-medium leading-relaxed">
                  {product.subtitle}
                </p>
              </div>

              {/* CREATOR VERDICT - Prominent Editorial Quote Card */}
              <div className="relative p-6 sm:p-8 rounded-3xl bg-[#241A14] text-[#FFFDF8] overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#E85D32]/15 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#D9C7AE] text-xs font-extrabold uppercase tracking-widest">
                      <Sparkles className="w-3.5 h-3.5 text-[#E85D32]" />
                      <span>CREATOR VERDICT</span>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-[#E85D32] text-white text-xs font-black uppercase tracking-wider shadow-sm">
                      {product.review.verdictTag}
                    </span>
                  </div>

                  <div className="flex items-start gap-4">
                    <Quote className="w-8 h-8 text-[#E85D32] shrink-0 mt-1 opacity-90" />
                    <p className="font-display font-bold text-lg sm:text-xl md:text-2xl text-white leading-snug">
                      &ldquo;{product.review.creatorVerdict}&rdquo;
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/15 flex items-center justify-between text-xs text-[#D9C7AE]">
                    <span>Reno Wicaksono • Kawan Lokal</span>
                    <span>Review tanggal: {product.review.date}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* TASTE PROFILE Component */}
            <TasteProfile profile={product.tasteProfile} />

            {/* REVIEW CONTENT: What I Liked / What I Didn't Like / Who Should Try It */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* WHAT I LIKED */}
                <div className="p-6 rounded-3xl bg-[#FFFDF8] border border-[#D9C7AE]/60 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#4D6C43]">
                    <span className="w-2 h-2 rounded-full bg-[#6D8B57]" />
                    <span>WHAT I LIKED</span>
                  </div>
                  <ul className="space-y-2.5">
                    {product.review.whatILiked.map((liked, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#241A14]">
                        <Check className="w-4 h-4 text-[#6D8B57] shrink-0 mt-0.5" />
                        <span className="font-medium">{liked}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* WHAT I DIDN'T LIKE */}
                <div className="p-6 rounded-3xl bg-[#FFFDF8] border border-[#D9C7AE]/60 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#B94A35]">
                    <span className="w-2 h-2 rounded-full bg-[#B94A35]" />
                    <span>WHAT I DIDN&apos;T LIKE</span>
                  </div>
                  <ul className="space-y-2.5">
                    {product.review.whatIDidntLike.map((disliked, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#241A14]">
                        <X className="w-4 h-4 text-[#B94A35] shrink-0 mt-0.5" />
                        <span className="font-medium">{disliked}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* WHO SHOULD TRY IT */}
              <div className="p-6 sm:p-7 rounded-3xl bg-[#F8F5EF] border border-[#D9C7AE]/60 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#E85D32]">
                  RECOMMENDATION
                </span>
                <h4 className="font-display font-extrabold text-lg text-[#241A14]">
                  WHO SHOULD TRY IT?
                </h4>
                <p className="text-sm sm:text-base text-[#6B5546] leading-relaxed font-medium">
                  {product.review.whoShouldTryIt}
                </p>
              </div>

              {/* BEVERAGE BREWING GUIDE (if product is beverage or has brewing instructions) */}
              {(product.productType === 'beverage_powder' || product.brewingInstructions) && (
                <BrewingGuide product={product} />
              )}

              {/* Additional Product Specs (Prep, Shelf life, Storage) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#D9C7AE]/40 flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#CA9344] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] text-[#6B5546] font-semibold block">Waktu Siap</span>
                    <span className="text-xs font-bold text-[#241A14]">{product.prepTime}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#D9C7AE]/40 flex items-start gap-3">
                  <Package className="w-4 h-4 text-[#CA9344] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] text-[#6B5546] font-semibold block">
                      {product.productType === 'beverage_powder' ? 'Takaran Porsi' : 'Ketahanan'}
                    </span>
                    <span className="text-xs font-bold text-[#241A14]">
                      {product.productType === 'beverage_powder'
                        ? product.servingsPerPack || product.shelfLife
                        : product.shelfLife}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#D9C7AE]/40 flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-[#CA9344] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] text-[#6B5546] font-semibold block">Penyimpanan</span>
                    <span className="text-xs font-bold text-[#241A14] line-clamp-1">{product.storageInfo}</span>
                  </div>
                </div>
              </div>

              {/* Kawan Lokal Official Assurance Banner */}
              <div className="p-5 rounded-3xl bg-[#FAF5ED] border border-[#CA9344]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <BrandLogo variant="mark" size="sm" />
                  <div>
                    <h5 className="font-display font-bold text-sm text-[#241A14]">
                      Jaminan Kualitas Kawan Lokal Official
                    </h5>
                    <p className="text-xs text-[#6B5546]">
                      Bahan baku premium, 100% Halal, higienis, dan rasa terbukti viral!
                    </p>
                  </div>
                </div>
                <div className="shrink-0 px-3 py-1.5 rounded-full bg-[#241A14] text-white text-xs font-bold">
                  ✓ Terverifikasi Asli
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (5 Cols) - Sticky Desktop Purchase Card */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <PurchaseCard
              product={product}
              selectedVariant={selectedVariant}
              onSelectVariant={handleVariantChange}
              selectedPackage={selectedPackage}
              onSelectPackage={setSelectedPackage}
            />
          </div>
        </div>

        {/* Related Viral Picks Section */}
        <div className="mt-20 pt-12 border-t border-[#D9C7AE]/40 space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#E85D32]">
              REKOMENDASI LAINNYA
            </span>
            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-[#241A14]">
              MAKANAN VIRAL LAIN YANG SUDAH DIREVIEW
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Mobile Add to Cart Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#FFFDF8] border-t border-[#D9C7AE]/60 p-4 shadow-2xl flex items-center justify-between gap-4">
        <div>
          <span className="text-[11px] text-[#6B5546] block">Mulai dari</span>
          <span className="font-display font-extrabold text-lg text-[#241A14]">
            {formatRupiah(product.price)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              addToCart(product, selectedVariant, selectedPackage, 1);
            }}
            className="py-3 px-6 rounded-full bg-[#241A14] text-white font-bold text-xs tracking-wider uppercase flex items-center gap-2 shadow-lg"
          >
            <ShoppingBag className="w-4 h-4 text-[#D9C7AE]" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};
