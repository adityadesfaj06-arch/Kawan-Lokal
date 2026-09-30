import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Wallet,
  Building2,
  CreditCard,
  Banknote,
  Check,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatRupiah } from '../lib/utils';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    subtotal,
    navigate,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
  } = useCart();

  const FREE_SHIPPING_THRESHOLD = 150000;
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const deliveryFee = subtotal > 0 ? (isFreeShipping ? 0 : 10000) : 0;
  const grandTotal = subtotal + deliveryFee;
  const progressPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  const PAYMENT_METHODS = [
    { id: 'QRIS / E-Wallet', label: 'QRIS / E-Wallet', icon: Wallet, note: 'GoPay, OVO, ShopeePay' },
    { id: 'Bank Transfer (VA)', label: 'Virtual Account', icon: Building2, note: 'BCA, Mandiri, BRI' },
    { id: 'Credit / Debit Card', label: 'Kartu Kredit/Debit', icon: CreditCard, note: 'Visa, Mastercard' },
    { id: 'Cash on Delivery (COD)', label: 'COD (Bayar di Tempat)', icon: Banknote, note: 'Bayar saat tiba' },
  ];

  const handleCheckoutClick = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-[#191614]/70 backdrop-blur-sm transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            {/* Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="w-screen max-w-md bg-[#FFFDF8] border-l border-[#D9C7AE]/60 shadow-2xl flex flex-col justify-between"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-[#D9C7AE]/40 flex items-center justify-between bg-[#F8F5EF]/80">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-full bg-[#E85D32]/10 text-[#E85D32]">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-display font-extrabold text-lg text-[#241A14]">
                      Keranjang Pesanan
                    </h2>
                    <p className="text-xs text-[#6B5546]">
                      {cart.length} item dipilih
                    </p>
                  </div>
                </div>

                <button
                  onClick={closeCart}
                  aria-label="Tutup keranjang"
                  className="p-2 rounded-full hover:bg-[#D9C7AE]/30 text-[#241A14] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Shipping Tracker Banner */}
              {cart.length > 0 && (
                <div className="px-6 py-3.5 bg-gradient-to-r from-[#FFF9F2] to-[#FFF4EC] border-b border-[#E85D32]/20">
                  <div className="flex items-center justify-between gap-2 text-xs font-semibold mb-2">
                    <div className="flex items-center gap-1.5">
                      <Truck className={`w-4 h-4 ${isFreeShipping ? 'text-emerald-600' : 'text-[#E85D32]'}`} />
                      {isFreeShipping ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Kamu Mendapatkan Bebas Ongkir!
                        </span>
                      ) : (
                        <span className="text-[#241A14]">
                          Tambah <strong className="text-[#E85D32]">{formatRupiah(FREE_SHIPPING_THRESHOLD - subtotal)}</strong> lagi untuk Gratis Ongkir
                        </span>
                      )}
                    </div>
                    <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                      isFreeShipping ? 'bg-emerald-100 text-emerald-800' : 'bg-[#E85D32]/10 text-[#E85D32]'
                    }`}>
                      {isFreeShipping ? 'GRATIS ONGKIR' : `${progressPercent}%`}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-[#E8D9C7]/50 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isFreeShipping ? 'bg-emerald-500' : 'bg-[#E85D32]'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-16">
                    <div className="w-20 h-20 rounded-full bg-[#F8F5EF] border border-[#D9C7AE]/40 flex items-center justify-center text-4xl mb-4">
                      🥐
                    </div>
                    <h3 className="font-display font-bold text-xl text-[#241A14]">
                      Keranjang kamu masih kosong
                    </h3>
                    <p className="mt-2 text-sm text-[#6B5546] max-w-xs">
                      Yuk temukan makanan viral yang sudah dicoba dan terbukti beneran enak!
                    </p>
                    <button
                      onClick={() => {
                        closeCart();
                        navigate('/discover');
                      }}
                      className="mt-6 px-6 py-3 rounded-full bg-[#241A14] text-white font-semibold text-xs tracking-wider uppercase hover:bg-[#E85D32] transition-colors"
                    >
                      Mulai Belanja Viral
                    </button>
                  </div>
                ) : (
                  <>
                    {cart.map((item) => (
                      <div
                        key={item.cartItemId}
                        className="flex gap-4 p-3.5 rounded-2xl bg-[#F8F5EF] border border-[#D9C7AE]/40 relative group"
                      >
                        {/* Image */}
                        <img
                          src={item.image}
                          alt={item.productName}
                          referrerPolicy="no-referrer"
                          className="w-20 h-20 rounded-xl object-cover shrink-0 border border-[#D9C7AE]/50"
                        />

                        {/* Details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-display font-bold text-sm text-[#241A14] truncate">
                                {item.productName}
                              </h4>
                              <button
                                onClick={() => removeFromCart(item.cartItemId)}
                                aria-label={`Hapus ${item.productName}`}
                                className="text-[#6B5546] hover:text-[#B94A35] p-1 rounded transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-xs text-[#6B5546] truncate">
                              Varian: <span className="font-medium text-[#241A14]">{item.variantName}</span>
                            </p>
                            <p className="text-[11px] text-[#6B5546]">
                              Porsi: {item.packageName}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-2 mt-1">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2 bg-[#FFFDF8] border border-[#D9C7AE]/60 rounded-full px-2 py-0.5">
                              <button
                                onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                                className="p-0.5 hover:text-[#E85D32] text-[#241A14]"
                                aria-label="Kurangi jumlah"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold text-[#241A14] w-4 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                className="p-0.5 hover:text-[#E85D32] text-[#241A14]"
                                aria-label="Tambah jumlah"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Item Total */}
                            <span className="font-display font-extrabold text-sm text-[#241A14]">
                              {formatRupiah(item.finalItemPrice * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>

              {/* Drawer Footer & Checkout Summary */}
              {cart.length > 0 && (
                <div className="p-5 sm:p-6 border-t border-[#D9C7AE]/40 bg-[#FFFDF8] space-y-4 max-h-[50vh] overflow-y-auto">
                  {/* Payment Method Selector in Cart */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#241A14] flex items-center gap-1.5">
                        <Wallet className="w-3.5 h-3.5 text-[#E85D32]" />
                        Metode Pembayaran
                      </span>
                      <span className="text-[11px] font-semibold text-[#E85D32]">
                        {selectedPaymentMethod}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {PAYMENT_METHODS.map((method) => {
                        const Icon = method.icon;
                        const isSelected = selectedPaymentMethod === method.id;
                        return (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() => setSelectedPaymentMethod(method.id)}
                            className={`p-2.5 rounded-xl border text-left flex items-start gap-2 transition-all ${
                              isSelected
                                ? 'bg-[#E85D32]/10 border-[#E85D32] ring-1 ring-[#E85D32]'
                                : 'bg-[#F8F5EF] border-[#D9C7AE]/60 hover:border-[#241A14] text-[#6B5546]'
                            }`}
                          >
                            <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-[#E85D32]' : 'text-[#6B5546]'}`} />
                            <div className="min-w-0">
                              <span className={`block text-[11px] font-bold truncate leading-tight ${isSelected ? 'text-[#241A14]' : 'text-[#241A14]'}`}>
                                {method.label}
                              </span>
                              <span className="block text-[9px] text-[#917562] truncate mt-0.5">
                                {method.note}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Summary & Shipping Status */}
                  <div className="pt-2 border-t border-[#D9C7AE]/40 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-[#6B5546]">
                      <span>Subtotal Item</span>
                      <span className="font-medium text-[#241A14]">{formatRupiah(subtotal)}</span>
                    </div>

                    <div className="flex items-center justify-between text-[#6B5546]">
                      <span className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-[#6B5546]" />
                        Ongkos Kirim
                      </span>
                      <span>
                        {isFreeShipping ? (
                          <span className="inline-flex items-center gap-1 font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[11px]">
                            <Check className="w-3 h-3 text-emerald-700" />
                            GRATIS ONGKIR
                          </span>
                        ) : (
                          <div className="text-right">
                            <span className="font-semibold text-[#241A14]">{formatRupiah(deliveryFee)}</span>
                            <span className="block text-[10px] text-[#B94A35]">
                              Belum gratis (Min. {formatRupiah(FREE_SHIPPING_THRESHOLD)})
                            </span>
                          </div>
                        )}
                      </span>
                    </div>

                    {!isFreeShipping && (
                      <div className="p-2 rounded-lg bg-[#FFF4EC] border border-[#E85D32]/20 flex items-center justify-between gap-2 text-[11px] text-[#E85D32]">
                        <span>Kurang <strong>{formatRupiah(FREE_SHIPPING_THRESHOLD - subtotal)}</strong> lagi!</span>
                        <button
                          type="button"
                          onClick={() => {
                            closeCart();
                            navigate('/discover');
                          }}
                          className="font-bold underline hover:text-[#C74820]"
                        >
                          + Tambah Item
                        </button>
                      </div>
                    )}

                    <div className="pt-2 border-t border-[#D9C7AE]/40 flex items-baseline justify-between text-base font-extrabold text-[#241A14]">
                      <span>Total Pembayaran</span>
                      <span className="font-display text-xl text-[#241A14]">{formatRupiah(grandTotal)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-[#6B5546]">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Garansi Makanan Segar • Terverifikasi Halal & Higienis</span>
                  </div>

                  <div className="space-y-2 pt-1">
                    <button
                      onClick={handleCheckoutClick}
                      className="w-full py-3.5 px-6 rounded-full bg-[#241A14] hover:bg-[#191614] text-white font-bold text-sm tracking-wide transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
                    >
                      <span>LANJUT KE CHECKOUT</span>
                      <ArrowRight className="w-4 h-4 text-[#D9C7AE]" />
                    </button>

                    <button
                      onClick={closeCart}
                      className="w-full py-2.5 px-4 rounded-full bg-[#F8F5EF] hover:bg-[#D9C7AE]/30 text-[#6B5546] font-semibold text-xs transition-colors text-center"
                    >
                      Lanjut Belanja Jajanan Lain
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
