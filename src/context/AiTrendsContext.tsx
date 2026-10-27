import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AiTrendsData, TrendingArticle, NewMenuItem } from '../types';

interface AiTrendsContextType {
  articles: TrendingArticle[];
  menus: NewMenuItem[];
  loading: boolean;
  isRefreshing: boolean;
  lastUpdated: string | null;
  grounded: boolean;
  refreshTrends: (force?: boolean) => Promise<void>;
  getTimeAgo: () => string;
}

const CACHE_KEY = 'kawanlokal_ai_trends_cache';
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

const defaultFallbackData: AiTrendsData = {
  trending_articles: [
    {
      judul: 'Fenomena Daun Jeruk Melimpah: Kenapa Basreng Krispi Pedas Terus Memuncaki FYP?',
      ringkasan_singkat: 'Kombinasi aroma daun jeruk purut segar dengan cabai rawit merah sangrai menjadi formula viral yang sukses membuat jutaan anak muda ketagihan renyahnya camilan khas Bandung.',
      kategori: 'Jajanan Viral',
      waktu_baca: '2 mnt baca',
    },
    {
      judul: 'Evolusi Minuman Cafe di Rumah: Tren Bubuk Thai Tea & Matcha Crafting Makin Populer',
      ringkasan_singkat: 'Generasi Z kini gemar meracik sendiri minuman ala cafe premium menggunakan bubuk konsentrat pekat, hemat budget namun rasa otentik.',
      kategori: 'Minuman Kekinian',
      waktu_baca: '3 mnt baca',
    },
    {
      judul: 'Seblak Kuah Jeletot & Baso Aci Rempah: Kenyamanan Kuliner Nusantara di Musim Hujan',
      ringkasan_singkat: 'Kuliner berkuah hangat dengan cita rasa kencur gurih pedas kembali membludak di pencarian media sosial, menginspirasi banyak variasi topping unik.',
      kategori: 'Kuliner Hangat',
      waktu_baca: '2 mnt baca',
    },
  ],
  new_menus: [
    {
      nama_menu: 'Basreng Stick Daun Jeruk Smoky BBQ Hot',
      deskripsi_menggugah_selera: 'Stik bakso ikan tenggiri renyah berpadu bumbu BBQ asap kayu manis, cabai bubuk grade A, dan taburan daun jeruk cincang kering yang melimpah.',
      kategori: 'Camilan Gurih Pedas',
      estimasi_harga_rupiah: 24000,
      alasan_populer: 'Viral karena sensasi kriuk tahan lama dan perpaduan wangi asap BBQ dengan pedas asam jeruk yang segar.',
      badge: '🔥 Trending',
    },
    {
      nama_menu: 'Seblak Cilok Cuanki Mala Chili Oil Bowl',
      deskripsi_menggugah_selera: 'Perpaduan seblak kenyal khas Bandung dengan kebas aroma lada Sichuan mala, siomay kering, dan minyak cabai wijen aromatik.',
      kategori: 'Seblak & Cuanki Kuah',
      estimasi_harga_rupiah: 28500,
      alasan_populer: 'Menu fusion yang sedang naik daun di TikTok, menghadirkan level pedas baru yang nagih tanpa pahit.',
      badge: '✨ Menu Baru',
    },
    {
      nama_menu: 'Signature Thai Milk Tea Brown Sugar Boba Kit',
      deskripsi_menggugah_selera: 'Bubuk seduh racikan daun teh hitam Assam dan rempah Thailand pekat, creamy susu murni, lengkap dengan boba empuk kenyal.',
      kategori: 'Bubuk Minuman Kafe',
      estimasi_harga_rupiah: 32000,
      alasan_populer: 'Praktis diseduh hangat atau dingin, memberikan pengalaman nongkrong di cafe cukup dari meja kerja.',
      badge: '🔥 Trending',
    },
  ],
  grounded: true,
  last_updated: new Date().toISOString(),
};

const AiTrendsContext = createContext<AiTrendsContextType | undefined>(undefined);

export const AiTrendsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [articles, setArticles] = useState<TrendingArticle[]>(defaultFallbackData.trending_articles);
  const [menus, setMenus] = useState<NewMenuItem[]>(defaultFallbackData.new_menus);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [grounded, setGrounded] = useState<boolean>(true);

  const fetchTrendsFromApi = async (): Promise<AiTrendsData> => {
    const res = await fetch('/api/trends');
    if (!res.ok) {
      throw new Error(`Gagal memuat tren: HTTP ${res.status}`);
    }
    const data: AiTrendsData = await res.json();
    return data;
  };

  const refreshTrends = useCallback(async (force = false) => {
    if (force) {
      setIsRefreshing(true);
    }

    try {
      // Check cache if not forcing
      if (!force) {
        const cachedRaw = localStorage.getItem(CACHE_KEY);
        if (cachedRaw) {
          try {
            const cached = JSON.parse(cachedRaw);
            const isFresh = Date.now() - cached.timestamp < CACHE_DURATION_MS;
            if (isFresh && cached.data?.trending_articles && cached.data?.new_menus) {
              setArticles(cached.data.trending_articles);
              setMenus(cached.data.new_menus);
              setLastUpdated(cached.data.last_updated || new Date(cached.timestamp).toISOString());
              setGrounded(cached.data.grounded ?? true);
              setLoading(false);
              return;
            }
          } catch (e) {
            console.warn('Gagal membaca cache tren:', e);
          }
        }
      }

      // Fetch from API
      const freshData = await fetchTrendsFromApi();
      setArticles(freshData.trending_articles || defaultFallbackData.trending_articles);
      setMenus(freshData.new_menus || defaultFallbackData.new_menus);
      setLastUpdated(freshData.last_updated || new Date().toISOString());
      setGrounded(freshData.grounded ?? true);

      // Save to localStorage
      try {
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            data: freshData,
            timestamp: Date.now(),
          })
        );
      } catch (e) {
        console.warn('Gagal menyimpan cache tren ke localStorage:', e);
      }
    } catch (err) {
      console.error('Error saat refresh tren:', err);
      // Fallback if needed
      if (articles.length === 0) {
        setArticles(defaultFallbackData.trending_articles);
        setMenus(defaultFallbackData.new_menus);
        setLastUpdated(new Date().toISOString());
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [articles.length]);

  // Initial load
  useEffect(() => {
    refreshTrends(false);
  }, [refreshTrends]);

  const getTimeAgo = (): string => {
    if (!lastUpdated) return 'Baru saja';
    try {
      const diffMs = Date.now() - new Date(lastUpdated).getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      if (diffMins < 1) return 'Baru saja diperbarui';
      if (diffMins < 60) return `${diffMins} menit lalu`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours} jam lalu`;
      return '1 hari lalu';
    } catch {
      return 'Hari ini';
    }
  };

  return (
    <AiTrendsContext.Provider
      value={{
        articles,
        menus,
        loading,
        isRefreshing,
        lastUpdated,
        grounded,
        refreshTrends,
        getTimeAgo,
      }}
    >
      {children}
    </AiTrendsContext.Provider>
  );
};

export const useAiTrends = () => {
  const context = useContext(AiTrendsContext);
  if (!context) {
    throw new Error('useAiTrends must be used within an AiTrendsProvider');
  }
  return context;
};
