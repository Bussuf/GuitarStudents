import React from 'react';
import { motion } from 'framer-motion';

export default function CyberCard({ children, className = '', onClick, glowOnHover = true }) {
  return (
    <motion.div
      whileHover={glowOnHover ? { scale: 1.01 } : {}}
      transition={{ type: "spring", stiffness: 300 }}
      onClick={onClick}
      className={`
        bg-[#1E293B] border border-[#334155] rounded-2xl
        transition-all duration-300
        ${glowOnHover ? 'hover:border-[#00F0FF] hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}