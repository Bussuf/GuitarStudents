import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import moment from 'moment';
import 'moment/locale/he';
import CyberCard from '../components/ui/CyberCard';

moment.locale('he');

export default function MyLessons() {
  const { data: user, isLoading: loadingUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me()
  });

  const { data: students = [] } = useQuery({
    queryKey: ['students'],
    queryFn: () => base44.entities.Student.list(),
    enabled: !!user
  });

  const { data: allLessons = [] } = useQuery({
    queryKey: ['lessons'],
    queryFn: () => base44.entities.Lesson.list(),
    enabled: !!user
  });

  if (loadingUser) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-[#00F0FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Find student record by email
  const myStudent = students.find(s => 
    s.phone === user?.email || s.parent_phone === user?.email
  );

  if (!myStudent) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00F0FF] to-[#BD00FF] flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold">השיעורים שלי</h1>
          </div>
        </motion.div>
        <CyberCard className="p-8 text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-slate-400" />
          <p className="text-xl text-slate-300">לא נמצא פרופיל תלמיד</p>
          <p className="text-slate-400 mt-2">צור קשר עם המורה שלך</p>
        </CyberCard>
      </div>
    );
  }

  // Filter lessons for this student
  const myLessons = allLessons
    .filter(l => l.student_id === myStudent.id)
    .sort((a, b) => moment(b.date_time).diff(moment(a.date_time)));

  const upcomingLessons = myLessons.filter(l => 
    l.status === 'עתידי' && moment(l.date_time).isAfter(moment())
  );

  const pastLessons = myLessons.filter(l => 
    l.status === 'בוצע' || moment(l.date_time).isBefore(moment())
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00F0FF] to-[#BD00FF] flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">שלום, {myStudent.name}</h1>
            <p className="text-slate-400">יתרת שיעורים: {myStudent.balance}</p>
          </div>
        </div>
      </motion.div>

      {/* Upcoming Lessons */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h2 className="text-2xl font-bold mb-4 neon-text">שיעורים קרובים</h2>
        {upcomingLessons.length === 0 ? (
          <CyberCard className="p-6 text-center">
            <p className="text-slate-400">אין שיעורים מתוכננים</p>
          </CyberCard>
        ) : (
          <div className="space-y-3">
            {upcomingLessons.map((lesson) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <CyberCard className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00F0FF] to-[#BD00FF] flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-lg">
                        {moment(lesson.date_time).format('dddd, D בMMMM')}
                      </p>
                      <p className="text-slate-400">
                        {moment(lesson.date_time).format('HH:mm')}
                      </p>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm">
                      {lesson.status}
                    </div>
                  </div>
                  {lesson.summary && (
                    <div className="mt-3 pt-3 border-t border-[#334155]">
                      <p className="text-sm text-slate-300">{lesson.summary}</p>
                    </div>
                  )}
                </CyberCard>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Past Lessons */}
      {pastLessons.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-2xl font-bold mb-4 text-slate-300">שיעורים קודמים</h2>
          <div className="space-y-3">
            {pastLessons.slice(0, 5).map((lesson) => (
              <CyberCard key={lesson.id} className="p-4 opacity-75">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold">{moment(lesson.date_time).format('D/M/YYYY')}</p>
                    <p className="text-sm text-slate-400">{moment(lesson.date_time).format('HH:mm')}</p>
                  </div>
                </div>
                {lesson.summary && (
                  <div className="mt-3 pt-3 border-t border-[#334155]">
                    <p className="text-sm text-slate-300">{lesson.summary}</p>
                  </div>
                )}
              </CyberCard>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}