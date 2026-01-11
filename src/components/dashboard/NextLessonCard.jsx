import React from 'react';
import { Phone, MessageCircle, Clock, User } from 'lucide-react';
import NeonButton from '../ui/NeonButton';
import moment from 'moment';

export default function NextLessonCard({ lesson, student, settings }) {
  if (!lesson || !student) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Clock className="w-5 h-5 text-[#00F0FF]" />
          <h2 className="text-xl font-bold">השיעור הבא</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-slate-400">אין שיעורים מתוכננים</p>
        </div>
      </div>
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
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-5 h-5 text-[#00F0FF]" />
        <h2 className="text-xl font-bold">השיעור הבא</h2>
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
          <div className="flex-1">
            <p className="font-bold text-lg">{student.name}</p>
            <div className="flex items-center gap-3 text-sm">
              <p className="text-[#00F0FF]">
                {moment(lesson.date_time).format('dddd, D/M')} • {moment(lesson.date_time).format('HH:mm')}
              </p>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                student.balance <= 1 
                  ? 'bg-red-500/20 text-red-400' 
                  : student.balance <= 3 
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {student.balance} שיעורים
              </span>
            </div>
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
    </div>
  );
}