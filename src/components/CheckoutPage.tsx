import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  CreditCard,
  Wallet,
  Building2,
  Banknote,
  Truck,
  ArrowLeft,
  CheckCircle2,
  Lock,
  ArrowRight,
  MapPin,
  Sparkles,
  Plus,
  Check,
  User,
  Home,
  Briefcase,
  Building,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatRupiah } from '../lib/utils';
import { OrderDetails, UserAddress } from '../types';
import { PaymentStep } from './PaymentStep';

export const CheckoutPage: React.FC = () => {
  const { cart, subtotal, clearCart, setLatestOrder, navigate, selectedPaymentMethod, setSelectedPaymentMethod } = useCart();
  const { profile, addresses, defaultAddress, openAuthModal, openAccountDrawer, addAddress } = useAuth();

  // Multi-step checkout: 'details' -> 'payment'
  const [checkoutStep, setCheckoutStep] = useState<'details' | 'payment'>('details');
  const [pendingOrderData, setPendingOrderData] = useState<Omit<OrderDetails, 'orderId' | 'date'> | null>(null);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Jakarta Selatan');
  const [postalCode, setPostalCode] = useState('12430');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Selected saved address ID & save address toggle
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [saveAddressToAccount, setSaveAddressToAccount] = useState(false);

  // Auto-fill from default address or profile on mount
  useEffect(() => {
    if (defaultAddress && !fullName && !address) {
      applyAddress(defaultAddress);
    } else if (profile && !fullName && !email) {
      setFullName(profile.displayName || '');
      setEmail(profile.email || '');
      setPhone(profile.phoneNumber || '');
    }
  }, [defaultAddress, profile]);

  const applyAddress = (addr: UserAddress) => {
    setSelectedAddressId(addr.id);
    setFullName(addr.recipientName);
    setPhone(addr.phoneNumber);
    if (profile?.email) setEmail(profile.email);
    setAddress(addr.street);
    setCity(addr.city);
    setPostalCode(addr.postalCode);
    setDeliveryNotes(addr.notes || '');
    setErrors({});
  };

  const handleCustomAddressClick = () => {
    setSelectedAddressId(null);
    setAddress('');
    setDeliveryNotes('');
  };

  // Options
  const [deliveryMethod, setDeliveryMethod] = useState<'Standard Delivery' | 'Same Day Delivery' | 'Pickup'>('Standard Delivery');
  const [paymentMethod, setPaymentMethod] = useState<string>(() => selectedPaymentMethod || 'QRIS / E-Wallet');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Delivery fee calculation
  const deliveryFee =
    deliveryMethod === 'Pickup'
      ? 0
      : deliveryMethod === 'Same Day Delivery'
      ? 25000
      : subtotal >= 150000
      ? 0
      : 10000;

  const grandTotal = subtotal + deliveryFee;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = 'Nama lengkap wajib diisi';
    if (!email.trim() || !email.includes('@')) newErrors.email = 'Email valid wajib diisi';
    if (!phone.trim()) newErrors.phone = 'Nomor WhatsApp / telepon wajib diisi';
    if (deliveryMethod !== 'Pickup' && !address.trim()) newErrors.address = 'Alamat pengiriman wajib diisi';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const orderPayload: Omit<OrderDetails, 'orderId' | 'date'> = {
      customerName: fullName,
      email,
      phone,
      address,
      city,
      postalCode,
      deliveryNotes,
      deliveryMethod,
      deliveryFee,
      paymentMethod,
      items: [...cart],
      subtotal,
      total: grandTotal,
    };

    // Auto save address to account if user requested it
    if (profile && saveAddressToAccount && !selectedAddressId && address.trim()) {
      addAddress({
        label: 'Alamat Tambahan',
        recipientName: fullName,
        phoneNumber: phone,
        street: address,
        city,
        postalCode,
        notes: deliveryNotes,
        isDefault: false,
      }).catch(console.error);
    }

    // 4. Kalau COD -> langsung order confirmed!
    if (paymentMethod === 'Cash on Delivery (COD)') {
      setIsSubmitting(true);
      const orderId = `KL-${Math.floor(100000 + Math.random() * 900000)}`;
      const fullOrder: OrderDetails = {
        ...orderPayload,
        orderId,
        date: new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        paymentStatus: 'COD_BELUM_BAYAR',
      };

      setTimeout(() => {
        setLatestOrder(fullOrder);
        clearCart();
        setIsSubmitting(false);
        navigate('/order-success');
      }, 700);
      return;
    }

    // 1, 2, 3 -> Lanjut ke step pembayaran (QRIS, VA rek 4280402937, Kartu Kredit/Debit)
    setPendingOrderData(orderPayload);
    setCheckoutStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If in Payment step, render PaymentStep component
  if (checkoutStep === 'payment' && pendingOrderData) {
    return (
      <PaymentStep
        pendingOrder={pendingOrderData}
        onBackToDetails={() => {
          setCheckoutStep('details');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOrderConfirmed={(confirmedOrder) => {
          setLatestOrder(confirmedOrder);
          navigate('/order-success');
        }}
      />
    );
  }

  if (cart.length === 0) {
    return (
      <div className="pt-28 pb-20 min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 rounded-full bg-[#FFFDF8] border border-[#D9C7AE]/60 flex items-center justify-center text-4xl mb-4">
          🛍️
        </div>
        <h2 className="font-display font-bold text-2xl text-[#241A14]">
          Keranjang Kamu Kosong
        </h2>
        <p className="mt-2 text-sm text-[#6B5546] max-w-sm">
          Pilih makanan viral yang ingin kamu coba terlebih dahulu sebelum melanjutkan ke checkout.
        </p>
        <button
          onClick={() => navigate('/discover')}
          className="mt-6 px-7 py-3.5 rounded-full bg-[#241A14] text-white font-semibold text-xs tracking-wider uppercase hover:bg-[#E85D32] transition-colors"
        >
          Explore Makanan Viral
        </button>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-24 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Top Back Navigation */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/discover')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#6B5546] hover:text-[#241A14] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Belanja</span>
          </button>
        </div>

        <div className="mb-8">
          <h1 className="font-display font-black text-3xl sm:text-4xl text-[#241A14] tracking-tight">
            CHECKOUT PESANAN
          </h1>
          <p className="mt-1 text-sm sm:text-base text-[#6B5546]">
            Selesaikan detail pengiriman untuk menikmati makanan viral pilihanmu.
          </p>
        </div>

        {/* Main Grid: Form (Left) & Order Summary (Right) */}
        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Account Quick Status or Login Prompt */}
            {profile ? (
              <div className="p-4 sm:p-5 rounded-3xl bg-[#FFFDF8] border border-[#6D8B57]/40 shadow-sm flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#241A14] text-white flex items-center justify-center font-bold text-base shadow-sm">
                    {profile.displayName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#241A14]">
                        Masuk sebagai: {profile.displayName}
                      </span>
                      <span className="text-[10px] font-black uppercase px-2 py-0.2 rounded-full bg-[#6D8B57]/15 text-[#4D6C43]">
                        Akun Aktif
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6B5546]">
                      {addresses.length} alamat pengiriman tersimpan siap digunakan.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={openAccountDrawer}
                  className="px-3.5 py-1.5 rounded-full bg-[#F8F5EF] hover:bg-[#241A14] hover:text-white text-[#241A14] text-xs font-bold border border-[#D9C7AE]/60 transition-all shrink-0"
                >
                  Kelola Alamat
                </button>
              </div>
            ) : (
              <div className="p-4 sm:p-5 rounded-3xl bg-[#FFF3EE] border border-[#E85D32]/30 shadow-sm flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#E85D32]/10 flex items-center justify-center text-[#E85D32] shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-[#241A14]">
                      Punya Akun Kawan Lokal?
                    </p>
                    <p className="text-[11px] text-[#6B5546]">
                      Masuk untuk menggunakan alamat tersimpan &amp; belanja jauh lebih cepat!
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="px-4 py-2 rounded-full bg-[#241A14] hover:bg-[#E85D32] text-white text-xs font-bold transition-all shrink-0 shadow-sm"
                >
                  Masuk / Daftar
                </button>
              </div>
            )}

            {/* 1. Contact Information */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#FFFDF8] border border-[#D9C7AE]/60 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E85D32]">
                <span className="w-2 h-2 rounded-full bg-[#E85D32]" />
                <span>1. CONTACT INFORMATION</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-[#241A14]">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors({ ...errors, fullName: '' });
                    }}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full p-3 rounded-xl bg-[#F8F5EF] border border-[#D9C7AE]/60 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#E85D32]/30 text-[#241A14]"
                  />
                  {errors.fullName && <p className="text-xs text-[#B94A35]">{errors.fullName}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#241A14]">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    placeholder="nama@email.com"
                    className="w-full p-3 rounded-xl bg-[#F8F5EF] border border-[#D9C7AE]/60 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#E85D32]/30 text-[#241A14]"
                  />
                  {errors.email && <p className="text-xs text-[#B94A35]">{errors.email}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#241A14]">
                    Nomor WhatsApp / HP *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors({ ...errors, phone: '' });
                    }}
                    placeholder="08123456789"
                    className="w-full p-3 rounded-xl bg-[#F8F5EF] border border-[#D9C7AE]/60 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#E85D32]/30 text-[#241A14]"
                  />
                  {errors.phone && <p className="text-xs text-[#B94A35]">{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* 2. Delivery Address */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#FFFDF8] border border-[#D9C7AE]/60 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-1 border-b border-[#D9C7AE]/40">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E85D32]">
                  <span className="w-2 h-2 rounded-full bg-[#E85D32]" />
                  <span>2. DELIVERY ADDRESS</span>
                </div>
                {profile && addresses.length > 0 && (
                  <button
                    type="button"
                    onClick={openAccountDrawer}
                    className="text-xs font-bold text-[#E85D32] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Alamat Baru</span>
                  </button>
                )}
              </div>

              {/* Saved Address Book Cards */}
              {addresses.length > 0 && (
                <div className="space-y-2.5">
                  <span className="text-xs font-bold text-[#6B5546] block">
                    Pilih Dari Alamat Tersimpan:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {addresses.map((addr) => {
                      const isSelected = selectedAddressId === addr.id;
                      return (
                        <div
                          key={addr.id}
                          onClick={() => applyAddress(addr)}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'border-[#241A14] bg-[#241A14]/5 ring-2 ring-[#241A14]'
                              : 'border-[#D9C7AE]/60 bg-[#F8F5EF] hover:border-[#241A14]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-1.5">
                              <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-[#E85D32]' : 'text-[#6B5546]'}`} />
                              <span className="font-bold text-xs text-[#241A14]">{addr.label}</span>
                              {addr.isDefault && (
                                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-[#6D8B57] text-white">
                                  Utama
                                </span>
                              )}
                            </div>
                            <input
                              type="radio"
                              name="savedAddressRadio"
                              checked={isSelected}
                              onChange={() => applyAddress(addr)}
                              className="text-[#E85D32] focus:ring-[#E85D32]"
                            />
                          </div>
                          <p className="font-bold text-xs text-[#241A14] truncate">
                            {addr.recipientName} ({addr.phoneNumber})
                          </p>
                          <p className="text-[11px] text-[#6B5546] line-clamp-2 mt-0.5">
                            {addr.street}, {addr.city}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Manual / custom address option button */}
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={handleCustomAddressClick}
                      className={`text-[11px] font-bold transition-all ${
                        selectedAddressId === null
                          ? 'text-[#E85D32] underline'
                          : 'text-[#6B5546] hover:text-[#241A14]'
                      }`}
                    >
                      + Ketik Alamat Pengiriman Lainnya
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#241A14]">
                    Alamat Lengkap (Jalan, No Rumah, RT/RW, Patokan) *
                  </label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (errors.address) setErrors({ ...errors, address: '' });
                    }}
                    placeholder="Jl. Senopati Raya No. 42, Kebayoran Baru (Pagar Hitam)"
                    className="w-full p-3 rounded-xl bg-[#F8F5EF] border border-[#D9C7AE]/60 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#E85D32]/30 text-[#241A14]"
                  />
                  {errors.address && <p className="text-xs text-[#B94A35]">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#241A14]">Kota</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full p-3 rounded-xl bg-[#F8F5EF] border border-[#D9C7AE]/60 text-sm font-medium text-[#241A14] focus:outline-none"
                    >
                      <option value="Jakarta Selatan">Jakarta Selatan</option>
                      <option value="Jakarta Pusat">Jakarta Pusat</option>
                      <option value="Jakarta Barat">Jakarta Barat</option>
                      <option value="Jakarta Timur">Jakarta Timur</option>
                      <option value="Jakarta Utara">Jakarta Utara</option>
                      <option value="Bandung">Bandung</option>
                      <option value="Denpasar / Bali">Denpasar / Bali</option>
                      <option value="Surabaya">Surabaya</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#241A14]">Kode Pos</label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="12430"
                      className="w-full p-3 rounded-xl bg-[#F8F5EF] border border-[#D9C7AE]/60 text-sm font-medium text-[#241A14] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#241A14]">Catatan Pengiriman (Opsional)</label>
                  <input
                    type="text"
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder="Titip di pos satpam / Jangan dibanting ya bang"
                    className="w-full p-3 rounded-xl bg-[#F8F5EF] border border-[#D9C7AE]/60 text-sm font-medium text-[#241A14] focus:outline-none"
                  />
                </div>

                {profile && !selectedAddressId && (
                  <label className="flex items-center gap-2 pt-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={saveAddressToAccount}
                      onChange={(e) => setSaveAddressToAccount(e.target.checked)}
                      className="rounded text-[#E85D32] focus:ring-[#E85D32]"
                    />
                    <span className="text-xs text-[#241A14] font-medium">
                      Simpan alamat ini ke buku alamat akun saya untuk belanja berikutnya
                    </span>
                  </label>
                )}
              </div>
            </div>

            {/* 3. Delivery Method */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#FFFDF8] border border-[#D9C7AE]/60 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E85D32]">
                <span className="w-2 h-2 rounded-full bg-[#E85D32]" />
                <span>3. DELIVERY METHOD</span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {[
                  {
                    id: 'Standard Delivery',
                    title: 'Standard Delivery (1-2 Hari)',
                    desc: 'Pengiriman kurir berpendingin khusus makanan',
                    priceText: subtotal >= 150000 ? 'GRATIS' : 'Rp10.000',
                  },
                  {
                    id: 'Same Day Delivery',
                    title: 'Same Day Instant Delivery',
                    desc: 'Tiba dalam 3-6 jam setelah bake selesai',
                    priceText: 'Rp25.000',
                  },
                  {
                    id: 'Pickup',
                    title: 'Self Pickup di Central Kitchen',
                    desc: 'Ambil langsung di hub Kawan Lokal (Senopati / Seminyak)',
                    priceText: 'GRATIS',
                  },
                ].map((method) => {
                  const isChecked = deliveryMethod === method.id;
                  return (
                    <label
                      key={method.id}
                      className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                        isChecked
                          ? 'border-[#241A14] bg-[#241A14]/5'
                          : 'border-[#D9C7AE]/50 bg-[#F8F5EF] hover:border-[#241A14]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="deliveryMethod"
                          checked={isChecked}
                          onChange={() => setDeliveryMethod(method.id as any)}
                          className="w-4 h-4 text-[#E85D32] focus:ring-[#E85D32]"
                        />
                        <div>
                          <span className="font-bold text-sm text-[#241A14] block">
                            {method.title}
                          </span>
                          <span className="text-xs text-[#6B5546]">
                            {method.desc}
                          </span>
                        </div>
                      </div>
                      <span className="font-bold text-xs text-[#E85D32] whitespace-nowrap">
                        {method.priceText}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 4. Payment Method */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#FFFDF8] border border-[#D9C7AE]/60 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E85D32]">
                <span className="w-2 h-2 rounded-full bg-[#E85D32]" />
                <span>4. METODE PEMBAYARAN</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'QRIS / E-Wallet',
                    label: 'QRIS / E-Wallet',
                    sub: 'GoPay Standee, OVO, ShopeePay, DANA, BCA Mobile',
                    icon: Wallet,
                    badge: 'Scan & Bayar',
                  },
                  {
                    id: 'Bank Transfer (VA)',
                    label: 'Virtual Account',
                    sub: 'No Rek: 4280402937 (BCA, Mandiri, BRI, BNI)',
                    icon: Building2,
                    badge: 'Rek 4280402937',
                  },
                  {
                    id: 'Credit / Debit Card',
                    label: 'Kartu Kredit / Debit',
                    sub: 'Input No. Kartu, Masa Berlaku & CVV',
                    icon: CreditCard,
                    badge: '3D Secure',
                  },
                  {
                    id: 'Cash on Delivery (COD)',
                    label: 'Cash on Delivery',
                    sub: 'Langsung Order Confirmed (bayar saat tiba)',
                    icon: Banknote,
                    badge: 'Langsung Confirmed',
                  },
                ].map((item) => {
                  const isChecked = paymentMethod === item.id;
                  const Icon = item.icon;
                  return (
                    <label
                      key={item.id}
                      className={`p-3.5 rounded-2xl border flex flex-col justify-between gap-2.5 cursor-pointer transition-all ${
                        isChecked
                          ? 'border-[#E85D32] bg-[#E85D32]/10 text-[#241A14] shadow-sm'
                          : 'border-[#D9C7AE]/50 bg-[#F8F5EF] text-[#6B5546] hover:border-[#241A14]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className={`w-5 h-5 ${isChecked ? 'text-[#E85D32]' : 'text-[#6B5546]'}`} />
                          <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                            isChecked ? 'bg-[#E85D32] text-white' : 'bg-[#D9C7AE]/40 text-[#6B5546]'
                          }`}>
                            {item.badge}
                          </span>
                        </div>
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={isChecked}
                          onChange={() => {
                            setPaymentMethod(item.id);
                            setSelectedPaymentMethod(item.id);
                          }}
                          className="w-4 h-4 text-[#E85D32] focus:ring-[#E85D32]"
                        />
                      </div>
                      <div>
                        <span className="block font-bold text-xs sm:text-sm text-[#241A14]">
                          {item.label}
                        </span>
                        <span className="block text-[11px] text-[#6B5546] mt-0.5 leading-snug">
                          {item.sub}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Summary Column (5 Cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <div className="p-6 sm:p-7 rounded-3xl bg-[#FFFDF8] border border-[#D9C7AE]/60 shadow-lg space-y-6">
              <h3 className="font-display font-extrabold text-xl text-[#241A14] pb-3 border-b border-[#D9C7AE]/40">
                Ringkasan Pesanan
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.cartItemId} className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={item.image}
                        alt={item.productName}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-cover shrink-0 border border-[#D9C7AE]/40"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-[#241A14] truncate">{item.productName}</p>
                        <p className="text-[11px] text-[#6B5546] truncate">
                          {item.variantName} • {item.packageName}
                        </p>
                        <p className="text-[11px] text-[#6B5546]">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-[#241A14] shrink-0">
                      {formatRupiah(item.finalItemPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Cost Calculations */}
              <div className="pt-4 border-t border-[#D9C7AE]/40 space-y-2.5 text-xs">
                <div className="flex justify-between text-[#6B5546]">
                  <span>Subtotal Item</span>
                  <span className="font-semibold text-[#241A14]">{formatRupiah(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#6B5546]">
                  <span>Biaya Pengiriman ({deliveryMethod})</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <span className="text-[#E85D32] font-bold">GRATIS</span>
                    ) : (
                      formatRupiah(deliveryFee)
                    )}
                  </span>
                </div>

                <div className="pt-3 border-t border-[#D9C7AE]/40 flex items-baseline justify-between text-base font-black text-[#241A14]">
                  <span>Total Tagihan</span>
                  <span className="font-display text-2xl text-[#241A14]">
                    {formatRupiah(grandTotal)}
                  </span>
                </div>
              </div>

              {/* Security Badge */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#F8F5EF] text-[11px] text-[#6B5546]">
                <Lock className="w-4 h-4 text-[#6D8B57] shrink-0" />
                <span>Transaksi aman & garansi uang kembali jika kualitas tidak sesuai.</span>
              </div>

              {/* CTA Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                className="w-full py-4 px-6 rounded-full bg-[#241A14] hover:bg-[#191614] text-white font-bold text-sm tracking-wider uppercase transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Memproses Pesanan...</span>
                ) : paymentMethod === 'Cash on Delivery (COD)' ? (
                  <>
                    <span>PLACE ORDER (COD)</span>
                    <span>•</span>
                    <span>{formatRupiah(grandTotal)}</span>
                  </>
                ) : (
                  <>
                    <span>LANJUT KE PEMBAYARAN</span>
                    <ArrowRight className="w-4 h-4 text-[#D9C7AE]" />
                    <span>•</span>
                    <span>{formatRupiah(grandTotal)}</span>
                  </>
                )}
              </motion.button>
              <p className="text-[11px] text-center text-[#6B5546]">
                {paymentMethod === 'Cash on Delivery (COD)'
                  ? '✓ Pembayaran COD langsung selesai, bayar tunai ke kurir saat barang tiba.'
                  : '✓ Langkah selanjutnya: Scan QRIS, salin rekening VA 4280402937, atau input kartu.'}
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
