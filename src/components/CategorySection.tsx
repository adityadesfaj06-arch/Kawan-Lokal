import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Layers, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAiTrends } from '../context/AiTrendsContext';
import { PRODUCTS } from '../data/products';
import { SafeImage } from './SafeImage';

interface VisualCategory {
  id: string;
  name: string;
  countText: string;
  image: string;
  tag: string;
  isAiNew?: boolean;
}

const BASE_VISUAL_CATEGORIES: VisualCategory[] = [
  {
    id: 'Bakery & Cookies',
    name: 'NYC Chunky Cookies',
    countText: 'Varian Gooey',
    image: '/viral-chunky-cookie.jpg',
    tag: 'Soft-Baked & Molten Choco',
  },
  {
    id: 'Bubuk Minuman',
    name: 'Bubuk Minuman Cafe',
    countText: 'Varian Rasa',
    image: '/thai-tea-powder-authentic.jpg',
    tag: 'Matcha, Taro, Red Velvet & Tea',
  },
  {
    id: 'Latiao Viral',
    name: 'Latiao Mala Viral',
    countText: 'Varian Mala',
    image: '/latiao-strip-main.jpg',
    tag: 'Stik & Lembaran Mala',
  },
  {
    id: 'Cuanki & Baso Aci',
    name: 'Cuanki & Baso Aci',
    countText: 'Paket Lengkap',
    image: '/cuanki-lengkap-instan.jpg',
    tag: 'Cuanki Lidah & Siomay',
  },
  {
    id: 'Cimol Bojot',
    name: 'Cimol Bojot Garut',
    countText: 'Olahan Bojot',
    image: '/cimol-bojot-garut.jpg',
    tag: 'Minyak Bawang Garut',
  },
  {
    id: 'Basreng Crispy',
    name: 'Basreng Daun Jeruk',
    countText: 'Kriuk Nagih',
    image: '/basreng-stik-pedas-daun-jeruk.jpg',
    tag: 'Stik & Koin Renyah',
  },
  {
    id: 'Cemilan Gurih',
    name: 'Cemilan Gurih & Crispy',
    countText: 'Varian Gurih',
    image: '/makaroni-bantet-tasikmalaya.jpg',
    tag: 'Makaroni Bantet & Pangsit',
  },
  {
    id: 'Seblak Viral',
    name: 'Seblak Coet & Mercon',
    countText: 'Menu Pedas',
    image: '/seblak-cobek-rafael.jpg',
    tag: 'Kencur & Rawit Hijau',
  },
  {
    id: 'Viral Picks',
    name: 'Keranjang Kuning Hits',
    countText: 'Paling Laris',
    image: '/keranjang-kuning-hits.jpg',
    tag: 'Trending TikTok',
  },
];

export const CategorySection: React.FC = () => {
  const { navigate } = useCart();
  const aiTrends = useAiTrends();
  const rawProducts = aiTrends?.products;
  const products = Array.isArray(rawProducts) && rawProducts.length > 0 ? rawProducts : PRODUCTS;
  const newProductsCount = aiTrends?.newProductsCount || 0;

  const handleSelectCategory = (catId: string) => {
    navigate(`/discover?category=${encodeURIComponent(catId)}`);
  };

  // Find any new categories discovered by AI that aren't in base visual categories
  const baseCategoryIds = new Set(BASE_VISUAL_CATEGORIES.map((c) => c.id));
  const uniqueAiCategories: string[] = Array.from(
    new Set(
      products
        .filter((p) => p.isAiDiscovered && !baseCategoryIds.has(p.category))
        .map((p) => String(p.category))
    )
  );

  const dynamicAiCards: VisualCategory[] = uniqueAiCategories.map((catName) => {
    const matchingProducts = products.filter((p) => p.category === catName);
    const sampleProduct = matchingProducts[0];
    return {
      id: catName,
      name: catName,
      countText: `${matchingProducts.length} Menu Baru`,
      image: sampleProduct?.image || `https://image.pollinations.ai/prompt/${encodeURIComponent(catName + ' indonesian food photography')}?width=600&height=400&nologo=true&seed=${catName}`,
      tag: '✨ Kategori Baru AI',
      isAiNew: true,
    };
  });

  const allDisplayCategories: VisualCategory[] = [
    ...dynamicAiCards,
    ...BASE_VISUAL_CATEGORIES.map((cat) => {
      const count =
        cat.id === 'Viral Picks'
          ? products.filter((p) => p.viralStatus).length
          : products.filter((p) => p.category === cat.id).length;
      return {
        ...cat,
        countText: `${count} ${cat.countText}`,
      };
    }),
  ];

  return (
    <section id="categories" className="py-16 sm:py-24 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-14 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D9C7AE]/30 text-[#241A14] text-xs font-bold uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5 text-[#E85D32]" />
              <span>Kategori Makanan</span>
            </span>
            {newProductsCount > 0 && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#E85D32]/10 text-[#E85D32] border border-[#E85D32]/20 text-[11px] font-black uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-[#E85D32]" />
                <span>Auto-Discovery Aktif</span>
              </span>
            )}
          </div>

          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#241A14] tracking-tight">
            EKSPLORASI BERDASARKAN RASA
          </h2>
          <p className="mt-2 text-base sm:text-lg text-[#6B5546]">
            Temukan makanan viral berdasarkan mood dan craving kamu hari ini. Kategori otomatis bertambah seiring hadirnya jajanan baru!
          </p>
        </div>

        <button
          onClick={() => navigate('/discover')}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#241A14] hover:text-[#E85D32] transition-colors py-2 cursor-pointer"
        >
          <span>Lihat Semua Menu</span>
          <ArrowRight className="w-4 h-4 text-[#E85D32]" />
        </button>
      </div>

      {/* Grid of Visual Category Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {allDisplayCategories.map((cat) => (
          <motion.button
            key={cat.id}
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ duration: 0.2 }}
            onClick={() => handleSelectCategory(cat.id)}
            className="group relative h-48 sm:h-56 md:h-64 rounded-3xl overflow-hidden text-left border border-[#D9C7AE]/40 shadow-sm hover:shadow-xl transition-all duration-300 block w-full cursor-pointer"
          >
            {/* Background Image with SafeImage */}
            <SafeImage
              src={cat.image}
              alt={cat.name}
              fallbackCategory="general"
              className="absolute inset-0 w-full h-full"
              imageClassName="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors pointer-events-none" />

            {/* Content */}
            <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-between pointer-events-none">
              <div>
                <span
                  className={`inline-block px-2.5 py-1 rounded-full backdrop-blur-md text-[#FFFDF8] text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                    cat.isAiNew ? 'bg-[#E85D32]' : 'bg-black/40'
                  }`}
                >
                  {cat.tag}
                </span>
              </div>
              <div>
                <h3 className="font-display font-extrabold text-lg sm:text-xl md:text-2xl text-white group-hover:text-[#D9C7AE] transition-colors leading-snug">
                  {cat.name}
                </h3>
                <div className="mt-1 flex items-center justify-between text-xs text-white/80 font-medium">
                  <span>{cat.countText}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#E85D32] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
};
