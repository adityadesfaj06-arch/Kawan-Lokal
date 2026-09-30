import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Layers } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/products';

interface VisualCategory {
  id: string;
  name: string;
  countText: string;
  image: string;
  tag: string;
}

const VISUAL_CATEGORIES: VisualCategory[] = [
  {
    id: 'Bakery & Cookies',
    name: 'NYC Chunky Cookies',
    countText: `${PRODUCTS.filter((p) => p.category === 'Bakery & Cookies').length} Varian Gooey`,
    image: '/viral-chunky-cookie.jpg',
    tag: 'Soft-Baked & Molten Choco',
  },
  {
    id: 'Bubuk Minuman',
    name: 'Bubuk Minuman Cafe',
    countText: `${PRODUCTS.filter((p) => p.category === 'Bubuk Minuman').length} Varian Rasa`,
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80',
    tag: 'Matcha, Taro, Red Velvet & Tea',
  },
  {
    id: 'Latiao Viral',
    name: 'Latiao Mala Viral',
    countText: `${PRODUCTS.filter((p) => p.category === 'Latiao Viral').length} Varian Mala`,
    image: '/latiao-strip-main.jpg',
    tag: 'Stik & Lembaran Mala',
  },
  {
    id: 'Cuanki & Baso Aci',
    name: 'Cuanki & Baso Aci',
    countText: `${PRODUCTS.filter((p) => p.category === 'Cuanki & Baso Aci').length} Paket Lengkap`,
    image: '/cuanki-lengkap-instan.jpg',
    tag: 'Cuanki Lidah & Siomay',
  },
  {
    id: 'Cimol Bojot',
    name: 'Cimol Bojot Garut',
    countText: `${PRODUCTS.filter((p) => p.category === 'Cimol Bojot').length} Olahan Bojot`,
    image: '/cimol-bojot-garut.jpg',
    tag: 'Minyak Bawang Garut',
  },
  {
    id: 'Basreng Crispy',
    name: 'Basreng Daun Jeruk',
    countText: `${PRODUCTS.filter((p) => p.category === 'Basreng Crispy').length} Kriuk Nagih`,
    image: '/basreng-stik-pedas-daun-jeruk.jpg',
    tag: 'Stik & Koin Renyah',
  },
  {
    id: 'Cemilan Gurih',
    name: 'Cemilan Gurih & Crispy',
    countText: `${PRODUCTS.filter((p) => p.category === 'Cemilan Gurih').length} Varian Gurih`,
    image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=800&q=80',
    tag: 'Makaroni Bantet & Pangsit',
  },
  {
    id: 'Seblak Viral',
    name: 'Seblak Coet & Mercon',
    countText: `${PRODUCTS.filter((p) => p.category === 'Seblak Viral').length} Menu Pedas`,
    image: 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?auto=format&fit=crop&w=800&q=80',
    tag: 'Kencur & Rawit Hijau',
  },
  {
    id: 'Viral Picks',
    name: 'Keranjang Kuning Hits',
    countText: `${PRODUCTS.filter((p) => p.viralStatus).length} Paling Laris`,
    image: '/keranjang-kuning-hits.jpg',
    tag: 'Trending TikTok',
  },
];

export const CategorySection: React.FC = () => {
  const { navigate } = useCart();

  const handleSelectCategory = (catId: string) => {
    navigate(`/discover?category=${encodeURIComponent(catId)}`);
  };

  return (
    <section id="categories" className="py-16 sm:py-24 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-14 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D9C7AE]/30 text-[#241A14] text-xs font-bold uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5 text-[#E85D32]" />
            <span>Kategori Makanan</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#241A14] tracking-tight">
            EKSPLORASI BERDASARKAN RASA
          </h2>
          <p className="mt-2 text-base sm:text-lg text-[#6B5546]">
            Temukan makanan viral berdasarkan mood dan craving kamu hari ini.
          </p>
        </div>

        <button
          onClick={() => navigate('/discover')}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#241A14] hover:text-[#E85D32] transition-colors py-2"
        >
          <span>Lihat Semua Menu</span>
          <ArrowRight className="w-4 h-4 text-[#E85D32]" />
        </button>
      </div>

      {/* Grid of Visual Category Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {VISUAL_CATEGORIES.map((cat) => (
          <motion.button
            key={cat.id}
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ duration: 0.2 }}
            onClick={() => handleSelectCategory(cat.id)}
            className="group relative h-48 sm:h-56 md:h-64 rounded-3xl overflow-hidden text-left border border-[#D9C7AE]/40 shadow-sm hover:shadow-xl transition-all duration-300 block w-full cursor-pointer"
          >
            {/* Background Image */}
            <img
              src={cat.image}
              alt={cat.name}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />

            {/* Content */}
            <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-between">
              <div>
                <span className="inline-block px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-[#FFFDF8] text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
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
