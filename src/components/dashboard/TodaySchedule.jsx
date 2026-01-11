import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';
import moment from 'moment';

export default function TodaySchedule({ lessons, students }) {
  const getStudentName = (studentId) => {
    const student = students.find(s => s.id === studentId);
    return student?.name || 'לא ידוע';
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-5 h-5 text-[#00F0FF]" />
        <h2 className="text-xl font-bold">לוח זמנים היום</h2>
        <span className="mr-auto text-sm text-slate-400">{lessons.length} שיעורים</span>
      </div>

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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}