import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Plus, Calendar, Table2, RefreshCw } from 'lucide-react';
import moment from 'moment';
import 'moment/locale/he';

import FullScreenModal from '../components/ui/FullScreenModal';
import NeonButton from '../components/ui/NeonButton';
import DataTable from '../components/ui/DataTable';
import StatusBadge from '../components/ui/StatusBadge';
import LessonForm from '../components/lessons/LessonForm';
import LessonCalendar from '../components/lessons/LessonCalendar';

moment.locale('he');

export default function Lessons() {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState('calendar');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const { data: lessons = [], isLoading } = useQuery({
    queryKey: ['lessons'],
    queryFn: () => base44.entities.Lesson.list('-date_time')
  });

  const { data: students = [] } = useQuery({
    queryKey: ['students'],
    queryFn: () => base44.entities.Student.list()
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Lesson.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      setModalOpen(false);
      setSelectedDate(null);
    }
  });

  const refreshLessonsMutation = useMutation({
    mutationFn: async () => {
      const activeStudents = students.filter(s => 
        s.is_active && 
        s.balance > 0 && 
        s.recurring_schedule && 
        s.recurring_schedule.length > 0
      );

      const newLessons = [];
      const weeksAhead = 4;
      const today = moment().startOf('day');

      for (const student of activeStudents) {
        let lessonsCreated = 0;
        const maxLessons = student.balance;

        for (let week = 0; week < weeksAhead; week++) {
          if (lessonsCreated >= maxLessons) break;

          for (const slot of student.recurring_schedule) {
            if (lessonsCreated >= maxLessons) break;

            const targetDate = today.clone().add(week, 'weeks').day(slot.day);
            const [hours, minutes] = slot.time.split(':');
            targetDate.hours(parseInt(hours)).minutes(parseInt(minutes)).seconds(0);

            if (targetDate.isAfter(moment())) {
              const exists = lessons.some(l => 
                l.student_id === student.id && 
                moment(l.date_time).isSame(targetDate, 'minute')
              );

              if (!exists) {
                newLessons.push({
                  student_id: student.id,
                  student_name: student.name,
                  date_time: targetDate.toISOString(),
                  status: 'עתידי'
                });
                lessonsCreated++;
              }
            }
          }
        }
      }

      if (newLessons.length > 0) {
        await base44.entities.Lesson.bulkCreate(newLessons);
      }

      return newLessons.length;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      alert(`נוצרו ${count} שיעורים חדשים`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data, previousStatus }) => {
      // Update lesson
      await base44.entities.Lesson.update(id, data);
      
      // Handle balance logic
      if (data.status === 'בוצע' && previousStatus !== 'בוצע') {
        // Decrease balance when marking as completed
        const student = students.find(s => s.id === data.student_id);
        if (student) {
          await base44.entities.Student.update(student.id, {
            balance: Math.max(0, (student.balance || 0) - 1)
          });
          queryClient.invalidateQueries({ queryKey: ['students'] });
        }
      } else if (previousStatus === 'בוצע' && data.status !== 'בוצע') {
        // Restore balance if changing from completed to something else
        const student = students.find(s => s.id === data.student_id);
        if (student) {
          await base44.entities.Student.update(student.id, {
            balance: (student.balance || 0) + 1
          });
          queryClient.invalidateQueries({ queryKey: ['students'] });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      setModalOpen(false);
      setEditingLesson(null);
    }
  });

  const handleSave = (data) => {
    if (editingLesson) {
      updateMutation.mutate({ 
        id: editingLesson.id, 
        data,
        previousStatus: editingLesson.status
      });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (lesson) => {
    setEditingLesson(lesson);
    setModalOpen(true);
  };

  const handleAddLesson = (date) => {
    setSelectedDate(date);
    setEditingLesson(null);
    setModalOpen(true);
  };

  const columns = [
    { 
      key: 'student_name', 
      label: 'תלמיד', 
      sortable: true,
      render: (name, row) => name || students.find(s => s.id === row.student_id)?.name || 'לא ידוע'
    },
    { 
      key: 'date_time', 
      label: 'מועד', 
      sortable: true,
      render: (dt) => moment(dt).format('DD/MM/YYYY HH:mm')
    },
    { 
      key: 'status', 
      label: 'סטטוס',
      render: (status) => <StatusBadge status={status} />
    },
    { 
      key: 'summary', 
      label: 'סיכום',
      render: (summary) => (
        <span className="line-clamp-1 max-w-[200px]">{summary || '-'}</span>
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-[#00F0FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold">יומן שיעורים</h1>
          <p className="text-slate-400 mt-1">{lessons.length} שיעורים במערכת</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-[#1E293B] rounded-xl p-1">
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'calendar' ? 'bg-[#00F0FF]/20 text-[#00F0FF]' : 'text-slate-400 hover:text-white'}`}
            >
              <Calendar size={20} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-[#00F0FF]/20 text-[#00F0FF]' : 'text-slate-400 hover:text-white'}`}
            >
              <Table2 size={20} />
            </button>
          </div>

          <NeonButton 
            onClick={() => refreshLessonsMutation.mutate()} 
            variant="secondary"
            disabled={refreshLessonsMutation.isPending}
          >
            <RefreshCw size={20} className={refreshLessonsMutation.isPending ? 'animate-spin' : ''} />
            רענן שיעורים
          </NeonButton>

          <NeonButton onClick={() => { setEditingLesson(null); setSelectedDate(null); setModalOpen(true); }}>
            <Plus size={20} />
            שיעור חדש
          </NeonButton>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {viewMode === 'calendar' ? (
          <LessonCalendar
            lessons={lessons}
            onLessonClick={handleEdit}
            onAddLesson={handleAddLesson}
          />
        ) : (
          <DataTable
            columns={columns}
            data={lessons}
            onRowClick={handleEdit}
            emptyMessage="אין שיעורים עדיין"
          />
        )}
      </motion.div>

      {/* Modal */}
      <FullScreenModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingLesson(null); setSelectedDate(null); }}
        title={editingLesson ? 'עריכת שיעור' : 'שיעור חדש'}
      >
        <LessonForm
          lesson={editingLesson || (selectedDate ? { date_time: selectedDate.toISOString() } : null)}
          students={students}
          onSave={handleSave}
          onCancel={() => { setModalOpen(false); setEditingLesson(null); setSelectedDate(null); }}
        />
      </FullScreenModal>
    </div>
  );
}