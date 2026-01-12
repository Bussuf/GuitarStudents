import React from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, User, Calendar, Archive } from 'lucide-react';
import NeonButton from '../ui/NeonButton';
import CyberCard from '../ui/CyberCard';
import moment from 'moment';
import 'moment/locale/he';

const DAYS = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

export default function StudentCard({ student, onEdit, onCall, onWhatsApp, upcomingLessons, onToggleArchive, index }) {
  const nextLessons = upcomingLessons || [];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 300 }}
    >
      <CyberCard className={`p-6 cursor-pointer ${student.is_active === false ? 'opacity-60' : ''}`} onClick={() => onEdit(student)}>
        {/* Profile Section */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00F0FF] to-[#BD00FF] flex items-center justify-center overflow-hidden">
            {student.photo_url ? (
              <img src={student.photo_url} alt={student.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-white" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold">{student.name}</h3>
              {student.is_active === false && (
                <span className="text-xs bg-slate-600 px-2 py-0.5 rounded">ארכיון</span>
              )}
            </div>
            {student.age && (
              <p className="text-slate-400 text-sm">גיל: {student.age}</p>
            )}
            {student.city && (
              <p className="text-slate-500 text-xs">📍 {student.city}</p>
            )}
          </div>
        </div>

        {/* Balance and Recurring Schedule */}
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="p-3 bg-[#0F172A] rounded-xl border border-[#334155]">
            <p className="text-xs text-slate-400 mb-1">יתרה</p>
            <p className={`text-xl font-bold ${
              (student.balance || 0) === 0 ? 'text-red-400' : 
              (student.balance || 0) <= 2 ? 'text-yellow-400' : 
              'text-emerald-400'
            }`}>
              {student.balance || 0}
            </p>
          </div>
          
          {student.recurring_schedule && student.recurring_schedule.length > 0 && (
            <div className="p-3 bg-[#0F172A] rounded-xl border border-[#334155]">
              <p className="text-xs text-slate-400 mb-1">שעות קבועות</p>
              <div className="space-y-0.5">
                {student.recurring_schedule.map((slot, idx) => (
                  <p key={idx} className="text-xs text-slate-300">
                    {DAYS[slot.day]} {slot.time}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Upcoming Lessons */}
        {nextLessons.length > 0 && (
          <div className="mb-4 p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
            <p className="text-xs text-emerald-400 mb-2">שיעורים קרובים</p>
            <div className="space-y-1">
              {nextLessons.slice(0, 3).map((lesson, idx) => (
                <p key={idx} className="text-sm text-slate-300">
                  {moment(lesson.date_time).locale('he').format('dddd, DD/MM HH:mm')}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Parent Contact */}
        {student.contact_parent && student.parent_name && (
          <div className="mb-4 p-3 bg-[#BD00FF]/10 rounded-xl border border-[#BD00FF]/30">
            <p className="text-xs text-[#BD00FF]">📞 ליצור קשר: {student.parent_name}</p>
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-3 gap-2" onClick={(e) => e.stopPropagation()}>
          <NeonButton
            variant="phone"
            size="sm"
            onClick={() => onCall(student)}
          >
            <Phone size={16} />
          </NeonButton>
          <NeonButton
            variant="whatsapp"
            size="sm"
            onClick={() => onWhatsApp(student)}
          >
            <MessageCircle size={16} />
          </NeonButton>
          <NeonButton
            variant={student.is_active === false ? "success" : "ghost"}
            size="sm"
            onClick={() => onToggleArchive(student)}
          >
            <Archive size={16} />
          </NeonButton>
        </div>
      </CyberCard>
    </motion.div>
  );
}