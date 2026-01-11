import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, Users, TrendingUp, AlertCircle, Clock } from 'lucide-react';
import moment from 'moment';
import 'moment/locale/he';

import NextLessonCard from '../components/dashboard/NextLessonCard';
import TodaySchedule from '../components/dashboard/TodaySchedule';
import LowBalanceCard from '../components/dashboard/LowBalanceCard';
import MonthlyStats from '../components/dashboard/MonthlyStats';
import CyberCard from '../components/ui/CyberCard';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

      {/* Main Content */}
      <Accordion type="multiple" defaultValue={["next-lesson", "today-schedule", "low-balance", "monthly-stats"]} className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <AccordionItem value="next-lesson" className="border-0">
            <CyberCard>
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center gap-3 w-full">
                  <Clock className="w-5 h-5 text-[#00F0FF]" />
                  <h2 className="text-xl font-bold">השיעור הבא</h2>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <NextLessonCard 
                  lesson={nextLesson} 
                  student={nextLessonStudent}
                  settings={settings}
                />
              </AccordionContent>
            </CyberCard>
          </AccordionItem>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <AccordionItem value="today-schedule" className="border-0">
            <CyberCard>
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center gap-3 w-full">
                  <Calendar className="w-5 h-5 text-[#00F0FF]" />
                  <h2 className="text-xl font-bold">לוח זמנים היום</h2>
                  <span className="mr-auto text-sm text-slate-400">{todayLessons.length} שיעורים</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <TodaySchedule lessons={todayLessons} students={students} />
              </AccordionContent>
            </CyberCard>
          </AccordionItem>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <AccordionItem value="low-balance" className="border-0">
            <CyberCard>
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center gap-3 w-full">
                  <AlertCircle className="w-5 h-5 text-[#00F0FF]" />
                  <h2 className="text-xl font-bold">תלמידים לחידוש</h2>
                  <span className="mr-auto bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-sm">
                    {students.filter(s => s.balance <= 1).length}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <LowBalanceCard students={students} />
              </AccordionContent>
            </CyberCard>
          </AccordionItem>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <AccordionItem value="monthly-stats" className="border-0">
            <CyberCard>
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center gap-3 w-full">
                  <TrendingUp className="w-5 h-5 text-[#00F0FF]" />
                  <h2 className="text-xl font-bold">סטטיסטיקות החודש</h2>
                  <span className="mr-auto text-sm text-slate-400">{moment().format('MMMM YYYY')}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <MonthlyStats 
                  finances={finances} 
                  lessons={lessons} 
                  students={students}
                />
              </AccordionContent>
            </CyberCard>
          </AccordionItem>
        </motion.div>
      </Accordion>
    </div>
  );
}