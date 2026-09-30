import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Instagram, Youtube, Sparkles, UtensilsCrossed, BookOpen, Compass, ExternalLink } from 'lucide-react';
import { CREATOR_STATS } from '../data/products';

export const CreatorSection: React.FC = () => {
  return (
    <section id="creator" className="py-16 sm:py-24 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8">
      <div className="relative bg-[#241A14] text-[#FFFDF8] rounded-[36px] sm:rounded-[48px] overflow-hidden p-8 sm:p-12 md:p-16 shadow-2xl">
        {/* Subtle background decorative shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E85D32]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#D9C7AE]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Creator Photo / Visual Card (5 Cols) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm sm:max-w-md aspect-[4/5] rounded-[32px] overflow-hidden border-2 border-[#D9C7AE]/30 shadow-2xl group">
              <img
                src={CREATOR_STATS.avatar}
                alt={CREATOR_STATS.name}
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#191614]/90 via-[#191614]/20 to-transparent" />
              
              {/* Overlay Badge */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E85D32] text-white text-xs font-bold uppercase tracking-wider mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>100% UNBIASED REVIEWS</span>
                </div>
                <h3 className="font-display font-extrabold text-2xl text-white">
                  {CREATOR_STATS.name}
                </h3>
                <a
                  href={CREATOR_STATS.socials.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-[#D9C7AE] hover:text-[#E85D32] font-medium transition-colors inline-block"
                >
                  {CREATOR_STATS.handle} • Food Explorer
                </a>
              </div>
            </div>
          </div>

          {/* Creator Copy & Stats (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#D9C7AE] text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5 text-[#E85D32]" />
                <span>Behind Kawan Lokal</span>
              </div>

              <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
                &ldquo;YES, I ACTUALLY TRIED IT.&rdquo;
              </h2>

              <p className="mt-3 text-lg sm:text-xl font-medium text-[#D9C7AE]">
                Karena sebelum kamu keluar uang, gue cobain dulu.
              </p>

              <p className="mt-5 text-base sm:text-lg text-[#FFFDF8]/80 leading-relaxed max-w-xl">
                {CREATOR_STATS.bio}
              </p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-4 pt-2 border-t border-white/15">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[#E85D32] mb-1">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
                <span className="font-display font-extrabold text-3xl sm:text-4xl text-white block">
                  {CREATOR_STATS.foodsTried}+
                </span>
                <span className="text-xs sm:text-sm text-[#D9C7AE] font-medium block">
                  Foods Tried
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[#E85D32] mb-1">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span className="font-display font-extrabold text-3xl sm:text-4xl text-white block">
                  {CREATOR_STATS.reviewsCount}+
                </span>
                <span className="text-xs sm:text-sm text-[#D9C7AE] font-medium block">
                  Honest Reviews
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[#E85D32] mb-1">
                  <Compass className="w-4 h-4" />
                </div>
                <span className="font-display font-extrabold text-3xl sm:text-4xl text-white block">
                  {CREATOR_STATS.citiesCount}
                </span>
                <span className="text-xs sm:text-sm text-[#D9C7AE] font-medium block">
                  Cities Visited
                </span>
              </div>
            </div>

            {/* Social Links & CTA */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href={CREATOR_STATS.socials.instagram}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 rounded-full bg-[#E85D32] hover:bg-[#d44e24] text-white font-bold text-sm tracking-wide transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] inline-flex items-center gap-2"
              >
                <span>FOLLOW MY FOOD JOURNEY</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <div className="flex items-center gap-2">
                <a
                  href={CREATOR_STATS.socials.instagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram Kawan Lokal"
                  className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
                >
                  <Instagram className="w-5 h-5" />
                </a>

                {/* TikTok custom icon / badge */}
                <a
                  href={CREATOR_STATS.socials.tiktok}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="TikTok Kawan Lokal"
                  className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10 flex items-center justify-center w-11 h-11"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.88-4.48V8.62a8.28 8.28 0 0 0 4.89 1.58V6.75a4.83 4.83 0 0 1-1-.06z"/>
                  </svg>
                </a>

                <a
                  href={CREATOR_STATS.socials.youtube}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube Kawan Lokal"
                  className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
