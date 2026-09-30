import React from 'react';
import { motion } from 'motion/react';
import { Star, ArrowRight, Calendar, User, Sparkles, Quote } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { useCart } from '../context/CartContext';

export const ReviewsSection: React.FC = () => {
  const { navigate } = useCart();

  // Featured review is Latiao Spicy Strips Viral
  const featuredProduct = PRODUCTS.find((p) => p.slug === 'latiao-spicy-strips') || PRODUCTS[0];
  
  // Secondary review items: Paket Cuanki Lengkap, Cimol Bojot Garut, Basreng Daun Jeruk
  const secondaryProducts = [
    PRODUCTS.find((p) => p.slug === 'paket-cuanki-lengkap') || PRODUCTS[1],
    PRODUCTS.find((p) => p.slug === 'cimol-bojot-garut') || PRODUCTS[2],
    PRODUCTS.find((p) => p.slug === 'basreng-pedas-daun-jeruk') || PRODUCTS[5],
  ];

  return (
    <section id="reviews" className="py-16 sm:py-24 bg-[#FFFDF8] border-y border-[#D9C7AE]/40">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#241A14] text-white text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#E85D32]" />
            <span>Honest Editorial Reviews</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#241A14] tracking-tight">
            LATEST REVIEWS
          </h2>
          <p className="mt-2 text-base sm:text-lg text-[#6B5546]">
            Sudah dicoba. Sekarang giliran kamu menilai. Ulasan detail, rasa apa adanya, tanpa kompromi.
          </p>
        </div>

        {/* Asymmetrical Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Large Featured Review Card (7 Cols) */}
          <motion.article
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
            onClick={() => navigate(`/food/${featuredProduct.slug}`)}
            className="lg:col-span-7 group flex flex-col bg-[#F8F5EF] rounded-[32px] border border-[#D9C7AE]/60 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            {/* Featured Image */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#241A14]">
              <img
                src={featuredProduct.image}
                alt={featuredProduct.review.title}
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              <div className="absolute top-5 left-5">
                <span className="px-3.5 py-1.5 rounded-full bg-[#E85D32] text-white text-xs font-extrabold tracking-wide shadow-md">
                  FEATURED REVIEW
                </span>
              </div>

              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-white">
                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold">
                  <Star className="w-4 h-4 fill-[#E85D32] text-[#E85D32]" />
                  <span>{featuredProduct.rating.toFixed(1)} / 10 RATING</span>
                </div>
                <span className="text-xs uppercase tracking-wider font-semibold text-[#D9C7AE]">
                  {featuredProduct.category}
                </span>
              </div>
            </div>

            {/* Featured Review Content */}
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4 text-xs font-semibold text-[#6B5546] mb-3">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#E85D32]" />
                    <span>Reno (Food Creator)</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{featuredProduct.review.date}</span>
                  </span>
                </div>

                <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-[#241A14] group-hover:text-[#E85D32] transition-colors leading-tight">
                  &ldquo;{featuredProduct.review.title}&rdquo;
                </h3>

                <p className="mt-3 text-base sm:text-lg text-[#6B5546] leading-relaxed">
                  {featuredProduct.review.reviewHeroExcerpt || featuredProduct.review.creatorVerdict}
                </p>

                {/* Creator Quote Pill */}
                <div className="mt-5 p-4 rounded-2xl bg-[#FFFDF8] border border-[#D9C7AE]/50 flex items-start gap-3">
                  <Quote className="w-5 h-5 text-[#E85D32] shrink-0 mt-0.5" />
                  <p className="text-sm font-medium italic text-[#241A14]">
                    {featuredProduct.review.creatorVerdict}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[#D9C7AE]/40 flex items-center justify-between">
                <span className="text-xs font-bold text-[#6B5546] uppercase tracking-wider">
                  Verdict: <span className="text-[#E85D32] font-black">{featuredProduct.review.verdictTag}</span>
                </span>
                
                <span className="inline-flex items-center gap-2 text-sm font-extrabold text-[#241A14] group-hover:text-[#E85D32] transition-colors">
                  <span>READ FULL REVIEW</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </motion.article>

          {/* Right Column with 3 Asymmetric Review Cards (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {secondaryProducts.map((prod) => (
              <motion.article
                key={prod.id}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                onClick={() => navigate(`/food/${prod.slug}`)}
                className="group flex flex-col sm:flex-row bg-[#F8F5EF] rounded-[24px] border border-[#D9C7AE]/50 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer p-4 gap-4 items-center"
              >
                <div className="w-full sm:w-36 h-32 sm:h-full aspect-square sm:aspect-auto rounded-2xl overflow-hidden shrink-0 relative bg-[#241A14]">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-bold text-white flex items-center gap-1">
                    <Star className="w-3 h-3 fill-[#E85D32] text-[#E85D32]" />
                    <span>{prod.rating.toFixed(1)}</span>
                  </div>
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#6B5546] mb-1">
                      <span className="font-semibold uppercase tracking-wider text-[11px] text-[#E85D32]">
                        {prod.category}
                      </span>
                      <span>{prod.review.date}</span>
                    </div>

                    <h4 className="font-display font-bold text-base sm:text-lg text-[#241A14] group-hover:text-[#E85D32] transition-colors line-clamp-1">
                      {prod.review.title}
                    </h4>

                    <p className="mt-1 text-xs text-[#6B5546] line-clamp-2 italic">
                      &ldquo;{prod.review.quote}&rdquo;
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#D9C7AE]/30 flex items-center justify-between text-xs">
                    <span className="font-bold text-[#241A14]">
                      {prod.name}
                    </span>
                    <span className="text-[#E85D32] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>Review</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
