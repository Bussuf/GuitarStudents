import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FullScreenModal({ isOpen, onClose, title, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#1E293B] rounded-2xl neon-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 bg-[#1E293B] border-b border-[#334155] p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold neon-text">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-[#334155] transition-colors text-slate-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}