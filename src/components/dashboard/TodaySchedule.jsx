import React from 'react';
import { MessageCircle } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';
import NeonButton from '../ui/NeonButton';
import moment from 'moment';
import 'moment/locale/he';

export default function TodaySchedule({ lessons, students, settings }) {
  const getStudentName = (studentId) => {
    const student = students.find(s => s.id === studentId);
    return student?.name || 'לא ידוע';
  };

  const handleWhatsApp = (lesson) => {
    const student = students.find(s => s.id === lesson.student_id);
    if (!student) return;

    const contactPhone = student.contact_parent ? student.parent_phone : student.phone;
    const contactName = student.contact_parent ? student.parent_name : student.name;
    
    const template = student.contact_parent 
      ? (settings?.whatsapp_parent_template || 'היי {parent}, היום ב{time} שיעור ל{name}. 🎵 יתרת שיעורים: {balance}')
      : (settings?.whatsapp_student_template || 'היי {name}! תזכורת לשיעור שלנו היום ב{time} 🎸');
    
    const lessonTime = moment(lesson.date_time).format('HH:mm');
    
    const message = encodeURIComponent(
      template
        .replace(/{name}/g, student.name)
        .replace(/{parent}/g, contactName)
        .replace(/{time}/g, lessonTime)
        .replace(/{balance}/g, student.balance || 0)
    );
    window.open(`https://wa.me/972${contactPhone?.replace(/^0/, '')}?text=${message}`, '_blank');
  };

  return (
    <div>
      {lessons.length === 0 ? (
        <p className="text-slate-400 text-center py-8">אין שיעורים להיום</p>
      ) : (
        <div className="space-y-3">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="flex items-center gap-4 p-4 rounded-xl bg-[#0F172A] border border-[#334155] hover:border-[#00F0FF]/50 transition-colors"
            >
              <div className="text-center min-w-[60px]">
                <p className="text-2xl font-bold text-[#00F0FF]">
                  {moment(lesson.date_time).format('HH:mm')}
                </p>
              </div>
              <div className="flex-1">
                <p className="font-medium">{lesson.student_name || getStudentName(lesson.student_id)}</p>
              </div>
              <StatusBadge status={lesson.status} />
              <NeonButton
                variant="whatsapp"
                size="sm"
                onClick={() => handleWhatsApp(lesson)}
              >
                <MessageCircle size={16} />
              </NeonButton>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}