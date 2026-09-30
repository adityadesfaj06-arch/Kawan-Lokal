import React, { useState } from 'react';
import { ChevronRight, Clock, User, Share2, ArrowLeft, ArrowRight, ShoppingBag, Check, Sparkles, BookOpen, Quote } from 'lucide-react';
import { motion } from 'motion/react';
import { ARTICLES } from '../data/articles';
import { PRODUCTS } from '../data/products';
import { useCart } from '../context/CartContext';
import { Product } from '../types';

interface ArticleDetailProps {
  slug: string;
}

export const ArticleDetail: React.FC<ArticleDetailProps> = ({ slug }) => {
  const { navigate, addToCart } = useCart();
  const [copied, setCopied] = useState(false);
  const [addedProducts, setAddedProducts] = useState<Record<string, boolean>>({});

  const article = ARTICLES.find((a) => a.slug === slug) || ARTICLES[0];

  // Related products discussed in this article
  const relatedProducts: Product[] = article.relatedProductIds
    .map((pid) => PRODUCTS.find((p) => p.id === pid))
    .filter((p): p is Product => p !== undefined);

  // Other related articles
  const otherArticles = ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 3);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultVariant = product.variants[0];
    const defaultPackage = product.packageOptions[0];
    addToCart(product, defaultVariant, defaultPackage, 1);
    
    setAddedProducts((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedProducts((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  return (
    <article className="pt-28 pb-20 bg-[#F8F5EF] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#6B5546] mb-6 flex-wrap">
          <button onClick={() => navigate('/')} className="hover:text-[#241A14] transition-colors">
            Beranda
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-[#D9C7AE]" />
          <button onClick={() => navigate('/articles')} className="hover:text-[#241A14] transition-colors">
            Artikel
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-[#D9C7AE]" />
          <span className="text-[#241A14] font-semibold truncate max-w-[200px] sm:max-w-xs">
            {article.title}
          </span>
        </div>

        {/* Back Link */}
        <button
          onClick={() => navigate('/articles')}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#6B5546] hover:text-[#241A14] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Semua Artikel</span>
        </button>

        {/* Article Header Card */}
        <header className="bg-[#FFFDF8] rounded-3xl p-6 sm:p-10 border border-[#D9C7AE]/60 shadow-[0_8px_30px_rgb(36,26,20,0.04)] mb-8">
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <span className="px-3 py-1 rounded-full bg-[#E85D32] text-white text-xs font-bold shadow-sm">
              {article.category}
            </span>
            <span className="text-xs text-[#917562] flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-[#E85D32]" />
              {article.readTime}
            </span>
            <span className="text-[#D9C7AE]">•</span>
            <span className="text-xs text-[#917562] font-medium">{article.date}</span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-[#241A14] tracking-tight leading-tight">
            {article.title}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#6B5546] leading-relaxed font-normal">
            {article.subtitle}
          </p>

          {/* Author & Share bar */}
          <div className="mt-8 pt-6 border-t border-[#F0E8DC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/kawanlokal_/"
                target="_blank"
                rel="noreferrer"
                className="hover:opacity-90 transition-opacity"
              >
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-full object-cover border-2 border-[#D9C7AE]"
                />
              </a>
              <div>
                <a
                  href="https://www.instagram.com/kawanlokal_/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-bold text-[#241A14] hover:text-[#E85D32] transition-colors inline-block"
                >
                  {article.author.name}
                </a>
                <a
                  href="https://www.instagram.com/kawanlokal_/"
                  target="_blank"
                  rel="noreferrer"
                  className="block text-xs text-[#6B5546] hover:text-[#E85D32] transition-colors"
                >
                  {article.author.role}
                </a>
              </div>
            </div>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F8F5EF] hover:bg-[#EAE2D5] text-[#241A14] text-xs font-semibold border border-[#D9C7AE]/60 transition-colors self-start sm:self-auto"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Berhasil Disalin!' : 'Bagikan Artikel'}</span>
            </button>
          </div>
        </header>

        {/* Hero Image */}
        <div className="rounded-3xl overflow-hidden border border-[#D9C7AE]/60 shadow-[0_8px_30px_rgb(36,26,20,0.06)] mb-10 bg-[#EAE2D5]">
          <img
            src={article.heroImage}
            alt={article.title}
            referrerPolicy="no-referrer"
            className="w-full h-auto max-h-[460px] object-cover"
          />
          <div className="px-5 py-2.5 bg-[#FFFDF8] border-t border-[#F0E8DC] text-[11px] text-[#917562] italic">
            Dokumentasi & ulasan autentik tim KAWAN LOKAL • Makanan viral terverifikasi
          </div>
        </div>

        {/* Excerpt Callout */}
        <div className="bg-[#FFFDF8] rounded-2xl p-6 border-l-4 border-[#E85D32] border-[#D9C7AE]/60 mb-10 shadow-sm">
          <p className="text-base sm:text-lg text-[#241A14] font-medium leading-relaxed italic">
            "{article.excerpt}"
          </p>
        </div>

        {/* Article Body Content */}
        <div className="space-y-10">
          {article.sections.map((section, idx) => (
            <section key={idx} className="bg-[#FFFDF8] rounded-3xl p-6 sm:p-10 border border-[#D9C7AE]/60 shadow-sm">
              {section.heading && (
                <h2 className="font-display text-xl sm:text-2xl font-bold text-[#241A14] mb-4 tracking-tight">
                  {section.heading}
                </h2>
              )}

              <div className="space-y-4 text-[#423126] text-base sm:text-base leading-relaxed">
                {section.paragraphs.map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </div>

              {/* Highlight Box if present */}
              {section.highlightBox && (
                <div className="mt-6 p-5 rounded-2xl bg-[#FFF5EE] border border-[#E85D32]/30 flex items-start gap-3 text-sm text-[#9E3917]">
                  <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#E85D32]" />
                  <div className="leading-relaxed font-medium">{section.highlightBox}</div>
                </div>
              )}

              {/* Quote if present */}
              {section.quote && (
                <blockquote className="mt-6 p-5 rounded-2xl bg-[#F8F5EF] border border-[#D9C7AE]/50 flex items-start gap-3">
                  <Quote className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#E85D32]" />
                  <p className="text-sm font-semibold text-[#241A14] italic leading-relaxed">
                    {section.quote}
                  </p>
                </blockquote>
              )}

              {/* List items if present */}
              {section.listItems && (
                <ul className="mt-4 space-y-2 text-sm text-[#6B5546]">
                  {section.listItems.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-2">
                      <span className="text-[#E85D32] font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        {/* Tags */}
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[#241A14]">Tag Terkait:</span>
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full bg-[#FFFDF8] border border-[#D9C7AE]/60 text-xs font-medium text-[#6B5546]"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* FEATURE: Products Discussed in this Article */}
        {relatedProducts.length > 0 && (
          <div className="mt-14 pt-10 border-t border-[#D9C7AE]/60">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingBag className="w-4 h-4 text-[#E85D32]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#E85D32]">
                Langsung Masuk Keranjang
              </span>
            </div>
            <h3 className="font-display text-2xl font-black text-[#241A14] tracking-tight mb-6">
              Produk yang Dibahas di Artikel Ini
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => navigate(`/food/${product.slug}`)}
                  className="bg-[#FFFDF8] rounded-2xl border border-[#D9C7AE]/70 p-4 shadow-sm hover:shadow-md transition-all flex gap-4 cursor-pointer group"
                >
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-[#EAE2D5] flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>

                  <div className="flex flex-col justify-between flex-grow min-w-0">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-[#E85D32] font-semibold mb-1">
                        <span>★ {product.rating}</span>
                        <span className="text-[#917562]">({product.reviewCount})</span>
                      </div>
                      <h4 className="font-display text-sm font-bold text-[#241A14] truncate group-hover:text-[#E85D32] transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-xs font-extrabold text-[#241A14] mt-1">
                        Rp {product.price.toLocaleString('id-ID')}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={(e) => handleQuickAdd(product, e)}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1 ${
                          addedProducts[product.id]
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#E85D32] hover:bg-[#C74820] text-white'
                        }`}
                      >
                        {addedProducts[product.id] ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Ditambahkan!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Beli Sekarang</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/food/${product.slug}`);
                        }}
                        className="py-1.5 px-2.5 rounded-lg border border-[#D9C7AE]/60 hover:bg-[#F8F5EF] text-[#6B5546] text-xs font-semibold"
                      >
                        Detail
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other Recommended Articles */}
        <div className="mt-16 pt-10 border-t border-[#D9C7AE]/60">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-xl sm:text-2xl font-bold text-[#241A14]">
              Artikel Terkait Lainnya
            </h3>
            <button
              onClick={() => navigate('/articles')}
              className="text-xs font-bold text-[#E85D32] hover:text-[#C74820] flex items-center gap-1"
            >
              Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {otherArticles.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/article/${item.slug}`)}
                className="bg-[#FFFDF8] rounded-2xl border border-[#D9C7AE]/60 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col"
              >
                <div className="aspect-[16/10] overflow-hidden bg-[#EAE2D5]">
                  <img
                    src={item.heroImage}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 flex flex-col justify-between flex-grow">
                  <div>
                    <span className="text-[10px] font-bold text-[#E85D32] uppercase">{item.category}</span>
                    <h4 className="font-display text-xs sm:text-sm font-bold text-[#241A14] line-clamp-2 mt-1 group-hover:text-[#E85D32] transition-colors">
                      {item.title}
                    </h4>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#F0E8DC] flex items-center justify-between text-[11px] text-[#917562]">
                    <span>{item.readTime}</span>
                    <span className="font-bold text-[#E85D32] flex items-center gap-0.5">
                      Baca <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};
