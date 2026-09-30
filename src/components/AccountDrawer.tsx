import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  User,
  MapPin,
  Plus,
  Trash2,
  Edit2,
  Check,
  Star,
  LogOut,
  Phone,
  Mail,
  Home,
  Briefcase,
  Building,
  Save,
  ShoppingBag,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { UserAddress } from '../types';
import { formatRupiah } from '../lib/utils';

export const AccountDrawer: React.FC = () => {
  const {
    profile,
    addresses,
    isAccountDrawerOpen,
    closeAccountDrawer,
    logout,
    updateUserProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  } = useAuth();
  const { showToast, latestOrder } = useCart();

  const [activeTab, setActiveTab] = useState<'addresses' | 'profile' | 'orders'>('addresses');

  // Address Modal / Form state
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressLabel, setAddressLabel] = useState('Rumah');
  const [recipientName, setRecipientName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [notes, setNotes] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  // Profile Form state
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editFavorite, setEditFavorite] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  React.useEffect(() => {
    if (profile) {
      setEditName(profile.displayName || '');
      setEditPhone(profile.phoneNumber || '');
      setEditFavorite(profile.favoriteCategory || 'Pedas Daun Jeruk');
    }
  }, [profile, isAccountDrawerOpen]);

  // Lock background scroll when drawer is open
  React.useEffect(() => {
    if (isAccountDrawerOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [isAccountDrawerOpen]);

  if (!isAccountDrawerOpen || !profile) return null;

  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddressLabel('Rumah');
    setRecipientName(profile.displayName || '');
    setPhoneNumber(profile.phoneNumber || '');
    setStreet('');
    setCity('Jakarta Selatan');
    setPostalCode('');
    setNotes('');
    setIsDefault(addresses.length === 0);
    setIsAddressModalOpen(true);
  };

  const handleOpenEditAddress = (addr: UserAddress) => {
    setEditingAddressId(addr.id);
    setAddressLabel(addr.label);
    setRecipientName(addr.recipientName);
    setPhoneNumber(addr.phoneNumber);
    setStreet(addr.street);
    setCity(addr.city);
    setPostalCode(addr.postalCode);
    setNotes(addr.notes || '');
    setIsDefault(addr.isDefault || false);
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!street.trim() || !recipientName.trim() || !phoneNumber.trim()) {
      showToast('Mohon lengkapi nama penerima, no HP, dan alamat.');
      return;
    }

    if (editingAddressId) {
      await updateAddress(editingAddressId, {
        label: addressLabel,
        recipientName,
        phoneNumber,
        street,
        city,
        postalCode,
        notes,
        isDefault,
      });
      showToast('Alamat berhasil diperbarui!');
    } else {
      await addAddress({
        label: addressLabel,
        recipientName,
        phoneNumber,
        street,
        city,
        postalCode,
        notes,
        isDefault,
      });
      showToast('Alamat baru berhasil ditambahkan!');
    }

    setIsAddressModalOpen(false);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    await updateUserProfile({
      displayName: editName,
      phoneNumber: editPhone,
      favoriteCategory: editFavorite,
    });
    setIsSavingProfile(false);
    showToast('Profil dan data pribadi berhasil disimpan!');
  };

  const getLabelIcon = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes('kantor') || l.includes('office')) return Briefcase;
    if (l.includes('kost') || l.includes('apartemen')) return Building;
    return Home;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeAccountDrawer}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="w-screen max-w-lg bg-[#FFFDF8] border-l border-[#D9C7AE]/60 shadow-2xl flex flex-col justify-between"
        >
          {/* Top Bar */}
          <div className="p-6 border-b border-[#D9C7AE]/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#241A14] text-white flex items-center justify-center font-display font-black text-xl shadow-md">
                {profile.displayName?.charAt(0).toUpperCase() || 'K'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-black text-lg text-[#241A14] leading-tight">
                    {profile.displayName}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E85D32]/10 text-[#E85D32]">
                    Member
                  </span>
                </div>
                <p className="text-xs text-[#6B5546]">{profile.email}</p>
              </div>
            </div>

            <button
              onClick={closeAccountDrawer}
              className="p-2 rounded-full text-[#6B5546] hover:text-[#241A14] hover:bg-[#F8F5EF]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-[#D9C7AE]/40 px-6 bg-[#FAF7F2] text-xs font-bold">
            <button
              onClick={() => setActiveTab('addresses')}
              className={`py-3.5 px-3 border-b-2 flex items-center gap-1.5 transition-all ${
                activeTab === 'addresses'
                  ? 'border-[#E85D32] text-[#E85D32]'
                  : 'border-transparent text-[#6B5546] hover:text-[#241A14]'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Alamat Tersimpan ({addresses.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`py-3.5 px-3 border-b-2 flex items-center gap-1.5 transition-all ${
                activeTab === 'profile'
                  ? 'border-[#E85D32] text-[#E85D32]'
                  : 'border-transparent text-[#6B5546] hover:text-[#241A14]'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Data Pribadi</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`py-3.5 px-3 border-b-2 flex items-center gap-1.5 transition-all ${
                activeTab === 'orders'
                  ? 'border-[#E85D32] text-[#E85D32]'
                  : 'border-transparent text-[#6B5546] hover:text-[#241A14]'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Riwayat Belanja</span>
            </button>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* TAB 1: ALAMAT TERSIMPAN */}
            {activeTab === 'addresses' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-display font-bold text-base text-[#241A14]">
                      Buku Alamat Pengiriman
                    </h4>
                    <p className="text-xs text-[#6B5546]">
                      Alamat ini otomatis muncul saat proses Checkout.
                    </p>
                  </div>
                  <button
                    onClick={handleOpenAddAddress}
                    className="px-3 py-1.5 rounded-full bg-[#241A14] hover:bg-[#E85D32] text-white text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Alamat</span>
                  </button>
                </div>

                {addresses.length === 0 ? (
                  <div className="p-8 rounded-3xl bg-[#F8F5EF] border border-dashed border-[#D9C7AE] text-center space-y-3">
                    <MapPin className="w-10 h-10 text-[#6B5546]/50 mx-auto" />
                    <div>
                      <p className="font-bold text-sm text-[#241A14]">Belum Ada Alamat Tersimpan</p>
                      <p className="text-xs text-[#6B5546] mt-1">
                        Tambahkan alamat rumah atau kantor agar checkout tinggal 1 klik!
                      </p>
                    </div>
                    <button
                      onClick={handleOpenAddAddress}
                      className="px-4 py-2 rounded-full bg-[#E85D32] text-white text-xs font-bold hover:bg-[#c94d27]"
                    >
                      + Tambah Alamat Sekarang
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((addr) => {
                      const Icon = getLabelIcon(addr.label);
                      return (
                        <div
                          key={addr.id}
                          className={`p-4 rounded-2xl border transition-all ${
                            addr.isDefault
                              ? 'border-[#241A14] bg-[#FFFDF8] shadow-md ring-1 ring-[#241A14]'
                              : 'border-[#D9C7AE]/60 bg-[#F8F5EF]/60 hover:bg-[#FFFDF8]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="p-1.5 rounded-lg bg-[#241A14]/5 text-[#241A14]">
                                <Icon className="w-3.5 h-3.5" />
                              </span>
                              <span className="font-display font-bold text-sm text-[#241A14]">
                                {addr.label}
                              </span>
                              {addr.isDefault && (
                                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#6D8B57] text-white flex items-center gap-1">
                                  <Check className="w-2.5 h-2.5" />
                                  <span>Utama</span>
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1">
                              {!addr.isDefault && (
                                <button
                                  onClick={() => setDefaultAddress(addr.id)}
                                  className="text-[11px] text-[#6B5546] hover:text-[#241A14] font-semibold px-2 py-1 hover:bg-black/5 rounded-lg"
                                >
                                  Jadikan Utama
                                </button>
                              )}
                              <button
                                onClick={() => handleOpenEditAddress(addr)}
                                className="p-1.5 text-[#6B5546] hover:text-[#241A14] rounded-lg hover:bg-black/5"
                                title="Edit Alamat"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => deleteAddress(addr.id)}
                                className="p-1.5 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50"
                                title="Hapus Alamat"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="text-xs space-y-1 text-[#241A14]">
                            <p className="font-bold">
                              {addr.recipientName}{' '}
                              <span className="font-normal text-[#6B5546]">({addr.phoneNumber})</span>
                            </p>
                            <p className="text-[#6B5546] leading-relaxed">{addr.street}</p>
                            <p className="text-[#6B5546]">
                              {addr.city}, {addr.postalCode}
                            </p>
                            {addr.notes && (
                              <p className="text-[11px] text-[#CA9344] italic pt-1">
                                Patokan: {addr.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: DATA PRIBADI */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <h4 className="font-display font-bold text-base text-[#241A14]">
                    Data Profil &amp; Kontak
                  </h4>
                  <p className="text-xs text-[#6B5546]">
                    Informasi ini digunakan untuk konfirmasi order dan pengiriman.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-[#241A14] block mb-1">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-[#F8F5EF] border border-[#D9C7AE]/60 text-xs text-[#241A14] focus:outline-none focus:ring-2 focus:ring-[#241A14]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#241A14] block mb-1">
                      Nomor WhatsApp / HP
                    </label>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="081234567890"
                      className="w-full px-4 py-2.5 rounded-2xl bg-[#F8F5EF] border border-[#D9C7AE]/60 text-xs text-[#241A14] focus:outline-none focus:ring-2 focus:ring-[#241A14]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#241A14] block mb-1">
                      Alamat Email (Akun)
                    </label>
                    <input
                      type="email"
                      disabled
                      value={profile.email}
                      className="w-full px-4 py-2.5 rounded-2xl bg-[#F8F5EF]/60 border border-[#D9C7AE]/40 text-xs text-[#6B5546] cursor-not-allowed"
                    />
                    <span className="text-[10px] text-[#6B5546] mt-0.5 block">
                      Email akun login tidak dapat diubah secara langsung.
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#241A14] block mb-1">
                      Kategori Camilan Favorit
                    </label>
                    <select
                      value={editFavorite}
                      onChange={(e) => setEditFavorite(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-[#F8F5EF] border border-[#D9C7AE]/60 text-xs text-[#241A14] focus:outline-none focus:ring-2 focus:ring-[#241A14]"
                    >
                      <option value="Pedas Daun Jeruk (Basreng & Seblak)">
                        🌶️ Pedas Daun Jeruk (Basreng &amp; Seblak)
                      </option>
                      <option value="Mala Gurih (Latiao & Chunky)">
                        🌶️ Mala Gurih (Latiao &amp; Chunky)
                      </option>
                      <option value="Kuah Segar (Baso Aci & Cuanki)">
                        🍲 Kuah Segar (Baso Aci &amp; Cuanki)
                      </option>
                      <option value="Manis Cafe (Thai Tea & Boba Powder)">
                        🧋 Manis Cafe (Thai Tea &amp; Boba Powder)
                      </option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <motion.button
                    type="submit"
                    disabled={isSavingProfile}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full py-3 px-4 rounded-full bg-[#241A14] hover:bg-[#191614] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSavingProfile ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                  </motion.button>
                </div>
              </form>
            )}

            {/* TAB 3: RIWAYAT PESANAN */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-display font-bold text-base text-[#241A14]">
                    Riwayat Belanja Anda
                  </h4>
                  <p className="text-xs text-[#6B5546]">
                    Daftar pesanan jajan lokal yang pernah dibuat.
                  </p>
                </div>

                {latestOrder ? (
                  <div className="p-4 rounded-2xl bg-[#F8F5EF] border border-[#D9C7AE]/60 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-[#D9C7AE]/40">
                      <div>
                        <span className="font-mono font-bold text-xs text-[#241A14]">
                          {latestOrder.orderId}
                        </span>
                        <p className="text-[11px] text-[#6B5546]">{latestOrder.date}</p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#6D8B57]/15 text-[#4D6C43]">
                        {latestOrder.paymentStatus === 'COD_BELUM_BAYAR' ? 'COD Diproses' : 'Lunas ✓'}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      {latestOrder.items.map((it) => (
                        <div key={it.cartItemId} className="flex justify-between text-[#241A14]">
                          <span className="truncate pr-2">
                            {it.productName} ({it.quantity}x)
                          </span>
                          <span className="font-semibold shrink-0">
                            {formatRupiah(it.finalItemPrice * it.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-[#D9C7AE]/40 flex justify-between items-baseline text-xs">
                      <span className="text-[#6B5546]">Total Bayar:</span>
                      <span className="font-display font-black text-sm text-[#E85D32]">
                        {formatRupiah(latestOrder.total)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 rounded-3xl bg-[#F8F5EF] border border-dashed border-[#D9C7AE] text-center space-y-2">
                    <ShoppingBag className="w-8 h-8 text-[#6B5546]/50 mx-auto" />
                    <p className="font-bold text-xs text-[#241A14]">Belum Ada Riwayat Pesanan</p>
                    <p className="text-[11px] text-[#6B5546]">
                      Pesanan yang Anda buat akan otomatis tercatat di sini.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Logout Bar */}
          <div className="p-6 border-t border-[#D9C7AE]/40 bg-[#FAF7F2]">
            <button
              onClick={logout}
              className="w-full py-3 px-4 rounded-2xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar dari Akun ({profile.displayName})</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* MODAL: Tambah / Edit Alamat */}
      <AnimatePresence>
        {isAddressModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain flex min-h-full items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddressModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-[#FFFDF8] rounded-[28px] p-6 border border-[#D9C7AE]/60 shadow-2xl z-10 max-h-[90vh] overflow-y-auto overscroll-contain my-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#D9C7AE]/40 mb-4">
                <h4 className="font-display font-black text-lg text-[#241A14]">
                  {editingAddressId ? 'Edit Alamat Pengiriman' : 'Tambah Alamat Baru'}
                </h4>
                <button
                  onClick={() => setIsAddressModalOpen(false)}
                  className="p-1 rounded-full text-[#6B5546] hover:bg-black/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveAddress} className="space-y-3.5">
                {/* Label Selector */}
                <div>
                  <label className="text-xs font-bold text-[#241A14] block mb-1">
                    Label Alamat
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Rumah', 'Kantor', 'Kost'].map((lbl) => (
                      <button
                        key={lbl}
                        type="button"
                        onClick={() => setAddressLabel(lbl)}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                          addressLabel === lbl
                            ? 'bg-[#241A14] text-white border-[#241A14]'
                            : 'bg-[#F8F5EF] text-[#6B5546] border-[#D9C7AE]/50'
                        }`}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recipient & Phone */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#241A14] block mb-1">
                      Nama Penerima *
                    </label>
                    <input
                      type="text"
                      required
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="Nama"
                      className="w-full px-3 py-2 rounded-xl bg-[#F8F5EF] border border-[#D9C7AE]/60 text-xs text-[#241A14] focus:outline-none focus:ring-1 focus:ring-[#241A14]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#241A14] block mb-1">
                      No. WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="0812..."
                      className="w-full px-3 py-2 rounded-xl bg-[#F8F5EF] border border-[#D9C7AE]/60 text-xs text-[#241A14] focus:outline-none focus:ring-1 focus:ring-[#241A14]"
                    />
                  </div>
                </div>

                {/* Street */}
                <div>
                  <label className="text-xs font-bold text-[#241A14] block mb-1">
                    Alamat Lengkap &amp; Nomor Rumah *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan"
                    className="w-full px-3 py-2 rounded-xl bg-[#F8F5EF] border border-[#D9C7AE]/60 text-xs text-[#241A14] focus:outline-none focus:ring-1 focus:ring-[#241A14]"
                  />
                </div>

                {/* City & Postal Code */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#241A14] block mb-1">
                      Kota / Kabupaten *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Jakarta Selatan"
                      className="w-full px-3 py-2 rounded-xl bg-[#F8F5EF] border border-[#D9C7AE]/60 text-xs text-[#241A14] focus:outline-none focus:ring-1 focus:ring-[#241A14]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#241A14] block mb-1">
                      Kode Pos *
                    </label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="12820"
                      className="w-full px-3 py-2 rounded-xl bg-[#F8F5EF] border border-[#D9C7AE]/60 text-xs text-[#241A14] focus:outline-none focus:ring-1 focus:ring-[#241A14]"
                    />
                  </div>
                </div>

                {/* Delivery Notes */}
                <div>
                  <label className="text-xs font-bold text-[#241A14] block mb-1">
                    Catatan Kurir / Patokan
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Pagar hitam, depan minimarket, dll."
                    className="w-full px-3 py-2 rounded-xl bg-[#F8F5EF] border border-[#D9C7AE]/60 text-xs text-[#241A14] focus:outline-none focus:ring-1 focus:ring-[#241A14]"
                  />
                </div>

                {/* Is Default Checkbox */}
                <label className="flex items-center gap-2 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="rounded text-[#E85D32] focus:ring-[#E85D32]"
                  />
                  <span className="text-xs text-[#241A14] font-medium">
                    Jadikan sebagai Alamat Pengiriman Utama
                  </span>
                </label>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsAddressModalOpen(false)}
                    className="flex-1 py-2.5 rounded-full border border-[#D9C7AE] text-xs font-bold text-[#6B5546] hover:bg-black/5"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-full bg-[#241A14] hover:bg-[#E85D32] text-white text-xs font-bold transition-all shadow-md"
                  >
                    Simpan Alamat
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
