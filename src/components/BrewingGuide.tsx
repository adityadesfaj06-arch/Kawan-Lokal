import React, { useState } from 'react';
import { Coffee, Flame, CheckCircle2, Droplets, Sparkles, GlassWater } from 'lucide-react';
import { Product } from '../types';

interface BrewingGuideProps {
  product: Product;
}

type PortionType = '1cup' | '2cups' | 'pitcher';

interface PortionConfig {
  label: string;
  sublabel: string;
  icon: string;
  powderMultiplier: number;
  waterAmount: number;
  milkAmount: number;
  iceAmount: number;
}

const PORTIONS: Record<PortionType, PortionConfig> = {
  '1cup': {
    label: '1 Cup (16 oz)',
    sublabel: 'Gelas Cafe Personal',
    icon: '🥤',
    powderMultiplier: 1,
    waterAmount: 50,
    milkAmount: 120,
    iceAmount: 150,
  },
  '2cups': {
    label: '2 Cup',
    sublabel: 'Santai Berdua',
    icon: '🧋',
    powderMultiplier: 2,
    waterAmount: 100,
    milkAmount: 240,
    iceAmount: 300,
  },
  pitcher: {
    label: '1 Liter Botol',
    sublabel: 'Stok Kulkas / Party',
    icon: '🍶',
    powderMultiplier: 5,
    waterAmount: 250,
    milkAmount: 600,
    iceAmount: 0,
  },
};

export const BrewingGuide: React.FC<BrewingGuideProps> = ({ product }) => {
  const [activePortion, setActivePortion] = useState<PortionType>('1cup');
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const config = PORTIONS[activePortion];
  const basePowderGram = 25; // standard single serving cafe powder
  const calculatedPowder = basePowderGram * config.powderMultiplier;

  const toggleStep = (idx: number) => {
    if (completedSteps.includes(idx)) {
      setCompletedSteps(completedSteps.filter((i) => i !== idx));
    } else {
      setCompletedSteps([...completedSteps, idx]);
    }
  };

  const steps = product.brewingInstructions || [
    'Larutkan bubuk minuman dengan air panas (80°C - 90°C), aduk cepat menggunakan sendok atau milk frother sampai benar-benar larut dan tidak ada gumpalan.',
    'Tambahkan susu cair UHT / fresh milk atau kental manis sesuai selera creamy yang kamu inginkan.',
    'Masukkan es batu kristal ke dalam gelas hingga penuh.',
    'Tuangkan larutan minuman ke atas es batu, aduk perlahan. Tambahkan topping favorit seperti boba atau cheese foam!',
  ];

  return (
    <div
      id="brewing-guide-section"
      className="p-6 sm:p-8 rounded-[32px] bg-[#FAF5ED] border border-[#CA9344]/40 shadow-[0_8px_30px_rgb(202,147,68,0.08)] space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E0D1BA]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CA9344]/20 text-[#54382B] text-xs font-bold uppercase tracking-wider mb-2">
            <Coffee className="w-3.5 h-3.5 text-[#885A1D]" />
            <span>PANDUAN SEDUH ALA CAFE</span>
          </div>
          <h3 className="font-display font-black text-xl sm:text-2xl text-[#241A14] tracking-tight">
            Kalkulator &amp; Resep Racikan Sempurna
          </h3>
          <p className="text-xs sm:text-sm text-[#6B5546] mt-1">
            Gunakan takaran presisi ini agar rasa minuman setara kafe kekinian, kental, dan aromatik.
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[11px] font-semibold text-[#885A1D] uppercase tracking-wide block">Kemasan</span>
          <span className="font-display font-extrabold text-lg text-[#241A14]">
            {product.powderWeight || '500g'} ({product.servingsPerPack || '20-25 Porsi'})
          </span>
        </div>
      </div>

      {/* Portion Switcher */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[#6B5546] block">
          PILIH PORSI YANG INGIN DIBUAT:
        </label>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {(Object.keys(PORTIONS) as PortionType[]).map((pKey) => {
            const p = PORTIONS[pKey];
            const isSelected = activePortion === pKey;
            return (
              <button
                key={pKey}
                onClick={() => setActivePortion(pKey)}
                className={`p-3 rounded-2xl border text-center transition-all duration-200 ${
                  isSelected
                    ? 'border-[#CA9344] bg-[#241A14] text-white shadow-md'
                    : 'border-[#E0D1BA] bg-[#FFFDF8] text-[#6B5546] hover:border-[#CA9344]'
                }`}
              >
                <span className="text-xl block mb-1">{p.icon}</span>
                <span className={`block font-bold text-xs sm:text-sm ${isSelected ? 'text-white' : 'text-[#241A14]'}`}>
                  {p.label}
                </span>
                <span className={`block text-[10px] sm:text-[11px] ${isSelected ? 'text-[#D9C7AE]' : 'text-[#8A7568]'}`}>
                  {p.sublabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Ingredient Math Table */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Powder */}
        <div className="p-4 rounded-2xl bg-white border border-[#E0D1BA] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#885A1D] font-bold">
            <span>Bubuk</span>
            <span>🧋</span>
          </div>
          <div className="mt-2">
            <span className="font-display font-black text-2xl text-[#241A14]">
              {calculatedPowder}g
            </span>
            <span className="text-[11px] text-[#6B5546] block font-medium">
              (~{(calculatedPowder / 15).toFixed(1)} sdm munjung)
            </span>
          </div>
        </div>

        {/* Hot Water */}
        <div className="p-4 rounded-2xl bg-white border border-[#E0D1BA] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#885A1D] font-bold">
            <span>Air Panas</span>
            <Droplets className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="mt-2">
            <span className="font-display font-black text-2xl text-[#241A14]">
              {config.waterAmount}ml
            </span>
            <span className="text-[11px] text-[#6B5546] block font-medium">
              Suhu 80° - 90°C
            </span>
          </div>
        </div>

        {/* Milk / Creamer */}
        <div className="p-4 rounded-2xl bg-white border border-[#E0D1BA] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#885A1D] font-bold">
            <span>Susu UHT</span>
            <GlassWater className="w-3.5 h-3.5 text-[#CA9344]" />
          </div>
          <div className="mt-2">
            <span className="font-display font-black text-2xl text-[#241A14]">
              {config.milkAmount}ml
            </span>
            <span className="text-[11px] text-[#6B5546] block font-medium">
              Fresh Milk / UHT Plain
            </span>
          </div>
        </div>

        {/* Ice Cubes */}
        <div className="p-4 rounded-2xl bg-white border border-[#E0D1BA] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#885A1D] font-bold">
            <span>Es Batu</span>
            <span>🧊</span>
          </div>
          <div className="mt-2">
            <span className="font-display font-black text-2xl text-[#241A14]">
              {config.iceAmount > 0 ? `${config.iceAmount}g` : 'Tanpa Es'}
            </span>
            <span className="text-[11px] text-[#6B5546] block font-medium">
              {config.iceAmount > 0 ? 'Es batu kristal' : 'Dinginkan di kulkas'}
            </span>
          </div>
        </div>
      </div>

      {/* Step by Step Interactive Checklist */}
      <div className="space-y-3 pt-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[#6B5546] flex items-center justify-between">
          <span>LANGKAH-LANGKAH PENYAJIAN:</span>
          <span className="text-[11px] font-medium text-[#885A1D]">Klik untuk menandai selesai</span>
        </label>
        <div className="space-y-2.5">
          {steps.map((step, idx) => {
            const isDone = completedSteps.includes(idx);
            return (
              <button
                key={idx}
                onClick={() => toggleStep(idx)}
                className={`w-full p-3.5 sm:p-4 rounded-2xl border text-left flex items-start gap-3 transition-all duration-200 ${
                  isDone
                    ? 'bg-[#EBF3E8] border-[#637848]/50 text-[#304B26]'
                    : 'bg-white border-[#E0D1BA] hover:border-[#CA9344] text-[#241A14]'
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-[#637848] fill-[#637848] text-white" />
                  ) : (
                    <span className="w-5 h-5 rounded-full border-2 border-[#CA9344] flex items-center justify-center text-[11px] font-bold text-[#54382B]">
                      {idx + 1}
                    </span>
                  )}
                </div>
                <p className={`text-xs sm:text-sm leading-relaxed ${isDone ? 'line-through opacity-80' : 'font-medium'}`}>
                  {step}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Best Served With Topping suggestions */}
      {product.bestServedWith && product.bestServedWith.length > 0 && (
        <div className="p-4 rounded-2xl bg-white border border-[#E0D1BA] space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#CA9344] uppercase tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Rekomendasi Topping Terbaik:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.bestServedWith.map((topping, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full bg-[#FAF5ED] border border-[#CA9344]/30 text-xs font-semibold text-[#54382B]"
              >
                {topping}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Barista Secret Tip Note */}
      <div className="p-4 rounded-2xl bg-[#54382B] text-[#FAF5ED] text-xs space-y-1">
        <span className="font-bold text-[#E2B774] flex items-center gap-1.5">
          <span>💡</span>
          <span>TIPS RAHASIA BARISTA KAWAN LOKAL</span>
        </span>
        <p className="text-white/85 leading-relaxed">
          Gunakan susu evaporasi atau 10-15ml kental manis untuk menghasilkan tekstur <em>mouthfeel</em> yang lebih tebal dan creamy mirip signature drink cafe bintang 5.
        </p>
      </div>
    </div>
  );
};
