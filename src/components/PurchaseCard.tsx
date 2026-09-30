import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Minus, Plus, ShoppingBag, Zap, ShieldCheck, Truck, Check } from 'lucide-react';
import { Product, ProductVariant, PackageOption } from '../types';
import { formatRupiah } from '../lib/utils';
import { useCart } from '../context/CartContext';

interface PurchaseCardProps {
  product: Product;
  selectedVariant: ProductVariant;
  onSelectVariant: (v: ProductVariant) => void;
  selectedPackage: PackageOption;
  onSelectPackage: (p: PackageOption) => void;
}

export const PurchaseCard: React.FC<PurchaseCardProps> = ({
  product,
  selectedVariant,
  onSelectVariant,
  selectedPackage,
  onSelectPackage,
}) => {
  const { addToCart, navigate } = useCart();
  const [quantity, setQuantity] = useState(1);

  // Dynamic Price calculation
  const basePrice = (product.price + selectedVariant.priceModifier) * selectedPackage.multiplier;
  const discount = selectedPackage.discountPercent
    ? (basePrice * selectedPackage.discountPercent) / 100
    : 0;
  const currentPrice = Math.round(basePrice - discount);

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, selectedPackage, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedVariant, selectedPackage, quantity);
    navigate('/checkout');
  };

  return (
    <div
      id="purchase-card"
      className="bg-[#FFFDF8] rounded-[32px] border border-[#D9C7AE]/60 p-6 sm:p-7 shadow-[0_8px_30px_rgb(36,26,20,0.06)] space-y-6"
    >
      {/* Price and Stock Status */}
      <div className="flex items-baseline justify-between border-b border-[#D9C7AE]/40 pb-4">
        <div>
          <span className="text-xs text-[#6B5546] font-medium block">Harga Total</span>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-extrabold text-2xl sm:text-3xl text-[#241A14]">
              {formatRupiah(currentPrice)}
            </span>
            {selectedPackage.discountPercent && (
              <span className="text-xs font-bold text-[#E85D32] bg-[#E85D32]/10 px-2 py-0.5 rounded-full">
                Hemat {selectedPackage.discountPercent}%
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6D8B57]/10 text-[#4D6C43] text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-[#6D8B57] animate-pulse" />
          <span>Tersedia Hari Ini</span>
        </div>
      </div>

      {/* 1. Variant Selector */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-[#6B5546] flex justify-between">
          <span>PILIH VARIAN RASA:</span>
          <span className="text-[#241A14] font-semibold">{selectedVariant.name}</span>
        </label>
        <div className="grid grid-cols-1 gap-2">
          {product.variants.map((v) => {
            const isSelected = v.id === selectedVariant.id;
            return (
              <button
                key={v.id}
                onClick={() => onSelectVariant(v)}
                className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all duration-200 ${
                  isSelected
                    ? 'border-[#241A14] bg-[#241A14] text-white shadow-md'
                    : 'border-[#D9C7AE]/60 bg-[#F8F5EF] text-[#241A14] hover:border-[#241A14]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-white/40 shrink-0"
                    style={{ backgroundColor: v.colorTag || '#E85D32' }}
                  />
                  <span className="text-xs sm:text-sm font-semibold">{v.name}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  {v.priceModifier > 0 && (
                    <span className={isSelected ? 'text-[#D9C7AE]' : 'text-[#6B5546]'}>
                      +{formatRupiah(v.priceModifier)}
                    </span>
                  )}
                  {isSelected && <Check className="w-4 h-4 text-[#D9C7AE]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Package / Size Selector */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-[#6B5546] flex justify-between">
          <span>PILIH PORSI / PACKAGING:</span>
          <span className="text-[#241A14] font-semibold">{selectedPackage.name}</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {product.packageOptions.map((pkg) => {
            const isSelected = pkg.id === selectedPackage.id;
            return (
              <button
                key={pkg.id}
                onClick={() => onSelectPackage(pkg)}
                className={`py-2.5 px-2 rounded-2xl border text-center transition-all duration-200 ${
                  isSelected
                    ? 'border-[#E85D32] bg-[#E85D32]/10 text-[#241A14] font-bold shadow-sm'
                    : 'border-[#D9C7AE]/60 bg-[#F8F5EF] text-[#6B5546] hover:border-[#241A14]'
                }`}
              >
                <span className="block text-xs font-semibold">{pkg.name}</span>
                {pkg.discountPercent && (
                  <span className="block text-[10px] text-[#E85D32] font-bold mt-0.5">
                    Diskon {pkg.discountPercent}%
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Quantity Counter */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#6B5546]">
          JUMLAH PESANAN
        </span>
        <div className="flex items-center gap-3 bg-[#F8F5EF] border border-[#D9C7AE]/60 rounded-full px-3 py-1.5">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-1 rounded-full hover:bg-white text-[#241A14] transition-colors"
            aria-label="Kurangi jumlah"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="font-display font-extrabold text-sm text-[#241A14] w-6 text-center">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="p-1 rounded-full hover:bg-white text-[#241A14] transition-colors"
            aria-label="Tambah jumlah"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5 pt-2">
        <motion.button
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          onClick={handleAddToCart}
          className="w-full py-4 px-6 rounded-full bg-[#241A14] hover:bg-[#191614] text-white font-bold text-sm tracking-wide transition-all duration-200 shadow-xl flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4 text-[#D9C7AE]" />
          <span>ADD TO CART</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          onClick={handleBuyNow}
          className="w-full py-3.5 px-6 rounded-full bg-[#E85D32] hover:bg-[#d44e24] text-white font-bold text-sm tracking-wide transition-all duration-200 shadow-md flex items-center justify-center gap-2"
        >
          <Zap className="w-4 h-4 fill-white" />
          <span>BUY NOW</span>
        </motion.button>
      </div>

      {/* Shipping & Delivery Guarantee Info */}
      <div className="pt-4 border-t border-[#D9C7AE]/40 space-y-2 text-xs text-[#6B5546]">
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FFF4EC] border border-[#E85D32]/25">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#E85D32] shrink-0" />
            <span className="font-semibold text-[#241A14]">Bebas Ongkir se-Indonesia</span>
          </div>
          <span className="text-[10px] font-bold text-[#E85D32] bg-white px-2 py-0.5 rounded-full border border-[#E85D32]/30">
            Min. Rp150.000
          </span>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <Truck className="w-4 h-4 text-[#E85D32] shrink-0" />
          <span>Instant & Sameday delivery (Jakarta, Bali, Bandung, Surabaya)</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#6D8B57] shrink-0" />
          <span>Packaging ice gelpack tahan dingin hingga 12 jam</span>
        </div>
      </div>
    </div>
  );
};
