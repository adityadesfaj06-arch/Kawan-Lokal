import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const ToastNotification: React.FC = () => {
  const { toastMessage } = useCart();

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed bottom-6 right-6 z-50 pointer-events-none"
        >
          <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-[#241A14] text-white text-xs sm:text-sm font-semibold shadow-2xl border border-[#D9C7AE]/30 backdrop-blur-md">
            <span className="w-5 h-5 rounded-full bg-[#E85D32] text-white flex items-center justify-center shrink-0">
              <Check className="w-3 h-3 stroke-[3]" />
            </span>
            <span>{toastMessage}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
