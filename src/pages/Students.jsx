import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Plus, LayoutGrid, Table2, Phone, MessageCircle, AlertTriangle, Edit2, Trash2 } from 'lucide-react';
import moment from 'moment';

import FullScreenModal from '../components/ui/FullScreenModal';
import NeonButton from '../components/ui/NeonButton';
import DataTable from '../components/ui/DataTable';
import StudentForm from '../components/students/StudentForm';
import StudentCard from '../components/students/StudentCard';
import InviteStudentButton from '../components/students/InviteStudentButton';

export default function Students() {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState('cards');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showArchived, setShowArchived] = useState(false);

  const { data: allStudents = [], isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: () => base44.entities.Student.list('-created_date')
  });

  const { data: lessons = [] } = useQuery({
    queryKey: ['lessons'],
    queryFn: () => base44.entities.Lesson.list()
  });

  const students = allStudents.filter(s => showArchived ? s.is_active === false : s.is_active !== false);

  const getUpcomingLessons = (studentId) => {
    return lessons
      .filter(l => l.student_id === studentId && moment(l.date_time).isAfter(moment()))
      .sort((a, b) => moment(a.date_time).diff(moment(b.date_time)));
  };

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Student.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setModalOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Student.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setModalOpen(false);
      setEditingStudent(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Student.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    }
  });

  const handleSave = (data) => {
    if (editingStudent) {
      updateMutation.mutate({ id: editingStudent.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setModalOpen(true);
  };

  const toggleArchive = async (student) => {
    const newStatus = !student.is_active;
    await base44.entities.Student.update(student.id, { is_active: newStatus });
    queryClient.invalidateQueries({ queryKey: ['students'] });
  };

  const handleWhatsApp = (student) => {
    const contactPhone = student.contact_parent ? student.parent_phone : student.phone;
    const contactName = student.contact_parent ? student.parent_name : student.name;
    const message = encodeURIComponent(`שלום ${contactName}!`);
    window.open(`https://wa.me/972${contactPhone?.replace(/^0/, '')}?text=${message}`, '_blank');
  };

  const handleCall = (student) => {
    const contactPhone = student.contact_parent ? student.parent_phone : student.phone;
    window.open(`tel:${contactPhone}`, '_self');
  };

  const columns = [
    { key: 'name', label: 'שם תלמיד', sortable: true },
    { 
      key: 'phone', 
      label: 'טלפון',
      render: (phone) => phone ? (
        <a href={`tel:${phone}`} className="text-[#00F0FF] hover:underline">
          {phone}
        </a>
      ) : '-'
    },
    { key: 'age', label: 'גיל' },
    { 
      key: 'balance', 
      label: 'יתרה',
      render: (balance) => (
        <span className={`flex items-center gap-1 ${balance <= 1 ? 'text-yellow-400' : 'text-emerald-400'}`}>
          {balance <= 1 && <AlertTriangle size={14} />}
          {balance}
        </span>
      )
    },
    {
      key: 'weekly_lessons',
      label: 'שיעורים/שבוע',
      render: (val) => val || 1
    },
    {
      key: 'contact_parent',
      label: 'קשר הורה',
      render: (val, row) => val ? (
        <span className="text-[#BD00FF] text-sm">{row.parent_name}</span>
      ) : '-'
    }
  ];

  const tableActions = (student) => (
    <div className="flex gap-2">
      <button
        onClick={(e) => { 
          e.stopPropagation(); 
          handleCall(student);
        }}
        className="p-2 hover:bg-[#334155] rounded-lg transition-colors text-blue-400"
      >
        <Phone size={16} />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); handleWhatsApp(student); }}
        className="p-2 hover:bg-[#334155] rounded-lg transition-colors text-[#25D366]"
      >
        <MessageCircle size={16} />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); handleEdit(student); }}
        className="p-2 hover:bg-[#334155] rounded-lg transition-colors text-slate-400 hover:text-white"
      >
        <Edit2 size={16} />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (confirm('האם למחוק את התלמיד?')) {
            deleteMutation.mutate(student.id);
          }
        }}
        className="p-2 hover:bg-[#334155] rounded-lg transition-colors text-red-400"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );

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
          <h1 className="text-3xl font-bold">תלמידים</h1>
          <p className="text-slate-400 mt-1">{students.length} תלמידים {showArchived ? 'בארכיון' : 'פעילים'}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-[#1E293B] rounded-xl p-1">
            <button
              onClick={() => setShowArchived(false)}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${!showArchived ? 'bg-[#00F0FF]/20 text-[#00F0FF]' : 'text-slate-400 hover:text-white'}`}
            >
              פעילים ({allStudents.filter(s => s.is_active !== false).length})
            </button>
            <button
              onClick={() => setShowArchived(true)}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${showArchived ? 'bg-[#00F0FF]/20 text-[#00F0FF]' : 'text-slate-400 hover:text-white'}`}
            >
              ארכיון ({allStudents.filter(s => s.is_active === false).length})
            </button>
          </div>

          <div className="flex bg-[#1E293B] rounded-xl p-1">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'cards' ? 'bg-[#00F0FF]/20 text-[#00F0FF]' : 'text-slate-400 hover:text-white'}`}
            >
              <LayoutGrid size={20} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-[#00F0FF]/20 text-[#00F0FF]' : 'text-slate-400 hover:text-white'}`}
            >
              <Table2 size={20} />
            </button>
          </div>

          <InviteStudentButton />
          <NeonButton onClick={() => { setEditingStudent(null); setModalOpen(true); }}>
            <Plus size={20} />
            תלמיד חדש
          </NeonButton>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {viewMode === 'cards' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {students.map((student, idx) => (
              <StudentCard
                key={student.id}
                student={student}
                index={idx}
                onEdit={handleEdit}
                onCall={handleCall}
                onWhatsApp={handleWhatsApp}
                upcomingLessons={getUpcomingLessons(student.id)}
                onToggleArchive={toggleArchive}
              />
            ))}
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={students}
            onRowClick={handleEdit}
            actions={tableActions}
            emptyMessage="אין תלמידים עדיין"
          />
        )}
      </motion.div>

      {/* Modal */}
      <FullScreenModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingStudent(null); }}
        title={editingStudent ? 'עריכת תלמיד' : 'תלמיד חדש'}
      >
        <StudentForm
          student={editingStudent}
          onSave={handleSave}
          onCancel={() => { setModalOpen(false); setEditingStudent(null); }}
        />
      </FullScreenModal>
    </div>
  );
}