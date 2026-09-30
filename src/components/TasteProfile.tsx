import React from 'react';
import { motion } from 'motion/react';
import { TasteProfile as TasteProfileType } from '../types';

interface TasteProfileProps {
  profile: TasteProfileType;
}

interface TasteBarConfig {
  label: string;
  key: keyof TasteProfileType;
  color: string;
  icon: string;
}

const BARS: TasteBarConfig[] = [
  { label: 'Sweet (Manis)', key: 'sweet', color: '#E85D32', icon: '🍯' },
  { label: 'Creamy (Lumer / Lembut)', key: 'creamy', color: '#D9C7AE', icon: '🥛' },
  { label: 'Crunchy (Kerenyahan)', key: 'crunchy', color: '#6B5546', icon: '✨' },
  { label: 'Rich (Kedalaman Rasa)', key: 'rich', color: '#241A14', icon: '🍫' },
  { label: 'Spicy (Tingkat Pedas)', key: 'spicy', color: '#B94A35', icon: '🌶' },
];

export const TasteProfile: React.FC<TasteProfileProps> = ({ profile }) => {
  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#F8F5EF] border border-[#D9C7AE]/60 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#E85D32]">
            FLAVOR BREAKDOWN
          </span>
          <h3 className="font-display font-extrabold text-xl sm:text-2xl text-[#241A14]">
            TASTE PROFILE
          </h3>
        </div>
        <span className="text-xs text-[#6B5546] font-medium bg-[#FFFDF8] px-3 py-1.5 rounded-full border border-[#D9C7AE]/50">
          Uji Sensoris Reno
        </span>
      </div>

      <div className="space-y-4">
        {BARS.map((bar) => {
          const value = profile[bar.key];
          return (
            <div key={bar.key} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-[#241A14]">
                <span className="flex items-center gap-1.5">
                  <span>{bar.icon}</span>
                  <span>{bar.label}</span>
                </span>
                <span className="font-display font-bold text-[#6B5546]">{value}%</span>
              </div>

              {/* Progress Bar with Motion */}
              <div className="h-3 w-full bg-[#FFFDF8] rounded-full overflow-hidden border border-[#D9C7AE]/40 p-0.5">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${value}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                  className="h-full rounded-full"
                  style={{
                    backgroundColor: bar.key === 'spicy' && value === 0 ? '#D9C7AE' : bar.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-[#6B5546] leading-relaxed italic border-t border-[#D9C7AE]/40 pt-4">
        *Indeks rasa dievaluasi langsung oleh tim tester Kawan Lokal dengan skala 0–100%.
      </p>
    </div>
  );
};
