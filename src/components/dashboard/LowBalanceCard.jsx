import React from 'react';
import { AlertTriangle, User, MessageCircle } from 'lucide-react';
import NeonButton from '../ui/NeonButton';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';

export default function LowBalanceCard({ students, settings }) {
  const lowBalanceStudents = students.filter(s => s.balance <= 1 && s.is_active !== false);

  const handleWhatsApp = (student) => {
    const contactPhone = student.contact_parent ? student.parent_phone : student.phone;
    const contactName = student.contact_parent ? student.parent_name : student.name;
    
    let template = student.contact_parent 
      ? (settings?.whatsapp_parent_template || 'היי {parent}, היום ב{time} שיעור ל{name}. 🎵 יתרת שיעורים: {balance}')
      : (settings?.whatsapp_student_template || 'היי {name}! תזכורת לשיעור שלנו 🎸');
    
    const message = encodeURIComponent(
      template
        .replace('{name}', student.name)
        .replace('{parent}', student.parent_name || contactName)
        .replace('{time}', '')
        .replace('{balance}', student.balance || 0)
    );
    window.open(`https://wa.me/972${contactPhone?.replace(/^0/, '')}?text=${message}`, '_blank');
  };

  return (
    <div>
      {lowBalanceStudents.length === 0 ? (
        <p className="text-slate-400 text-center py-8">כל התלמידים מעודכנים 🎉</p>
      ) : (
        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {lowBalanceStudents.map((student) => (
            <div
              key={student.id}
              className="flex items-center gap-4 p-4 rounded-xl bg-[#0F172A] border border-[#334155] hover:border-yellow-500/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00F0FF] to-[#BD00FF] flex items-center justify-center">
                {student.photo_url ? (
                  <img src={student.photo_url} alt={student.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">{student.name}</p>
                <p className="text-sm text-yellow-400">יתרה: {student.balance} שיעורים</p>
              </div>
              <div className="flex gap-2">
                <NeonButton
                  variant="whatsapp"
                  size="sm"
                  onClick={() => handleWhatsApp(student)}
                >
                  <MessageCircle size={16} />
                </NeonButton>
                <Link to={`${createPageUrl('Finance')}?student=${student.id}`}>
                  <NeonButton variant="secondary" size="sm">
                    חידוש
                  </NeonButton>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}