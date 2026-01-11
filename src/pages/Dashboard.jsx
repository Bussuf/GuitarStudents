import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import moment from 'moment';
import 'moment/locale/he';

import NextLessonCard from '../components/dashboard/NextLessonCard';
import TodaySchedule from '../components/dashboard/TodaySchedule';
import LowBalanceCard from '../components/dashboard/LowBalanceCard';
import MonthlyStats from '../components/dashboard/MonthlyStats';
import CyberCard from '../components/ui/CyberCard';

moment.locale('he');

export default function Dashboard() {
  const { data: students = [] } = useQuery({
    queryKey: ['students'],
    queryFn: () => base44.entities.Student.list()
  });

  const { data: lessons = [] } = useQuery({
    queryKey: ['lessons'],
    queryFn: () => base44.entities.Lesson.list()
  });

  const { data: finances = [] } = useQuery({
    queryKey: ['finances'],
    queryFn: () => base44.entities.Finance.list()
  });

  const { data: settingsData = [] } = useQuery({
    queryKey: ['settings'],
    queryFn: () => base44.entities.Settings.list()
  });

  const settings = settingsData[0] || {};

  // Get next upcoming lesson
  const now = moment();
  const upcomingLessons = lessons
    .filter(l => l.status === 'עתידי' && moment(l.date_time).isAfter(now))
    .sort((a, b) => moment(a.date_time).diff(moment(b.date_time)));
  
  const nextLesson = upcomingLessons[0];
  const nextLessonStudent = nextLesson 
    ? students.find(s => s.id === nextLesson.student_id)
    : null;

  // Get today's lessons
  const todayStart = moment().startOf('day');
  const todayEnd = moment().endOf('day');
  const todayLessons = lessons
    .filter(l => moment(l.date_time).isBetween(todayStart, todayEnd))
    .sort((a, b) => moment(a.date_time).diff(moment(b.date_time)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">
            שלום, <span className="neon-text">{settings.teacher_name || 'מורה'}</span>
          </h1>
          <p className="text-slate-400 mt-1">{moment().format('dddd, D בMMMM YYYY')}</p>
        </div>
      </motion.div>

      {/* MOTD */}
      {settings.motd && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <CyberCard className="p-4 bg-gradient-to-r from-[#00F0FF]/10 to-[#BD00FF]/10 border-[#00F0FF]/30">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[#00F0FF]" />
              <p className="text-slate-300">{settings.motd}</p>
            </div>
          </CyberCard>
        </motion.div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <NextLessonCard 
            lesson={nextLesson} 
            student={nextLessonStudent}
            settings={settings}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <TodaySchedule lessons={todayLessons} students={students} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <LowBalanceCard students={students} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <MonthlyStats 
            finances={finances} 
            lessons={lessons} 
            students={students}
          />
        </motion.div>
      </div>
    </div>
  );
}