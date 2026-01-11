import React from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, User, AlertTriangle } from 'lucide-react';
import NeonButton from '../ui/NeonButton';

export default function StudentCard({ student, onClick, onWhatsApp, index }) {
  const contactPhone = student.contact_parent ? student.parent_phone : student.phone;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6 hover:border-[#00F0FF]/50 transition-all cursor-pointer group"
    >
      <div className="flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00F0FF] to-[#BD00FF] p-1 mb-4 group-hover:scale-105 transition-transform">
          <div className="w-full h-full rounded-full bg-[#1E293B] overflow-hidden flex items-center justify-center">
            {student.photo_url ? (
              <img src={student.photo_url} alt={student.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-slate-400" />
            )}
          </div>
        </div>

        {/* Name */}
        <h3 className="text-lg font-bold mb-1">{student.name}</h3>
        
        {/* Phone */}
        <a 
          href={`tel:${student.phone}`}
          onClick={(e) => e.stopPropagation()}
          className="text-sm text-[#00F0FF] hover:underline mb-3"
        >
          {student.phone}
        </a>

        {/* Balance */}
        <div className={`
          flex items-center gap-2 px-3 py-1 rounded-full text-sm mb-4
          ${student.balance <= 1 
            ? 'bg-yellow-500/20 text-yellow-400' 
            : 'bg-emerald-500/20 text-emerald-400'}
        `}>
          {student.balance <= 1 && <AlertTriangle size={14} />}
          יתרה: {student.balance} שיעורים
        </div>

        {student.contact_parent && (
          <p className="text-xs text-[#BD00FF] mb-3">
            📞 ליצור קשר עם: {student.parent_name}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2 w-full">
          <NeonButton 
            variant="phone" 
            size="sm" 
            className="flex-1"
            onClick={(e) => { e.stopPropagation(); window.open(`tel:${contactPhone}`, '_self'); }}
          >
            <Phone size={16} />
          </NeonButton>
          <NeonButton 
            variant="whatsapp" 
            size="sm" 
            className="flex-1"
            onClick={(e) => { e.stopPropagation(); onWhatsApp(student); }}
          >
            <MessageCircle size={16} />
          </NeonButton>
        </div>
      </div>
    </motion.div>
  );
}