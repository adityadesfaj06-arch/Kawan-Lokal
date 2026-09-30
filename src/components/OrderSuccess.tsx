import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, PackageCheck, Truck, ArrowRight, Calendar, MapPin, ReceiptText } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatRupiah } from '../lib/utils';
import { BrandLogo } from './BrandLogo';

export const OrderSuccess: React.FC = () => {
  const { latestOrder, navigate } = useCart();

  // Fallback demo order if visited directly
  const order = latestOrder || {
    orderId: 'KL-849201',
    date: new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    customerName: 'Kawan Penikmat Kuliner',
    email: 'kawan@lokal.id',
    phone: '0812-3456-7890',
    address: 'Jl. Senopati No. 42, Kebayoran Baru',
    city: 'Jakarta Selatan',
    postalCode: '12430',
    deliveryMethod: 'Standard Delivery' as const,
    deliveryFee: 10000,
    paymentMethod: 'E-Wallet / QRIS',
    items: [
      {
        cartItemId: 'sample',
        productId: 'dubai-chocolate',
        productSlug: 'dubai-chocolate',
        productName: 'Dubai Chocolate Bar',
        variantId: 'original-pistachio',
        variantName: 'Original Pistachio Kataifi',
        packageOptionId: 'single',
        packageName: '1 Bar (120gr)',
        packageMultiplier: 1,
        unitPrice: 45000,
        finalItemPrice: 45000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1548741487-18d16a145e80?auto=format&fit=crop&w=800&q=80',
      },
    ],
    subtotal: 45000,
    total: 55000,
  };

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="bg-[#FFFDF8] rounded-[36px] border border-[#D9C7AE]/60 p-8 sm:p-12 shadow-2xl space-y-8 text-center"
        >
          {/* Top Emoji & Icon */}
          <div className="flex flex-col items-center gap-3">
            <span className="text-5xl sm:text-6xl animate-bounce">🎉</span>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#6D8B57]/15 text-[#4D6C43] text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>PESANAN BERHASIL</span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-[#241A14] tracking-tight">
              ORDER CONFIRMED
            </h1>
            <p className="text-base sm:text-lg text-[#6B5546] font-medium max-w-md">
              &ldquo;Your viral food is on the way.&rdquo; Makanan pilihanmu sedang disiapkan dengan higienis dan bahan segar.
            </p>
          </div>

          {/* Order Details Ticket Card */}
          <div className="p-6 rounded-3xl bg-[#F8F5EF] border border-[#D9C7AE]/50 text-left space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#D9C7AE]/40">
              <BrandLogo variant="horizontal" size="xs" />
              <span className="text-[11px] font-bold text-[#637848] bg-[#EBF3E8] px-2.5 py-1 rounded-full">
                ✓ Official Receipt
              </span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-[#D9C7AE]/40 text-xs">
              <div>
                <span className="text-[#6B5546] block">Nomor Pesanan</span>
                <span className="font-display font-extrabold text-sm text-[#241A14]">
                  {order.orderId}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[#6B5546] block">Waktu Pemesanan</span>
                <span className="font-semibold text-[#241A14]">{order.date}</span>
              </div>
            </div>

            {/* Estimated Delivery Banner */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#FFFDF8] border border-[#D9C7AE]/40">
              <Truck className="w-5 h-5 text-[#E85D32] shrink-0" />
              <div>
                <span className="text-xs font-bold text-[#241A14] block">
                  Estimasi Tiba: Hari ini, 15:00 - 18:00 WIB
                </span>
                <span className="text-[11px] text-[#6B5546]">
                  Metode: {order.deliveryMethod} ({order.city})
                </span>
              </div>
            </div>

            {/* Purchased Items List */}
            <div className="space-y-2.5 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B5546] block">
                RINGKASAN MENU
              </span>
              {order.items.map((item) => (
                <div key={item.cartItemId} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <span className="font-bold text-[#241A14] block">{item.productName}</span>
                      <span className="text-[11px] text-[#6B5546]">
                        {item.variantName} • {item.quantity}x
                      </span>
                    </div>
                  </div>
                  <span className="font-bold text-[#241A14]">
                    {formatRupiah(item.finalItemPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total Paid & Payment Method Details */}
            <div className="pt-3 border-t border-[#D9C7AE]/40 space-y-2">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-[#6B5546] block font-medium">Metode Pembayaran</span>
                  <span className="text-xs font-bold text-[#241A14] block">
                    {order.paymentMethod === 'QRIS / E-Wallet'
                      ? 'QRIS (GoPay Merchant - a.n. EDGARD FANS SIMAHENDALI)'
                      : order.paymentMethod.includes('Virtual Account') || order.paymentMethod === 'Bank Transfer (VA)'
                      ? `Virtual Account (No. Rek: 4280402937 - a.n. EDGARD FANS SIMAHENDALI)`
                      : order.paymentMethod === 'Credit / Debit Card'
                      ? `Kartu Kredit / Debit (•••• ${order.cardLastFour || '4242'}${order.cardHolderName ? ` - ${order.cardHolderName}` : ''})`
                      : 'Cash on Delivery (COD)'}
                  </span>
                </div>
                <span className="font-display font-extrabold text-xl text-[#241A14]">
                  {formatRupiah(order.total)}
                </span>
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-[#6B5546]">Status Pembayaran:</span>
                {order.paymentMethod === 'Cash on Delivery (COD)' || order.paymentStatus === 'COD_BELUM_BAYAR' ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#E85D32] bg-[#FFF3EE] px-2.5 py-1 rounded-full border border-[#E85D32]/30">
                    <span>💵 Bayar Tunai ke Kurir ({formatRupiah(order.total)})</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#4D6C43] bg-[#6D8B57]/15 px-2.5 py-1 rounded-full">
                    <span>✓ LUNAS (Terverifikasi Otomatis)</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('/discover')}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#241A14] hover:bg-[#191614] text-white font-bold text-sm tracking-wider uppercase transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <span>CONTINUE EXPLORING</span>
              <ArrowRight className="w-4 h-4 text-[#D9C7AE]" />
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full sm:w-auto px-6 py-4 rounded-full bg-[#F8F5EF] hover:bg-[#D9C7AE]/40 text-[#6B5546] font-semibold text-xs tracking-wider uppercase transition-colors"
            >
              Kembali ke Beranda
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
