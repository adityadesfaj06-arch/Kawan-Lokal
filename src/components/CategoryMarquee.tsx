import React from 'react';
import { useCart } from '../context/CartContext';

interface MarqueeCategory {
  id: string;
  name: string;
  icon: string;
  count: string;
}

const MARQUEE_CATEGORIES: MarqueeCategory[] = [
  { id: 'Bakery & Cookies', name: 'NYC Chunky Cookies', icon: '🍪', count: 'Gooey & Soft-Baked' },
  { id: 'Bubuk Minuman', name: 'Bubuk Minuman Cafe', icon: '🧋', count: 'Matcha, Taro, Red Velvet & Tea' },
  { id: 'Latiao Viral', name: 'Latiao Viral', icon: '🌶️', count: 'Stik & Lembaran Mala' },
  { id: 'Cuanki & Baso Aci', name: 'Cuanki Bandung', icon: '🍲', count: 'Paket Lengkap' },
  { id: 'Cimol Bojot', name: 'Cimol Bojot', icon: '🧆', count: 'Minyak Bawang Garut' },
  { id: 'Basreng Crispy', name: 'Basreng Crispy', icon: '🐟', count: 'Stik & Koin Daun Jeruk' },
  { id: 'Cemilan Gurih', name: 'Cemilan Gurih', icon: '🥟', count: 'Makaroni Bantet & Pangsit' },
  { id: 'Seblak Viral', name: 'Seblak Coet', icon: '🍜', count: 'Kencur & Rawit Hijau' },
  { id: 'Spicy', name: 'Serba Pedas', icon: '🔥', count: 'Chili Oil & Mercon' },
  { id: 'Viral Picks', name: 'Keranjang Kuning', icon: '⚡', count: 'Trending TikTok' },
];

export const CategoryMarquee: React.FC = () => {
  const { navigate } = useCart();

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/discover?category=${encodeURIComponent(categoryId)}`);
  };

  // Duplicate categories to create continuous infinite marquee loop
  const duplicatedCategories = [...MARQUEE_CATEGORIES, ...MARQUEE_CATEGORIES, ...MARQUEE_CATEGORIES];

  return (
    <section aria-label="Kategori Makanan Viral" className="py-6 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        <div className="mask-marquee overflow-hidden py-2">
          <div className="animate-marquee flex items-center gap-3.5 sm:gap-5">
            {duplicatedCategories.map((cat, idx) => (
              <button
                key={`${cat.id}-${idx}`}
                onClick={() => handleCategoryClick(cat.id)}
                className="group flex items-center gap-3 px-5 py-3 rounded-full bg-[#FFFDF8] border border-[#D9C7AE]/60 hover:border-[#E85D32] shadow-sm hover:shadow-md transition-all duration-200 text-left shrink-0 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
              >
                <span className="text-xl sm:text-2xl filter drop-shadow-sm group-hover:scale-110 transition-transform">
                  {cat.icon}
                </span>
                <div>
                  <span className="block font-display font-bold text-sm sm:text-base text-[#241A14] group-hover:text-[#E85D32] transition-colors whitespace-nowrap">
                    {cat.name}
                  </span>
                  <span className="block text-[11px] text-[#6B5546] font-medium whitespace-nowrap">
                    {cat.count}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
