import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, Plus, MoreVertical, Trash2 } from 'lucide-react';
import moment from 'moment';
import 'moment/locale/he';
import StatusBadge from '../ui/StatusBadge';
import NeonButton from '../ui/NeonButton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

moment.locale('he');

export default function LessonCalendar({ lessons, onLessonClick, onAddLesson, onDeleteLesson }) {
  const [currentDate, setCurrentDate] = useState(moment());
  const [view, setView] = useState('week'); // 'week' or 'month'

  const goToPrev = () => {
    setCurrentDate(prev => prev.clone().subtract(1, view === 'week' ? 'week' : 'month'));
  };

  const goToNext = () => {
    setCurrentDate(prev => prev.clone().add(1, view === 'week' ? 'week' : 'month'));
  };

  const goToToday = () => {
    setCurrentDate(moment());
  };

  // Get days for current view (excluding Friday and Saturday)
  const getDays = () => {
    if (view === 'week') {
      const start = currentDate.clone().startOf('week');
      return Array.from({ length: 5 }, (_, i) => start.clone().add(i, 'days'));
    } else {
      const start = currentDate.clone().startOf('month').startOf('week');
      const end = currentDate.clone().endOf('month').endOf('week');
      const days = [];
      let day = start.clone();
      while (day.isSameOrBefore(end)) {
        if (day.day() !== 5 && day.day() !== 6) { // Skip Friday (5) and Saturday (6)
          days.push(day.clone());
        }
        day.add(1, 'day');
      }
      return days;
    }
  };

  const getLessonsForDay = (day) => {
    return lessons.filter(l => 
      moment(l.date_time).isSame(day, 'day')
    ).sort((a, b) => moment(a.date_time).diff(moment(b.date_time)));
  };

  const days = getDays();
  const isToday = (day) => day.isSame(moment(), 'day');
  const isCurrentMonth = (day) => day.isSame(currentDate, 'month');

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold">{currentDate.format('MMMM YYYY')}</h2>
          <div className="flex gap-1">
            <button
              onClick={() => setView('week')}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${view === 'week' ? 'bg-[#00F0FF]/20 text-[#00F0FF]' : 'text-slate-400 hover:text-white'}`}
            >
              שבוע
            </button>
            <button
              onClick={() => setView('month')}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${view === 'month' ? 'bg-[#00F0FF]/20 text-[#00F0FF]' : 'text-slate-400 hover:text-white'}`}
            >
              חודש
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <NeonButton variant="ghost" size="sm" onClick={goToPrev} className="flex-1 sm:flex-none">
            <ChevronRight size={20} />
          </NeonButton>
          <NeonButton variant="ghost" size="sm" onClick={goToToday} className="flex-1 sm:flex-none">
            היום
          </NeonButton>
          <NeonButton variant="ghost" size="sm" onClick={goToNext} className="flex-1 sm:flex-none">
            <ChevronLeft size={20} />
          </NeonButton>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-[#1E293B] rounded-2xl border border-[#334155] overflow-hidden">
        {/* Day Headers */}
        <div className={`grid ${view === 'week' ? 'grid-cols-5' : 'grid-cols-5'} border-b border-[#334155]`}>
          {['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי'].map((day, idx) => (
            <div key={idx} className="p-3 text-center text-sm text-slate-400 font-medium">
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className={`grid ${view === 'week' ? 'grid-cols-5 min-h-[400px]' : 'grid-cols-5'}`}>
          {days.map((day, idx) => {
            const dayLessons = getLessonsForDay(day);
            return (
              <div
                key={idx}
                className={`
                  border-b border-l border-[#334155] p-2 min-h-[100px]
                  ${isToday(day) ? 'bg-[#00F0FF]/5' : ''}
                  ${!isCurrentMonth(day) && view === 'month' ? 'opacity-40' : ''}
                `}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`
                    w-7 h-7 flex items-center justify-center rounded-full text-sm
                    ${isToday(day) ? 'bg-gradient-to-br from-[#00F0FF] to-[#BD00FF] text-white' : ''}
                  `}>
                    {day.format('D')}
                  </span>
                  <button
                    onClick={() => onAddLesson(day)}
                    className="opacity-0 hover:opacity-100 p-1 hover:bg-[#334155] rounded transition-all"
                  >
                    <Plus size={14} className="text-[#00F0FF]" />
                  </button>
                </div>

                <div className="space-y-1">
                  {dayLessons.slice(0, view === 'month' ? 3 : 10).map((lesson) => (
                    <motion.div
                      key={lesson.id}
                      whileHover={{ scale: 1.02 }}
                      className={`
                        p-2 rounded-lg text-xs cursor-pointer transition-colors relative group
                        ${lesson.status === 'בוצע' ? 'bg-emerald-500/20 border-emerald-500/50' : ''}
                        ${lesson.status === 'עתידי' ? 'bg-cyan-500/20 border-cyan-500/50' : ''}
                        ${lesson.status === 'בוטל' ? 'bg-red-500/20 border-red-500/50' : ''}
                        border
                      `}
                    >
                      <div onClick={() => onLessonClick(lesson)}>
                        <p className="font-medium truncate pr-6">{lesson.student_name}</p>
                        <p className="text-slate-400">{moment(lesson.date_time).format('HH:mm')}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="absolute top-1 left-1 p-1 opacity-0 group-hover:opacity-100 hover:bg-[#334155] rounded transition-all"
                          >
                            <MoreVertical size={12} className="text-slate-400" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm('האם למחוק את השיעור?')) {
                                onDeleteLesson(lesson.id);
                              }
                            }}
                            className="text-red-400 cursor-pointer"
                          >
                            <Trash2 size={14} className="ml-2" />
                            מחק שיעור
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </motion.div>
                  ))}
                  {dayLessons.length > (view === 'month' ? 3 : 10) && (
                    <p className="text-xs text-slate-400 text-center">
                      +{dayLessons.length - (view === 'month' ? 3 : 10)} נוספים
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}