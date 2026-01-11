import React from 'react';
import { motion } from 'framer-motion';

export default function NeonButton({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  className = '',
  disabled = false,
  type = 'button'
}) {
  const variants = {
    primary: 'bg-gradient-to-r from-[#00F0FF] to-[#BD00FF] text-white hover:shadow-[0_0_30px_rgba(0,240,255,0.5)]',
    secondary: 'bg-transparent border border-[#00F0FF] text-[#00F0FF] hover:bg-[#00F0FF]/10',
    ghost: 'bg-transparent text-slate-400 hover:text-white hover:bg-[#334155]',
    danger: 'bg-red-500/20 border border-red-500 text-red-400 hover:bg-red-500/30',
    success: 'bg-emerald-500/20 border border-emerald-500 text-emerald-400 hover:bg-emerald-500/30',
    whatsapp: 'bg-[#25D366] text-white hover:bg-[#20BD5A] hover:shadow-[0_0_20px_rgba(37,211,102,0.4)]',
    phone: 'bg-blue-500/20 border border-blue-500 text-blue-400 hover:bg-blue-500/30',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        rounded-xl font-medium transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
}