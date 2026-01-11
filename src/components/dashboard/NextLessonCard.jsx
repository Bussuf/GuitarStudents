import React from 'react';
import { Phone, MessageCircle, Clock, User } from 'lucide-react';
import CyberCard from '../ui/CyberCard';
import NeonButton from '../ui/NeonButton';
import moment from 'moment';

export default function NextLessonCard({ lesson, student, settings }) {
  if (!lesson || !student) {
    return (
      <CyberCard className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00F0FF]/20 to-[#BD00FF]/20 flex items-center justify-center">
            <Clock className="w-5 h-5 text-[#00F0FF]" />
          </div>
          <h3 className="text-lg font-bold">השיעור הבא</h3>
        </div>
        <p className="text-slate-400 text-center py-8">אין שיעורים מתוכננים</p>
      </CyberCard>
    );
  }

  const contactPhone = student.contact_parent ? student.parent_phone : student.phone;
  const contactName = student.contact_parent ? student.parent_name : student.name;

  const handleCall = () => {
    window.open(`tel:${contactPhone}`, '_self');
  };

  const handleWhatsApp = () => {
    const template = settings?.whatsapp_reminder || 'היי, תזכורת לשיעור שלנו!';
    const message = encodeURIComponent(template.replace('{name}', student.name));
    window.open(`https://wa.me/972${contactPhone?.replace(/^0/, '')}?text=${message}`, '_blank');
  };

  return (
    <CyberCard className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00F0FF]/20 to-[#BD00FF]/20 flex items-center justify-center">
          <Clock className="w-5 h-5 text-[#00F0FF]" />
        </div>
        <h3 className="text-lg font-bold">השיעור הבא</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00F0FF] to-[#BD00FF] flex items-center justify-center">
            {student.photo_url ? (
              <img src={student.photo_url} alt={student.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="w-6 h-6 text-white" />
            )}
          </div>
          <div>
            <p className="font-bold text-lg">{student.name}</p>
            <p className="text-[#00F0FF] text-sm">
              {moment(lesson.date_time).format('dddd, D/M')} בשעה {moment(lesson.date_time).format('HH:mm')}
            </p>
          </div>
        </div>

        {student.contact_parent && (
          <div className="bg-[#BD00FF]/10 border border-[#BD00FF]/30 rounded-lg px-3 py-2 text-sm text-[#BD00FF]">
            📞 ליצור קשר עם ההורה: {contactName}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <NeonButton variant="phone" onClick={handleCall} className="flex-1">
            <Phone size={18} />
            חייג
          </NeonButton>
          <NeonButton variant="whatsapp" onClick={handleWhatsApp} className="flex-1">
            <MessageCircle size={18} />
            וואטסאפ
          </NeonButton>
        </div>
      </div>
    </CyberCard>
  );
}