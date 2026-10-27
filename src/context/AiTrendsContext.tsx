import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { TrendingArticle, NewMenuItem, AiTrendsData, Product, AiDiscoveredProduct } from '../types';
import { PRODUCTS } from '../data/products';

interface CategoryOption {
  id: string;
  name: string;
  count: number;
}

interface AiTrendsContextType {
  articles: TrendingArticle[];
  menus: NewMenuItem[];
  products: Product[];
  injectedProducts: Product[];
  categories: CategoryOption[];
  newProductsCount: number;
  loading: boolean;
  isRefreshing: boolean;
  lastUpdated: string | null;
  todayDateFormatted: string;
  grounded: boolean;
  refreshTrends: (force?: boolean) => Promise<void>;
  refreshProducts: (force?: boolean) => Promise<void>;
  getTimeAgo: () => string;
}

const DAILY_DATE_KEY = 'kawanlokal_trends_daily_date';
const CACHE_DATA_KEY = 'kawanlokal_trends_daily_cache';
const CATALOG_PRODUCTS_CACHE_KEY = 'kawanlokal_ai_products_catalog';
const CATALOG_DATE_KEY = 'kawanlokal_ai_products_date';

const getTodayDateKey = (): string => {
  return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
};

const getTodayFormatted = (): string => {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());
};

// Initial Fallback Data with specific required imageKeywords and unique seeds
const defaultFallbackData: AiTrendsData = {
  trending_articles: [
    {
      judul: 'Fenomena Daun Jeruk Melimpah: Kenapa Basreng Krispi Pedas Terus Memuncaki FYP?',
      kategori: 'Jajanan Viral',
      tanggal_hari_ini: getTodayFormatted(),
      ringkasan: 'Kombinasi aroma daun jeruk purut segar dengan cabai rawit merah sangrai menjadi formula viral yang sukses membuat jutaan anak muda ketagihan renyahnya camilan khas Bandung.',
      ringkasan_singkat: 'Kombinasi aroma daun jeruk purut segar dengan cabai rawit merah sangrai menjadi formula viral yang sukses membuat jutaan anak muda ketagihan renyahnya camilan khas Bandung.',
      isi_artikel_lengkap: 'Camilan basreng (bakso goreng) daun jeruk berhasil membuktikan diri sebagai penguasa konten kuliner di platform TikTok dan Instagram. Kunci kenikmatannya bukan sekadar rasa pedas membakar, melainkan harmonisasi antara daun jeruk purut pilihan yang disangrai kering bersama minyak bawang dan cabai rawit merah asli. Tekstur stik ikan tenggiri yang dipotong presisi menghasilkan kerenyahan maksimal yang tidak keras saat dikunyah. Para food vlogger sepakat bahwa sensasi kriuk berpadu aroma citrus aromatik inilah yang membuat siapapun sulit berhenti mengunyah begitu kemasan dibuka.',
      waktu_baca: '2 mnt baca',
      imageKeyword: 'indonesian spicy basreng chips with lime leaves daun jeruk',
      image_keyword: 'indonesian spicy basreng chips with lime leaves daun jeruk',
      imageUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent('indonesian spicy basreng chips with lime leaves daun jeruk')}?width=600&height=400&nologo=true&seed=0`,
    },
    {
      judul: 'Evolusi Minuman Cafe di Rumah: Tren Bubuk Thai Tea & Matcha Crafting Makin Populer',
      kategori: 'Minuman Kekinian',
      tanggal_hari_ini: getTodayFormatted(),
      ringkasan: 'Generasi muda kini gemar meracik sendiri minuman ala cafe premium menggunakan bubuk konsentrat pekat, hemat budget namun dengan cita rasa otentik.',
      ringkasan_singkat: 'Generasi muda kini gemar meracik sendiri minuman ala cafe premium menggunakan bubuk konsentrat pekat, hemat budget namun dengan cita rasa otentik.',
      isi_artikel_lengkap: 'Kenaikan tren konsumsi minuman cafe mendorong maraknya kreasi "home cafe" di kalangan Gen Z dan milenial. Menggunakan bubuk minuman berkualitas kafe bintang lima seperti Thai Tea daun teh pekat dan Matcha artisanal, siapa saja kini bisa menciptakan minuman segar ala gerai mall cukup dalam hitungan detik. Kawan Lokal menjawab tren ini dengan menghadirkan kemasan canister siap seduh yang praktis, ekonomis, dan menghasilkan rasa yang konsisten lezat.',
      waktu_baca: '3 mnt baca',
      imageKeyword: 'iced thai tea and matcha latte on cafe table',
      image_keyword: 'iced thai tea and matcha latte on cafe table',
      imageUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent('iced thai tea and matcha latte on cafe table')}?width=600&height=400&nologo=true&seed=1`,
    },
    {
      judul: 'Seblak Kuah Jeletot & Baso Aci Rempah: Kenyamanan Kuliner Nusantara di Segala Suasana',
      kategori: 'Kuliner Hangat',
      tanggal_hari_ini: getTodayFormatted(),
      ringkasan: 'Kuliner berkuah hangat dengan cita rasa kencur gurih pedas kembali membludak di pencarian media sosial, menginspirasi banyak variasi topping unik.',
      ringkasan_singkat: 'Kuliner berkuah hangat dengan cita rasa kencur gurih pedas kembali membludak di pencarian media sosial, menginspirasi banyak variasi topping unik.',
      isi_artikel_lengkap: 'Aroma kencur sangrai dan cabai pedas seblak kuah selalu memiliki tempat spesial di lidah masyarakat Indonesia. Musim hujan dan cuaca dingin semakin memperkuat popularitas seblak cuanki instan di keranjang kuning e-commerce. Kombinasi kerupuk kenyal, siomay kering renyah, dan pilus cikur gurih menciptakan sensasi makan berkuah yang menenangkan sekaligus menggugah selera.',
      waktu_baca: '2 mnt baca',
      imageKeyword: 'indonesian spicy seblak and baso aci in a bowl with ceker',
      image_keyword: 'indonesian spicy seblak and baso aci in a bowl with ceker',
      imageUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent('indonesian spicy seblak and baso aci in a bowl with ceker')}?width=600&height=400&nologo=true&seed=2`,
    },
  ],
  new_menus: [
    {
      id: 'ai-menu-basreng-smoky-bbq',
      nama_menu: 'Basreng Stick Daun Jeruk Smoky BBQ Hot',
      deskripsi_menggugah_selera: 'Stik bakso ikan tenggiri renyah berpadu bumbu BBQ asap kayu manis, cabai bubuk grade A, dan taburan daun jeruk cincang kering yang melimpah.',
      kategori: 'Camilan Pedas Gurih',
      estimasi_harga_rupiah: 24000,
      alasan_populer: 'Viral karena sensasi kriuk tahan lama dan perpaduan wangi asap BBQ dengan pedas asam jeruk yang segar.',
      badge: '✨ Baru & Viral',
      imageKeyword: 'crispy basreng spicy bbq kaffir lime leaf indonesian snack food photography',
      imageUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent('crispy basreng spicy bbq kaffir lime leaf indonesian snack food photography')}?width=600&height=400&nologo=true&seed=101`,
    },
    {
      id: 'ai-menu-seblak-cuanki-mala',
      nama_menu: 'Seblak Cilok Cuanki Mala Chili Oil Bowl',
      deskripsi_menggugah_selera: 'Perpaduan seblak kenyal khas Bandung dengan kebas aroma lada Sichuan mala, siomay kering, dan minyak cabai wijen aromatik.',
      kategori: 'Seblak & Cuanki Kuah',
      estimasi_harga_rupiah: 28500,
      alasan_populer: 'Menu fusion yang sedang naik daun di TikTok, menghadirkan level pedas baru yang nagih tanpa rasa pahit.',
      badge: '✨ Baru & Viral',
      imageKeyword: 'spicy mala seblak cuanki noodle bowl with chili oil and fried siomay food photography',
      imageUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent('spicy mala seblak cuanki noodle bowl with chili oil and fried siomay food photography')}?width=600&height=400&nologo=true&seed=102`,
    },
    {
      id: 'ai-menu-thai-tea-boba-kit',
      nama_menu: 'Signature Thai Milk Tea Brown Sugar Boba Kit',
      deskripsi_menggugah_selera: 'Bubuk seduh racikan daun teh hitam Assam dan rempah Thailand pekat, creamy susu murni, lengkap dengan boba empuk kenyal.',
      kategori: 'Bubuk Minuman Kafe',
      estimasi_harga_rupiah: 32000,
      alasan_populer: 'Praktis diseduh hangat atau dingin, memberikan pengalaman nongkrong di cafe cukup dari meja kerja.',
      badge: '✨ Baru & Viral',
      imageKeyword: 'thai milk tea with tapioca brown sugar boba glass drink food photography',
      imageUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent('thai milk tea with tapioca brown sugar boba glass drink food photography')}?width=600&height=400&nologo=true&seed=103`,
    },
  ],
  auto_discovered_products: [
    {
      id: 'ai-prod-cromboloni-cokelat',
      name: 'Cromboloni Lumer Belgian Dark Chocolate',
      category: 'Dessert Kekinian',
      price: 28000,
      description: 'Pastry renyah berulir keemasan dengan isian lelehan cokelat Belgia lumer melimpah di setiap gigitan.',
      badge: '✨ Baru & Viral',
      imagePrompt: 'flaky chocolate cromboloni pastry with melted chocolate filling, professional food photography, close up, appetizing',
    },
    {
      id: 'ai-prod-cirambay-chili-oil',
      name: 'Cirambay Pedas Jeruk Nipis Chili Oil',
      category: 'Cemilan Pedas',
      price: 18500,
      description: 'Mie pipih tapioka kenyal lembut berpadu minyak cabai bawang putih wangi dan aroma segar daun jeruk.',
      badge: '✨ Baru & Viral',
      imagePrompt: 'indonesian spicy cirambay tapioca noodle with chili oil garlic lime leaf, close up food photography',
    },
    {
      id: 'ai-prod-matcha-cheese-cream',
      name: 'Kyoto Matcha Cheese Cream Foam Latte',
      category: 'Minuman Viral',
      price: 32000,
      description: 'Paduan teh hijau matcha artisanal pekat dengan lapisan busa krim keju gurih creamy yang memanjakan lidah.',
      badge: '✨ Baru & Viral',
      imagePrompt: 'iced matcha latte layered drink with thick savory cheese foam topping, aesthetic cafe lighting',
    },
    {
      id: 'ai-prod-pisang-bakar-karamel',
      name: 'Pisang Bakar Cokelat Keju Karamel Smokey',
      category: 'Dessert Tradisional',
      price: 22000,
      description: 'Pisang kepok manis bakar aroma arang disiram saus karamel mentega, limpahan keju cheddar parut, dan meses cokelat.',
      badge: '✨ Baru & Viral',
      imagePrompt: 'indonesian grilled banana with shredded cheese chocolate condensed milk drizzle on banana leaf',
    },
  ],
  grounded: true,
  last_updated: new Date().toISOString(),
};

// Convert an AiDiscoveredProduct into a fully functional Product entity for the catalog
const convertDiscoveredToProduct = (item: AiDiscoveredProduct, index: number): Product => {
  const safeId = item.id || `ai-discovered-${index}-${Date.now()}`;
  const slug = safeId.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const price = item.price || 25000;
  const prompt = item.imagePrompt || `${item.name}, high quality food photography, studio lighting`;
  const imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + ', high quality food photography, studio lighting')}?width=600&height=600&nologo=true&seed=${safeId}`;

  const catLower = (item.category || '').toLowerCase();
  const isBeverage = catLower.includes('minuman') || catLower.includes('tea') || catLower.includes('latte') || catLower.includes('kopi');

  return {
    id: safeId,
    slug: slug,
    name: item.name,
    subtitle: item.description,
    category: item.category,
    rating: 9.7,
    reviewCount: 320 + (index * 45),
    price: price,
    location: 'Viral Hari Ini',
    viralStatus: true,
    viralBadgeText: '✨ Baru Ditambahkan Otomatis',
    featuredInReviews: true,
    image: imgUrl,
    galleryImages: [imgUrl],
    isAiGenerated: true,
    isAiDiscovered: true,
    aiReasonViral: item.description,
    imagePrompt: item.imagePrompt,
    tasteProfile: {
      sweet: isBeverage ? 70 : 30,
      creamy: isBeverage ? 75 : 20,
      crunchy: isBeverage ? 10 : 85,
      rich: 85,
      spicy: catLower.includes('pedas') || catLower.includes('chili') ? 88 : 10,
    },
    review: {
      title: `${item.name}: Tren Kuliner Viral Baru yang Sedang Booming`,
      date: getTodayFormatted(),
      creatorVerdict: item.description,
      verdictTag: 'MUST TRY',
      whatILiked: [
        'Cita rasa autentik kekinian dengan presentasi visual menggugah selera',
        'Tekstur pas dan bumbu racikan melimpah',
        'Inovasi menu yang sedang ramai dibicarakan di media sosial',
      ],
      whatIDidntLike: [
        'Stok batch baru terbatas karena peminat yang tinggi',
      ],
      whoShouldTryIt: 'Pencinta eksplorasi kuliner kekinian yang selalu update dengan tren makanan terbaru.',
      quote: `Sensasi menu baru: ${item.name}. ${item.description}`,
      reviewHeroExcerpt: item.description,
    },
    variants: [
      {
        id: 'porsi-standar',
        name: 'Porsi Standar Rekomendasi',
        priceModifier: 0,
        image: imgUrl,
        availability: true,
        colorTag: '#E85D32',
      },
      {
        id: 'porsi-jumbo',
        name: 'Porsi Jumbo / Extra Topping',
        priceModifier: 3000,
        image: imgUrl,
        availability: true,
        colorTag: '#CA9344',
      },
    ],
    packageOptions: [
      {
        id: 'single',
        name: '1 Pack Spesial',
        multiplier: 1,
      },
      {
        id: 'bundle-2',
        name: 'Paket Hemat 2 Pack',
        multiplier: 2,
        discountPercent: 5,
      },
    ],
    prepTime: 'Siap Saji',
    shelfLife: '3 Bulan',
    storageInfo: 'Simpan di tempat kering dan sejuk',
    productType: isBeverage ? 'beverage_powder' : 'food',
  };
};

// Safe converter for NewMenuItem if needed by any legacy caller or module
export const convertNewMenuToProduct = (menu: NewMenuItem, index: number = 0): Product => {
  const safeId = menu.id || `menu-${index}-${Date.now()}`;
  const slug = safeId.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const price = menu.estimasi_harga_rupiah || 25000;
  const prompt = menu.imageKeyword || menu.image_keyword || `${menu.nama_menu}, indonesian food photography, appetizing`;
  const imgUrl = menu.imageUrl || `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=600&height=400&nologo=true&seed=${index}`;
  const catLower = (menu.kategori || '').toLowerCase();
  const isBeverage = catLower.includes('minuman') || catLower.includes('tea') || catLower.includes('latte');

  return {
    id: safeId,
    slug: slug,
    name: menu.nama_menu,
    subtitle: menu.deskripsi_menggugah_selera,
    category: menu.kategori,
    rating: 9.8,
    reviewCount: 240 + (index * 30),
    price: price,
    location: 'Viral Minggu Ini',
    viralStatus: true,
    viralBadgeText: menu.badge || '✨ Baru & Viral',
    featuredInReviews: true,
    image: imgUrl,
    galleryImages: [imgUrl],
    isAiGenerated: true,
    aiReasonViral: menu.alasan_populer || menu.deskripsi_menggugah_selera,
    imagePrompt: prompt,
    tasteProfile: {
      sweet: isBeverage ? 70 : 30,
      creamy: isBeverage ? 75 : 20,
      crunchy: isBeverage ? 10 : 85,
      rich: 85,
      spicy: catLower.includes('pedas') ? 90 : 15,
    },
    review: {
      title: `${menu.nama_menu}: Sensasi Baru Hasil Kurasi AI`,
      date: getTodayFormatted(),
      creatorVerdict: menu.deskripsi_menggugah_selera,
      verdictTag: 'MUST TRY',
      whatILiked: ['Rasa bumbu tebal dan aromatik', 'Tekstur menggugah selera'],
      whatIDidntLike: ['Stok terbatas'],
      whoShouldTryIt: 'Pencinta jajanan viral kekinian.',
      quote: menu.deskripsi_menggugah_selera,
    },
    variants: [
      {
        id: 'porsi-standar',
        name: 'Porsi Standar',
        priceModifier: 0,
        image: imgUrl,
        availability: true,
      },
    ],
    packageOptions: [
      {
        id: 'single',
        name: '1 Pack Spesial',
        multiplier: 1,
      },
    ],
    prepTime: 'Siap Saji',
    shelfLife: '3 Bulan',
    storageInfo: 'Simpan di tempat kering dan sejuk',
    productType: isBeverage ? 'beverage_powder' : 'food',
  };
};

const AiTrendsContext = createContext<AiTrendsContextType | undefined>(undefined);

export const AiTrendsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [articles, setArticles] = useState<TrendingArticle[]>(defaultFallbackData.trending_articles);
  const [menus, setMenus] = useState<NewMenuItem[]>(defaultFallbackData.new_menus);
  const [discoveredProducts, setDiscoveredProducts] = useState<AiDiscoveredProduct[]>(
    defaultFallbackData.auto_discovered_products || []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [grounded, setGrounded] = useState<boolean>(true);

  // Full merged products catalog: AI auto-discovered products prepended to top of catalog!
  const products: Product[] = useMemo(() => {
    const aiProducts = discoveredProducts.map((p, idx) => convertDiscoveredToProduct(p, idx));
    return [...aiProducts, ...PRODUCTS];
  }, [discoveredProducts]);

  // Non-hardcoded dynamic categories list: takes all unique categories from products state
  const categories: CategoryOption[] = useMemo(() => {
    const uniqueCats = Array.from(new Set(products.map((p) => p.category))).sort();
    return [
      { id: 'all', name: 'Semua Produk', count: products.length },
      ...uniqueCats.map((cat) => ({
        id: cat,
        name: cat,
        count: products.filter((p) => p.category === cat).length,
      })),
    ];
  }, [products]);

  const fetchTrendsFromApi = async (force = false): Promise<AiTrendsData> => {
    const url = force ? '/api/trends?force=true' : '/api/trends';
    const res = await fetch(url);
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
    const todayDateKey = getTodayDateKey();

    try {
      // 1. Check daily calendar date match in localStorage if not forcing
      if (!force) {
        const storedDate = localStorage.getItem(DAILY_DATE_KEY);
        const storedDataRaw = localStorage.getItem(CACHE_DATA_KEY);
        if (storedDate === todayDateKey && storedDataRaw) {
          try {
            const cachedData: AiTrendsData = JSON.parse(storedDataRaw);
            if (
              Array.isArray(cachedData.trending_articles) &&
              cachedData.trending_articles.length > 0
            ) {
              setArticles(cachedData.trending_articles);
              setMenus(cachedData.new_menus || defaultFallbackData.new_menus);
              if (Array.isArray(cachedData.auto_discovered_products) && cachedData.auto_discovered_products.length > 0) {
                setDiscoveredProducts(cachedData.auto_discovered_products);
              }
              setLastUpdated(cachedData.last_updated || new Date().toISOString());
              setGrounded(cachedData.grounded ?? true);
              setLoading(false);
              return;
            }
          } catch (e) {
            console.warn('Gagal membaca cache harian tren:', e);
          }
        }
      }

      // 2. Fetch fresh data from API
      const freshData = await fetchTrendsFromApi(force);
      const finalArticles =
        freshData.trending_articles && freshData.trending_articles.length > 0
          ? freshData.trending_articles
          : defaultFallbackData.trending_articles;

      const finalMenus =
        freshData.new_menus && freshData.new_menus.length > 0
          ? freshData.new_menus
          : defaultFallbackData.new_menus;

      const finalDiscovered =
        freshData.auto_discovered_products && freshData.auto_discovered_products.length > 0
          ? freshData.auto_discovered_products
          : defaultFallbackData.auto_discovered_products || [];

      setArticles(finalArticles);
      setMenus(finalMenus);
      setDiscoveredProducts(finalDiscovered);
      setLastUpdated(freshData.last_updated || new Date().toISOString());
      setGrounded(freshData.grounded ?? true);

      // 3. Save to localStorage with today's date key
      try {
        localStorage.setItem(DAILY_DATE_KEY, todayDateKey);
        localStorage.setItem(
          CACHE_DATA_KEY,
          JSON.stringify({
            ...freshData,
            trending_articles: finalArticles,
            new_menus: finalMenus,
            auto_discovered_products: finalDiscovered,
            date_key: todayDateKey,
            last_updated: freshData.last_updated || new Date().toISOString(),
          })
        );
        localStorage.setItem(CATALOG_PRODUCTS_CACHE_KEY, JSON.stringify(finalDiscovered));
        localStorage.setItem(CATALOG_DATE_KEY, todayDateKey);
      } catch (e) {
        console.warn('Gagal menyimpan tren harian ke localStorage:', e);
      }

      // Dispatch event for toast notification if new items were discovered
      if (finalDiscovered.length > 0) {
        window.dispatchEvent(
          new CustomEvent('kawanlokal_new_products_discovered', {
            detail: {
              count: finalDiscovered.length,
              categories: Array.from(new Set(finalDiscovered.map((p) => p.category))),
            },
          })
        );
      }
    } catch (err) {
      console.warn('Catatan saat memuat pembaruan tren harian:', err);
      // Fallback
      if (articles.length === 0) {
        setArticles(defaultFallbackData.trending_articles);
        setMenus(defaultFallbackData.new_menus);
        setDiscoveredProducts(defaultFallbackData.auto_discovered_products || []);
        setLastUpdated(new Date().toISOString());
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [articles.length]);

  // Automatic daily check on initial mount
  useEffect(() => {
    refreshTrends(false);
  }, [refreshTrends]);

  const getTimeAgo = (): string => {
    if (!lastUpdated) return 'Hari ini';
    try {
      const diffMs = Date.now() - new Date(lastUpdated).getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      if (diffMins < 1) return 'Baru saja diperbarui';
      if (diffMins < 60) return `${diffMins} mnt lalu`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours} jam lalu`;
      return 'Edisi Hari Ini';
    } catch {
      return 'Edisi Hari Ini';
    }
  };

  return (
    <AiTrendsContext.Provider
      value={{
        articles,
        menus,
        products,
        injectedProducts: products,
        categories,
        newProductsCount: discoveredProducts.length,
        loading,
        isRefreshing,
        lastUpdated,
        todayDateFormatted: getTodayFormatted(),
        grounded,
        refreshTrends,
        refreshProducts: refreshTrends,
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
