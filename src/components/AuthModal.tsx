import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { BrandLogo } from './BrandLogo';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    openAuthModal,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    loginDemo,
  } = useAuth();
  const { showToast } = useCart();

  const [mode, setMode] = useState<'login' | 'register'>(authModalMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Sync mode from context
  React.useEffect(() => {
    setMode(authModalMode);
    setErrorMessage('');
  }, [authModalMode, isAuthModalOpen]);

  // Lock background scroll when modal is open
  React.useEffect(() => {
    if (isAuthModalOpen) {
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
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      if (mode === 'login') {
        if (!email.trim()) {
          setErrorMessage('Alamat email wajib diisi.');
          setLoading(false);
          return;
        }
        if (!password.trim()) {
          setErrorMessage('Kata sandi wajib diisi.');
          setLoading(false);
          return;
        }
        await loginWithEmail(email, password);
        showToast('Berhasil masuk! Selamat datang kembali.');
      } else {
        if (!name.trim()) {
          setErrorMessage('Nama lengkap wajib diisi (minimal 2 karakter).');
          setLoading(false);
          return;
        }
        if (!email.trim() || !email.includes('@')) {
          setErrorMessage('Format email tidak valid (contoh: nama@email.com).');
          setLoading(false);
          return;
        }
        if (password.trim().length < 6) {
          setErrorMessage('Kata sandi terlalu pendek, minimal 6 karakter.');
          setLoading(false);
          return;
        }
        await registerWithEmail(email, password, name, phone);
        showToast('Akun berhasil dibuat! Data dan alamat Anda kini tersimpan.');
      }
    } catch (err: any) {
      console.error('Auth submit error:', err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setErrorMessage('Email atau kata sandi tidak cocok. Mohon periksa kembali.');
      } else if (err.code === 'auth/email-already-in-use') {
        setErrorMessage('Email ini sudah terdaftar. Silakan klik tombol "Masuk" di atas.');
      } else if (err.code === 'auth/weak-password') {
        setErrorMessage('Kata sandi minimal 6 karakter.');
      } else if (err.code === 'auth/invalid-email') {
        setErrorMessage('Format email tidak valid (contoh: nama@email.com).');
      } else if (err.code === 'auth/user-not-found') {
        setErrorMessage('Akun belum terdaftar. Silakan pilih tab "Daftar Akun".');
      } else {
        setErrorMessage(err.message || 'Terjadi kendala saat memproses akun. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage('');
    setLoading(true);
    try {
      await loginWithGoogle();
      showToast('Berhasil masuk dengan akun Google!');
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setErrorMessage('Gagal menghubungkan Google Sign-In. Coba gunakan login instan demo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFastDemoLogin = async () => {
    setLoading(true);
    await loginDemo();
    showToast('Berhasil login dengan Akun Demo (Aditya Pratama)!');
    setLoading(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain flex min-h-full items-center justify-center p-3 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-[#FFFDF8] rounded-[32px] p-6 sm:p-8 border border-[#D9C7AE]/60 shadow-2xl z-10 max-h-[90vh] overflow-y-auto overscroll-contain my-auto"
        >
          {/* Close button */}
          <button
            onClick={closeAuthModal}
            className="absolute top-5 right-5 p-2 rounded-full text-[#6B5546] hover:text-[#241A14] hover:bg-[#F8F5EF] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <BrandLogo variant="horizontal" size="sm" />
            </div>
            <h3 className="font-display font-black text-2xl text-[#241A14]">
              {mode === 'login' ? 'Masuk ke Akun Anda' : 'Buat Akun Kawan Lokal'}
            </h3>
            <p className="text-xs text-[#6B5546] mt-1">
              Simpan alamat pengiriman &amp; data pribadi untuk belanja kilat!
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex p-1 bg-[#F8F5EF] rounded-2xl border border-[#D9C7AE]/50 mb-5">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                mode === 'login'
                  ? 'bg-white text-[#241A14] shadow-sm'
                  : 'text-[#6B5546] hover:text-[#241A14]'
              }`}
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMessage('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                mode === 'register'
                  ? 'bg-white text-[#241A14] shadow-sm'
                  : 'text-[#6B5546] hover:text-[#241A14]'
              }`}
            >
              Daftar Akun
            </button>
          </div>

          {/* Fast Demo Login Button */}
          <div className="mb-4">
            <button
              type="button"
              onClick={handleFastDemoLogin}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-2xl bg-[#FFF3EE] hover:bg-[#ffe6db] border border-[#E85D32]/30 text-[#E85D32] text-xs font-bold transition-all flex items-center justify-center gap-2 group"
            >
              <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span>⚡ Coba Cepat: Masuk Akun Demo (Siap Alamat)</span>
            </button>
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-[#F8F5EF] border border-[#D9C7AE]/70 text-[#241A14] text-xs font-bold transition-all flex items-center justify-center gap-2.5 shadow-sm mb-4"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Lanjutkan dengan Google</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-[#D9C7AE]/50 w-full" />
            <span className="bg-[#FFFDF8] px-3 text-[11px] text-[#6B5546] uppercase font-bold tracking-wider">
              atau via email
            </span>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <>
                <div>
                  <label className="text-xs font-bold text-[#241A14] block mb-1">
                    Nama Lengkap *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Aditya Pratama"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F8F5EF] border border-[#D9C7AE]/60 text-xs text-[#241A14] focus:outline-none focus:ring-2 focus:ring-[#241A14]"
                    />
                    <User className="w-4 h-4 text-[#6B5546] absolute left-3.5 top-3" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#241A14] block mb-1">
                    Nomor WhatsApp / HP
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="081234567890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F8F5EF] border border-[#D9C7AE]/60 text-xs text-[#241A14] focus:outline-none focus:ring-2 focus:ring-[#241A14]"
                    />
                    <Phone className="w-4 h-4 text-[#6B5546] absolute left-3.5 top-3" />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-xs font-bold text-[#241A14] block mb-1">
                Alamat Email *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F8F5EF] border border-[#D9C7AE]/60 text-xs text-[#241A14] focus:outline-none focus:ring-2 focus:ring-[#241A14]"
                />
                <Mail className="w-4 h-4 text-[#6B5546] absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-[#241A14]">
                  Kata Sandi *
                </label>
                {mode === 'register' && (
                  <span
                    className={`text-[10px] font-medium ${
                      password.length >= 6 ? 'text-green-600' : 'text-[#6B5546]'
                    }`}
                  >
                    {password.length >= 6 ? '✓ Cukup aman (≥ 6 kar)' : 'Min. 6 karakter'}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-2.5 rounded-2xl bg-[#F8F5EF] border border-[#D9C7AE]/60 text-xs text-[#241A14] focus:outline-none focus:ring-2 focus:ring-[#241A14]"
                />
                <Lock className="w-4 h-4 text-[#6B5546] absolute left-3.5 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-2.5 p-0.5 text-[#6B5546] hover:text-[#241A14] transition-colors"
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full mt-2 py-3.5 px-4 rounded-full bg-[#241A14] hover:bg-[#191614] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Memproses...</span>
              ) : mode === 'login' ? (
                <>
                  <span>Masuk Sekarang</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#D9C7AE]" />
                </>
              ) : (
                <>
                  <span>Daftar &amp; Simpan Data</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#D9C7AE]" />
                </>
              )}
            </motion.button>
          </form>

          {/* Privacy Note */}
          <div className="mt-5 text-center text-[10px] text-[#6B5546] flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#6D8B57]" />
            <span>Data Anda terenkripsi aman &amp; tidak disebarluaskan.</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
