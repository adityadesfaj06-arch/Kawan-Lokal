import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  QrCode,
  Building2,
  CreditCard,
  Copy,
  Check,
  Download,
  Clock,
  ShieldCheck,
  Lock,
  ArrowLeft,
  AlertCircle,
  Maximize2,
  X,
  Sparkles,
  HelpCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatRupiah } from '../lib/utils';
import { OrderDetails } from '../types';

interface PaymentStepProps {
  pendingOrder: Omit<OrderDetails, 'orderId' | 'date'>;
  onBackToDetails: () => void;
  onOrderConfirmed: (confirmedOrder: OrderDetails) => void;
}

export const PaymentStep: React.FC<PaymentStepProps> = ({
  pendingOrder,
  onBackToDetails,
  onOrderConfirmed,
}) => {
  const { clearCart, showToast } = useCart();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingText, setProcessingText] = useState('');
  const [isQrZoomed, setIsQrZoomed] = useState(false);

  // Countdown timer: 15 minutes (900 seconds)
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    showToast(`${label} berhasil disalin!`);
    setTimeout(() => setCopiedField(null), 2500);
  };

  // Virtual Account state
  const [selectedBank, setSelectedBank] = useState<'BCA' | 'Mandiri' | 'BRI' | 'BNI'>('BCA');
  const [vaGuideTab, setVaGuideTab] = useState<'mbanking' | 'atm' | 'ibanking'>('mbanking');

  // Credit Card Form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState(pendingOrder.customerName || '');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [showCvv, setShowCvv] = useState(false);
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({});
  const [show3DSModal, setShow3DSModal] = useState(false);
  const [otpInput, setOtpInput] = useState('849201');

  // Card formatting helpers
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
    if (cardErrors.cardNumber) {
      setCardErrors((prev) => ({ ...prev, cardNumber: '' }));
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    setCardExpiry(raw);
    if (cardErrors.cardExpiry) {
      setCardErrors((prev) => ({ ...prev, cardExpiry: '' }));
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCardCvv(raw);
    if (cardErrors.cardCvv) {
      setCardErrors((prev) => ({ ...prev, cardCvv: '' }));
    }
  };

  // Detect card brand
  const getCardBrand = (num: string) => {
    const clean = num.replace(/\s/g, '');
    if (clean.startsWith('4')) return { name: 'Visa', color: 'from-[#1A1F71] to-[#0A0D36]' };
    if (/^(5[1-5]|2[2-7])/.test(clean)) return { name: 'Mastercard', color: 'from-[#EB001B] to-[#F79E1B]' };
    if (/^3[47]/.test(clean)) return { name: 'American Express', color: 'from-[#007AC1] to-[#002F6C]' };
    if (/^(?:2131|1800|35\d{3})/.test(clean)) return { name: 'JCB', color: 'from-[#0E4F94] to-[#007934]' };
    return { name: 'Debit / Kredit', color: 'from-[#241A14] to-[#4A3B32]' };
  };

  const finalizeOrder = (extraDetails: Partial<OrderDetails> = {}) => {
    const orderId = `KL-${Math.floor(100000 + Math.random() * 900000)}`;
    const fullOrder: OrderDetails = {
      ...pendingOrder,
      orderId,
      date: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      paymentStatus: 'LUNAS',
      ...extraDetails,
    };

    clearCart();
    onOrderConfirmed(fullOrder);
  };

  // Action: Confirm QRIS Payment
  const handleConfirmQrisPayment = () => {
    setIsProcessing(true);
    setProcessingText('Memverifikasi transaksi QRIS ke GoPay Merchant...');

    setTimeout(() => {
      setProcessingText('Pembayaran Berhasil! Mengonfirmasi pesanan...');
      setTimeout(() => {
        setIsProcessing(false);
        finalizeOrder({
          paymentMethod: 'QRIS / E-Wallet',
          qrisNmid: 'ID1026543831071',
        });
      }, 700);
    }, 1200);
  };

  // Action: Confirm Virtual Account Transfer
  const handleConfirmVaPayment = () => {
    setIsProcessing(true);
    setProcessingText('Memeriksa mutasi rekening Virtual Account...');

    setTimeout(() => {
      setProcessingText('Transfer Diterima! Menyiapkan tiket pesanan...');
      setTimeout(() => {
        setIsProcessing(false);
        finalizeOrder({
          paymentMethod: `Virtual Account (${selectedBank})`,
          virtualAccountNumber: '4280402937',
        });
      }, 700);
    }, 1200);
  };

  // Action: Submit Card Payment
  const handleCardPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    const rawNumber = cardNumber.replace(/\s/g, '');

    if (!rawNumber || rawNumber.length < 16) {
      errors.cardNumber = 'Nomor kartu harus 16 digit';
    }
    if (!cardHolder.trim()) {
      errors.cardHolder = 'Nama pemegang kartu wajib diisi';
    }
    if (!cardExpiry || cardExpiry.length < 5) {
      errors.cardExpiry = 'Format MM/YY wajib valid';
    } else {
      const [mm, yy] = cardExpiry.split('/').map(Number);
      if (mm < 1 || mm > 12) {
        errors.cardExpiry = 'Bulan tidak valid (01-12)';
      }
    }
    if (!cardCvv || cardCvv.length < 3) {
      errors.cardCvv = 'CVV minimal 3 digit';
    }

    if (Object.keys(errors).length > 0) {
      setCardErrors(errors);
      return;
    }

    // Open 3D Secure Verification dialog
    setShow3DSModal(true);
  };

  const handleConfirm3DSecure = () => {
    setShow3DSModal(false);
    setIsProcessing(true);
    setProcessingText('Mengotorisasi kartu kredit/debit via PCI-DSS...');

    setTimeout(() => {
      setProcessingText('Otorisasi Disetujui! Pembayaran Lunas.');
      setTimeout(() => {
        setIsProcessing(false);
        const lastFour = cardNumber.replace(/\s/g, '').slice(-4);
        finalizeOrder({
          paymentMethod: 'Credit / Debit Card',
          cardLastFour: lastFour,
          cardHolderName: cardHolder,
        });
      }, 700);
    }, 1200);
  };

  const isQris = pendingOrder.paymentMethod === 'QRIS / E-Wallet';
  const isVA = pendingOrder.paymentMethod === 'Bank Transfer (VA)';
  const isCard = pendingOrder.paymentMethod === 'Credit / Debit Card';

  return (
    <div className="pt-24 pb-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Back and Progress Stepper */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#D9C7AE]/40">
          <button
            onClick={onBackToDetails}
            disabled={isProcessing}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#6B5546] hover:text-[#241A14] transition-colors disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Detail Pengiriman</span>
          </button>

          {/* Stepper */}
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="flex items-center gap-1 text-[#6D8B57]">
              <span className="w-5 h-5 rounded-full bg-[#6D8B57]/15 flex items-center justify-center text-[10px]">
                ✓
              </span>
              <span>1. Data Pengiriman</span>
            </span>
            <span className="text-[#D9C7AE]">→</span>
            <span className="flex items-center gap-1 text-[#E85D32]">
              <span className="w-5 h-5 rounded-full bg-[#E85D32] text-white flex items-center justify-center text-[10px]">
                2
              </span>
              <span>2. Pembayaran</span>
            </span>
            <span className="text-[#D9C7AE]">→</span>
            <span className="text-[#6B5546]/60">3. Pesanan Selesai</span>
          </div>
        </div>

        {/* Payment Summary Top Bar */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[#FFFDF8] border border-[#D9C7AE]/60 shadow-md mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-[#6B5546] block">
              Total Tagihan Pembayaran
            </span>
            <div className="flex items-center gap-3 mt-1">
              <span className="font-display font-black text-2xl sm:text-3xl text-[#241A14]">
                {formatRupiah(pendingOrder.total)}
              </span>
              <button
                onClick={() => handleCopy(pendingOrder.total.toString(), 'Nominal pembayaran')}
                className="px-2.5 py-1 rounded-lg bg-[#F8F5EF] hover:bg-[#241A14] hover:text-white text-[#241A14] text-xs font-bold transition-all border border-[#D9C7AE]/50 flex items-center gap-1.5"
              >
                {copiedField === 'Nominal pembayaran' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#6D8B57]" />
                    <span>Disalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-[#6B5546] mt-1">
              Penerima: <strong className="text-[#241A14]">{pendingOrder.customerName}</strong> • {pendingOrder.phone}
            </p>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FFF3EE] border border-[#E85D32]/20 self-start sm:self-auto">
            <Clock className="w-5 h-5 text-[#E85D32] animate-pulse" />
            <div>
              <span className="text-[11px] font-bold text-[#E85D32] block uppercase tracking-wider">
                Selesaikan Dalam
              </span>
              <span className="font-display font-extrabold text-lg text-[#241A14] tracking-wider">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STEP A: QRIS / E-WALLET                                                  */}
        {/* ========================================================================= */}
        {isQris && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Standee Graphic Representation (Matching uploaded photo) */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div className="relative w-full max-w-[380px] bg-[#00AEEF] rounded-[32px] p-5 shadow-2xl border-4 border-white text-center overflow-hidden">
                {/* Standee Top Header */}
                <div className="flex items-center justify-center gap-2.5 py-2">
                  <div className="w-9 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#00AEEF]" />
                  </div>
                  <span className="text-white font-black text-2xl tracking-tight">
                    gopay <span className="font-normal text-xl opacity-95">merchant</span>
                  </span>
                </div>

                {/* White Inner Card */}
                <div className="relative bg-white rounded-[26px] p-5 pt-4 mt-3 shadow-lg border border-white/60">
                  {/* Decorative Red Corner Accents */}
                  <div className="absolute top-10 left-0 w-0 h-0 border-t-[36px] border-t-[#E41B26] border-r-[36px] border-r-transparent" />
                  <div className="absolute bottom-10 right-0 w-0 h-0 border-b-[36px] border-b-[#E41B26] border-l-[36px] border-l-transparent" />

                  {/* Top Logos: QRIS & GPN */}
                  <div className="flex items-start justify-between mb-3 px-1">
                    <div className="text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-xl text-[#0C1428] tracking-wider">QRIS</span>
                        <div className="text-[7.5px] leading-tight font-extrabold text-[#0C1428]">
                          <div>QR Code Standar</div>
                          <div>Pembayaran Nasional</div>
                        </div>
                      </div>
                      <div className="w-12 h-0.5 bg-[#E41B26] mt-0.5" />
                    </div>

                    <div className="flex items-center gap-1 text-right">
                      <div className="w-5 h-5 flex items-center justify-center">
                        <span className="text-base">🦅</span>
                      </div>
                      <span className="font-black text-sm text-[#1B2B65]">GPN</span>
                    </div>
                  </div>

                  {/* Merchant Title */}
                  <div className="my-2 px-1">
                    <h4 className="font-display font-black text-[13px] text-[#14181F] leading-snug uppercase tracking-tight">
                      EDGARD FANS SIMAHENDALI, KESEHATAN &amp; OLAHRAGA
                    </h4>
                    <p className="text-[11px] font-bold text-[#4B5262] mt-0.5 tracking-wider">
                      NMID: ID1026543831071
                    </p>
                    <span className="inline-block text-[11px] font-extrabold text-[#14181F] mt-0.5">
                      A01
                    </span>
                  </div>

                  {/* QR Code Container */}
                  <div className="relative my-3 p-3 bg-white rounded-2xl border-2 border-dashed border-[#D9C7AE]/60 flex flex-col items-center justify-center group">
                    <img
                      src="/qris-merchant-qr.png"
                      alt="QRIS Gopay Merchant EDGARD FANS SIMAHENDALI"
                      className="w-56 h-56 sm:w-60 sm:h-60 object-contain rounded-lg"
                    />
                    <button
                      onClick={() => setIsQrZoomed(true)}
                      className="absolute inset-0 bg-black/40 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-xs font-bold"
                    >
                      <Maximize2 className="w-6 h-6" />
                      <span>Klik untuk Perbesar</span>
                    </button>
                  </div>

                  {/* Printed Text */}
                  <div className="text-left text-[10px] font-bold text-[#4B5262]">
                    Dicetak oleh: 93600914
                  </div>
                </div>

                {/* Standee Footer */}
                <div className="pt-3 pb-1 text-white">
                  <p className="text-[11px] font-bold tracking-wide">
                    Terima pembayaran QRIS dari mana saja
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2 text-[10px] font-black">
                    <span className="bg-white text-[#00AEEF] px-2 py-0.5 rounded">gopay</span>
                    <span className="bg-[#003580] text-white px-2 py-0.5 rounded">BCA</span>
                    <span className="bg-[#0B3C73] text-[#FDB813] px-2 py-0.5 rounded">mandiri</span>
                    <span className="bg-[#F15A24] text-white px-2 py-0.5 rounded">BNI</span>
                    <span className="bg-[#00529C] text-white px-2 py-0.5 rounded">BANK BRI</span>
                    <span className="text-[9.5px] font-medium opacity-90">+ lainnya</span>
                  </div>
                </div>
              </div>

              {/* Download Standee / Image Button */}
              <div className="flex items-center gap-2 mt-4">
                <a
                  href="/qris-gopay-merchant.svg"
                  download="qris-edgard-fans-simahendali.svg"
                  className="px-4 py-2 rounded-full bg-[#FFFDF8] hover:bg-[#241A14] hover:text-white text-[#241A14] border border-[#D9C7AE]/60 text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Foto Standee QRIS</span>
                </a>
                <button
                  onClick={() => handleCopy('ID1026543831071', 'NMID')}
                  className="px-4 py-2 rounded-full bg-[#FFFDF8] hover:bg-[#241A14] hover:text-white text-[#241A14] border border-[#D9C7AE]/60 text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
                >
                  {copiedField === 'NMID' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#6D8B57]" />
                      <span>NMID Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin NMID</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Guide & Action */}
            <div className="lg:col-span-6 space-y-6">
              <div className="p-6 sm:p-7 rounded-3xl bg-[#FFFDF8] border border-[#D9C7AE]/60 shadow-sm space-y-5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E85D32]">
                  <QrCode className="w-4 h-4" />
                  <span>CARA PEMBAYARAN QRIS</span>
                </div>

                <div className="space-y-3.5 text-xs text-[#241A14]">
                  <div className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#E85D32]/10 text-[#E85D32] font-black flex items-center justify-center shrink-0">
                      1
                    </span>
                    <div>
                      <strong className="block">Buka Aplikasi E-Wallet / Mobile Banking</strong>
                      <span className="text-[#6B5546]">
                        Buka GoPay, OVO, DANA, ShopeePay, BCA Mobile, Livin Mandiri, BRImo, atau aplikasi bank apa pun.
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#E85D32]/10 text-[#E85D32] font-black flex items-center justify-center shrink-0">
                      2
                    </span>
                    <div>
                      <strong className="block">Scan Kode QR</strong>
                      <span className="text-[#6B5546]">
                        Pilih menu <strong>Scan QR / Bayar</strong> dan arahkan kamera HP ke QR Code standee di samping.
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#E85D32]/10 text-[#E85D32] font-black flex items-center justify-center shrink-0">
                      3
                    </span>
                    <div>
                      <strong className="block">Periksa Nama Merchant</strong>
                      <span className="text-[#6B5546]">
                        Pastikan penerima adalah <strong>EDGARD FANS SIMAHENDALI, KESEHATAN &amp; OLAHRAGA</strong> (NMID: ID1026543831071).
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#E85D32]/10 text-[#E85D32] font-black flex items-center justify-center shrink-0">
                      4
                    </span>
                    <div>
                      <strong className="block">Masukkan Nominal Tagihan Tepat</strong>
                      <span className="text-[#6B5546]">
                        Ketikkan <strong>{formatRupiah(pendingOrder.total)}</strong> dan konfirmasi pembayaran dengan PIN e-wallet/m-banking kamu.
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#E85D32]/10 text-[#E85D32] font-black flex items-center justify-center shrink-0">
                      5
                    </span>
                    <div>
                      <strong className="block">Klik Tombol Konfirmasi</strong>
                      <span className="text-[#6B5546]">
                        Setelah saldo terpotong dan pembayaran sukses, tekan tombol hijau di bawah untuk menyelesaikan pesanan.
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#D9C7AE]/40 space-y-3">
                  <motion.button
                    onClick={handleConfirmQrisPayment}
                    disabled={isProcessing}
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    className="w-full py-4 px-6 rounded-full bg-[#6D8B57] hover:bg-[#5b7548] text-white font-bold text-sm tracking-wider uppercase transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{processingText}</span>
                      </span>
                    ) : (
                      <>
                        <ShieldCheck className="w-5 h-5" />
                        <span>SAYA SUDAH BAYAR VIA QRIS</span>
                      </>
                    )}
                  </motion.button>

                  <p className="text-[11px] text-center text-[#6B5546]">
                    Verifikasi instan otomatis terhubung ke sistem kasir GoPay Merchant.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP B: VIRTUAL ACCOUNT / BANK TRANSFER (Rekening 4280402937)            */}
        {/* ========================================================================= */}
        {isVA && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-6">
              {/* Account Box */}
              <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF8] border-2 border-[#E85D32]/40 shadow-xl space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#D9C7AE]/40">
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-6 h-6 text-[#E85D32]" />
                    <div>
                      <h3 className="font-display font-black text-lg text-[#241A14]">
                        Nomor Virtual Account / Rekening
                      </h3>
                      <p className="text-xs text-[#6B5546]">
                        Transfer dari ATM, m-Banking, atau Internet Banking
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#6D8B57]/15 text-[#4D6C43] text-xs font-bold">
                    Otomatis Terverifikasi
                  </span>
                </div>

                {/* Bank Selector */}
                <div>
                  <span className="text-xs font-bold text-[#6B5546] uppercase tracking-wider block mb-2">
                    Pilih Bank Tujuan:
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'BCA', name: 'BCA', code: '014' },
                      { id: 'Mandiri', name: 'Mandiri', code: '008' },
                      { id: 'BRI', name: 'BRI', code: '002' },
                      { id: 'BNI', name: 'BNI', code: '009' },
                    ].map((bank) => {
                      const isSel = selectedBank === bank.id;
                      return (
                        <button
                          key={bank.id}
                          type="button"
                          onClick={() => setSelectedBank(bank.id as any)}
                          className={`p-3 rounded-2xl border text-center transition-all ${
                            isSel
                              ? 'border-[#241A14] bg-[#241A14] text-white font-bold shadow-md'
                              : 'border-[#D9C7AE]/60 bg-[#F8F5EF] text-[#241A14] hover:border-[#241A14]'
                          }`}
                        >
                          <span className="block text-sm font-extrabold">{bank.name}</span>
                          <span className="block text-[10px] opacity-75">Kode: {bank.code}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* The Account Number Box (4280402937) */}
                <div className="p-5 rounded-2xl bg-[#F8F5EF] border border-[#D9C7AE]/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#6B5546]">
                      Nomor Rekening / Virtual Account
                    </span>
                    <span className="text-[11px] font-bold text-[#E85D32] bg-[#FFF3EE] px-2 py-0.5 rounded">
                      Bank {selectedBank}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono font-black text-2xl sm:text-3xl text-[#241A14] tracking-wider">
                      4280402937
                    </span>
                    <button
                      onClick={() => handleCopy('4280402937', 'Nomor rekening')}
                      className="px-4 py-2.5 rounded-xl bg-[#241A14] hover:bg-[#E85D32] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shrink-0"
                    >
                      {copiedField === 'Nomor rekening' ? (
                        <>
                          <Check className="w-4 h-4 text-[#A8FFB2]" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Salin Nomor</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="pt-2 border-t border-[#D9C7AE]/40 flex items-center justify-between text-xs">
                    <span className="text-[#6B5546]">Atas Nama Rekening:</span>
                    <span className="font-bold text-[#241A14]">
                      EDGARD FANS SIMAHENDALI
                    </span>
                  </div>
                </div>

                {/* Amount to transfer */}
                <div className="p-4 rounded-2xl bg-[#FFF3EE] border border-[#E85D32]/30 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-[#6B5546] block">Jumlah yang Harus Ditransfer</span>
                    <span className="font-display font-black text-xl text-[#E85D32]">
                      {formatRupiah(pendingOrder.total)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(pendingOrder.total.toString(), 'Nominal transfer')}
                    className="px-3 py-1.5 rounded-lg bg-white border border-[#E85D32]/40 text-[#E85D32] text-xs font-bold hover:bg-[#E85D32] hover:text-white transition-all flex items-center gap-1"
                  >
                    {copiedField === 'Nominal transfer' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Salin Jumlah</span>
                  </button>
                </div>

                {/* Confirm Action Button */}
                <motion.button
                  onClick={handleConfirmVaPayment}
                  disabled={isProcessing}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  className="w-full py-4 px-6 rounded-full bg-[#241A14] hover:bg-[#191614] text-white font-bold text-sm tracking-wider uppercase transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{processingText}</span>
                    </span>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5 text-[#6D8B57]" />
                      <span>SAYA SUDAH TRANSFER KE NO REK 4280402937</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Right Instructions */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 rounded-3xl bg-[#FFFDF8] border border-[#D9C7AE]/60 shadow-sm space-y-4">
                <h4 className="font-display font-bold text-sm text-[#241A14] uppercase tracking-wider">
                  Petunjuk Transfer Bank {selectedBank}
                </h4>

                {/* Tabs */}
                <div className="flex border-b border-[#D9C7AE]/40 text-xs">
                  <button
                    onClick={() => setVaGuideTab('mbanking')}
                    className={`pb-2.5 px-3 font-bold border-b-2 transition-all ${
                      vaGuideTab === 'mbanking'
                        ? 'border-[#E85D32] text-[#E85D32]'
                        : 'border-transparent text-[#6B5546] hover:text-[#241A14]'
                    }`}
                  >
                    m-Banking
                  </button>
                  <button
                    onClick={() => setVaGuideTab('atm')}
                    className={`pb-2.5 px-3 font-bold border-b-2 transition-all ${
                      vaGuideTab === 'atm'
                        ? 'border-[#E85D32] text-[#E85D32]'
                        : 'border-transparent text-[#6B5546] hover:text-[#241A14]'
                    }`}
                  >
                    ATM
                  </button>
                  <button
                    onClick={() => setVaGuideTab('ibanking')}
                    className={`pb-2.5 px-3 font-bold border-b-2 transition-all ${
                      vaGuideTab === 'ibanking'
                        ? 'border-[#E85D32] text-[#E85D32]'
                        : 'border-transparent text-[#6B5546] hover:text-[#241A14]'
                    }`}
                  >
                    Internet Banking
                  </button>
                </div>

                <div className="text-xs text-[#6B5546] space-y-2.5 leading-relaxed">
                  {vaGuideTab === 'mbanking' && (
                    <ol className="list-decimal pl-4 space-y-2">
                      <li>Buka aplikasi m-Banking Anda (BCA Mobile, Livin by Mandiri, BRImo, atau BNI Mobile).</li>
                      <li>Pilih menu <strong>Transfer</strong> &gt; <strong>Antar Bank / Rekening</strong>.</li>
                      <li>Masukkan Nomor Rekening Tujuan: <strong className="text-[#241A14]">4280402937</strong>.</li>
                      <li>Pastikan nama penerima tertera: <strong className="text-[#241A14]">EDGARD FANS SIMAHENDALI</strong>.</li>
                      <li>Masukkan nominal transfer sebesar <strong className="text-[#241A14]">{formatRupiah(pendingOrder.total)}</strong>.</li>
                      <li>Konfirmasi dengan PIN m-Banking dan simpan bukti transfer.</li>
                    </ol>
                  )}
                  {vaGuideTab === 'atm' && (
                    <ol className="list-decimal pl-4 space-y-2">
                      <li>Masukkan kartu ATM dan 6 digit PIN Anda.</li>
                      <li>Pilih menu <strong>Transaksi Lainnya</strong> &gt; <strong>Transfer</strong>.</li>
                      <li>Masukkan kode bank dan nomor rekening <strong className="text-[#241A14]">4280402937</strong>.</li>
                      <li>Periksa nama penerima <strong className="text-[#241A14]">EDGARD FANS SIMAHENDALI</strong>.</li>
                      <li>Masukkan jumlah pembayaran <strong className="text-[#241A14]">{formatRupiah(pendingOrder.total)}</strong>.</li>
                      <li>Tekan <strong>Ya / Benar</strong> untuk menyelesaikan transaksi.</li>
                    </ol>
                  )}
                  {vaGuideTab === 'ibanking' && (
                    <ol className="list-decimal pl-4 space-y-2">
                      <li>Login ke akun Internet Banking bank Anda.</li>
                      <li>Pilih menu <strong>Transfer Dana</strong>.</li>
                      <li>Pilih tujuan transfer rekening <strong className="text-[#241A14]">4280402937</strong> (a.n. EDGARD FANS SIMAHENDALI).</li>
                      <li>Input nominal sebesar <strong className="text-[#241A14]">{formatRupiah(pendingOrder.total)}</strong>.</li>
                      <li>Masukkan respon token / otorisasi SMS untuk menyelesaikan.</li>
                    </ol>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-[#F8F5EF] flex items-center gap-2 text-[11px] text-[#6B5546]">
                  <Lock className="w-4 h-4 text-[#6D8B57] shrink-0" />
                  <span>Sistem kami akan memverifikasi mutasi dalam hitungan detik setelah Anda klik tombol konfirmasi.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP C: KARTU KREDIT / DEBIT (Nomor Kartu, CVV, Expiry, Nama)            */}
        {/* ========================================================================= */}
        {isCard && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Visual Card Preview */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div
                className={`w-full max-w-[360px] h-[210px] rounded-3xl p-6 text-white bg-gradient-to-br ${
                  getCardBrand(cardNumber).color
                } shadow-2xl relative overflow-hidden flex flex-col justify-between border border-white/20`}
              >
                {/* Background decorative circles */}
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-black/20 blur-xl pointer-events-none" />

                {/* Top Row: Chip & Brand */}
                <div className="flex items-center justify-between z-10">
                  <div className="w-12 h-9 rounded-lg bg-gradient-to-br from-[#FFE082] to-[#FFB300] flex items-center justify-center p-1.5 shadow-md border border-[#FFD54F]/80">
                    <div className="w-full h-full border border-black/20 rounded-sm grid grid-cols-2 gap-0.5" />
                  </div>
                  <span className="font-display font-black text-lg tracking-wider italic text-white/95">
                    {getCardBrand(cardNumber).name}
                  </span>
                </div>

                {/* Card Number */}
                <div className="z-10 py-1">
                  <div className="font-mono font-bold text-lg sm:text-xl tracking-[0.22em] text-white text-shadow-sm">
                    {cardNumber || '•••• •••• •••• ••••'}
                  </div>
                </div>

                {/* Bottom Row: Holder & Expiry */}
                <div className="flex items-end justify-between z-10 text-xs">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-white/70 block">
                      Card Holder
                    </span>
                    <span className="font-bold uppercase tracking-wider truncate max-w-[190px] block">
                      {cardHolder || 'NAMA PEMILIK KARTU'}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] uppercase tracking-wider text-white/70 block">
                      Valid Thru
                    </span>
                    <span className="font-mono font-bold tracking-widest block">
                      {cardExpiry || 'MM/YY'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Security Trust Badges */}
              <div className="flex items-center justify-center gap-4 mt-5 text-[11px] text-[#6B5546] font-medium">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#6D8B57]" />
                  <span>256-Bit SSL</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#241A14]" />
                  <span>PCI-DSS Level 1</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#E85D32]" />
                  <span>3D Secure</span>
                </div>
              </div>
            </div>

            {/* Input Form */}
            <div className="lg:col-span-7">
              <form
                onSubmit={handleCardPaymentSubmit}
                className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF8] border border-[#D9C7AE]/60 shadow-xl space-y-5"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#D9C7AE]/40">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E85D32]">
                    <CreditCard className="w-4 h-4" />
                    <span>DETAIL KARTU KREDIT / DEBIT</span>
                  </div>
                  <span className="text-[11px] text-[#6B5546]">Visa, Mastercard, JCB</span>
                </div>

                {/* 1. Nomor Kartu */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#241A14] flex items-center justify-between">
                    <span>Nomor Kartu (16 Digit) *</span>
                    <span className="text-[11px] font-normal text-[#6B5546]">
                      {getCardBrand(cardNumber).name}
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="4000 1234 5678 9010"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      className={`w-full px-4 py-3 rounded-2xl bg-[#F8F5EF] border ${
                        cardErrors.cardNumber ? 'border-red-500' : 'border-[#D9C7AE]/60'
                      } text-sm font-mono text-[#241A14] focus:outline-none focus:ring-2 focus:ring-[#241A14]`}
                    />
                    <CreditCard className="w-5 h-5 text-[#6B5546] absolute right-3.5 top-3.5" />
                  </div>
                  {cardErrors.cardNumber && (
                    <p className="text-[11px] text-red-600 font-semibold">{cardErrors.cardNumber}</p>
                  )}
                </div>

                {/* 2. Nama Pemegang Kartu */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#241A14]">
                    Nama Pemilik Kartu (Sesuai Kartu) *
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: EDGARD FANS"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                    className={`w-full px-4 py-3 rounded-2xl bg-[#F8F5EF] border ${
                      cardErrors.cardHolder ? 'border-red-500' : 'border-[#D9C7AE]/60'
                    } text-sm text-[#241A14] uppercase focus:outline-none focus:ring-2 focus:ring-[#241A14]`}
                  />
                  {cardErrors.cardHolder && (
                    <p className="text-[11px] text-red-600 font-semibold">{cardErrors.cardHolder}</p>
                  )}
                </div>

                {/* 3. Grid Expiry & CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#241A14]">
                      Masa Berlaku (MM/YY) *
                    </label>
                    <input
                      type="text"
                      placeholder="12/28"
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      className={`w-full px-4 py-3 rounded-2xl bg-[#F8F5EF] border ${
                        cardErrors.cardExpiry ? 'border-red-500' : 'border-[#D9C7AE]/60'
                      } text-sm font-mono text-[#241A14] focus:outline-none focus:ring-2 focus:ring-[#241A14]`}
                    />
                    {cardErrors.cardExpiry && (
                      <p className="text-[11px] text-red-600 font-semibold">{cardErrors.cardExpiry}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-[#241A14]">
                      <span>CVV / CVC *</span>
                      <span className="text-[10px] text-[#6B5546] font-normal">3-4 Digit di belakang</span>
                    </div>
                    <div className="relative">
                      <input
                        type={showCvv ? 'text' : 'password'}
                        placeholder="•••"
                        value={cardCvv}
                        onChange={handleCvvChange}
                        className={`w-full px-4 py-3 rounded-2xl bg-[#F8F5EF] border ${
                          cardErrors.cardCvv ? 'border-red-500' : 'border-[#D9C7AE]/60'
                        } text-sm font-mono text-[#241A14] focus:outline-none focus:ring-2 focus:ring-[#241A14]`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCvv(!showCvv)}
                        className="absolute right-3.5 top-3.5 text-[#6B5546] hover:text-[#241A14]"
                      >
                        {showCvv ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {cardErrors.cardCvv && (
                      <p className="text-[11px] text-red-600 font-semibold">{cardErrors.cardCvv}</p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-3">
                  <motion.button
                    type="submit"
                    disabled={isProcessing}
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    className="w-full py-4 px-6 rounded-full bg-[#241A14] hover:bg-[#191614] text-white font-bold text-sm tracking-wider uppercase transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{processingText}</span>
                      </span>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-[#A8FFB2]" />
                        <span>BAYAR SEKARANG • {formatRupiah(pendingOrder.total)}</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 3D Secure Verification Modal */}
        <AnimatePresence>
          {show3DSModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                className="w-full max-w-md bg-[#FFFDF8] rounded-3xl p-6 sm:p-7 border border-[#D9C7AE]/60 shadow-2xl space-y-5"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#D9C7AE]/40">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#6D8B57]" />
                    <span className="font-display font-bold text-sm text-[#241A14]">
                      Autentikasi Bank 3D Secure
                    </span>
                  </div>
                  <button
                    onClick={() => setShow3DSModal(false)}
                    className="p-1 rounded-full hover:bg-black/5 text-[#6B5546]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-center space-y-2">
                  <p className="text-xs text-[#6B5546]">
                    Kode OTP satu kali telah dikirim ke nomor HP terdaftar kartu Anda untuk transaksi sebesar:
                  </p>
                  <p className="font-display font-black text-xl text-[#241A14]">
                    {formatRupiah(pendingOrder.total)}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#241A14] block text-center">
                    Masukkan Kode OTP 6-Digit
                  </label>
                  <input
                    type="text"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.slice(0, 6))}
                    className="w-full text-center text-2xl font-mono tracking-widest py-3 rounded-2xl bg-[#F8F5EF] border border-[#D9C7AE]/60 text-[#241A14] font-bold focus:outline-none focus:ring-2 focus:ring-[#241A14]"
                  />
                  <p className="text-[11px] text-center text-[#6B5546] pt-1">
                    Demo Mode: Kode terisi otomatis (<strong>849201</strong>)
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShow3DSModal(false)}
                    className="w-1/3 py-3 rounded-full border border-[#D9C7AE] text-xs font-bold text-[#6B5546] hover:bg-black/5"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirm3DSecure}
                    className="w-2/3 py-3 rounded-full bg-[#241A14] hover:bg-[#191614] text-white text-xs font-bold tracking-wider uppercase transition-all shadow-md"
                  >
                    Konfirmasi Bayar
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* QR Zoom Modal */}
        <AnimatePresence>
          {isQrZoomed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsQrZoomed(false)}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl relative"
              >
                <button
                  onClick={() => setIsQrZoomed(false)}
                  className="absolute right-4 top-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
                <h4 className="font-display font-extrabold text-sm text-[#241A14] uppercase pt-2">
                  EDGARD FANS SIMAHENDALI
                </h4>
                <p className="text-xs text-[#6B5546]">NMID: ID1026543831071 • A01</p>
                <img
                  src="/qris-merchant-qr.png"
                  alt="QRIS Zoom"
                  className="w-64 h-64 mx-auto object-contain"
                />
                <p className="text-xs font-bold text-[#E85D32]">
                  Nominal: {formatRupiah(pendingOrder.total)}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
