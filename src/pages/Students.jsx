import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Plus, LayoutGrid, Table2, Phone, MessageCircle, AlertTriangle } from 'lucide-react';

import FullScreenModal from '../components/ui/FullScreenModal';
import NeonButton from '../components/ui/NeonButton';
import DataTable from '../components/ui/DataTable';
import StudentForm from '../components/students/StudentForm';
import StudentCard from '../components/students/StudentCard';

export default function Students() {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState('cards');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const { data: students = [], isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: () => base44.entities.Student.list('-created_date')
  });

  const { data: settingsData = [] } = useQuery({
    queryKey: ['settings'],
    queryFn: () => base44.entities.Settings.list()
  });

  const settings = settingsData[0] || {};

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

  const handleWhatsApp = (student) => {
    const contactPhone = student.contact_parent ? student.parent_phone : student.phone;
    const contactName = student.contact_parent ? student.parent_name : student.name;
    const message = encodeURIComponent(`שלום ${contactName}!`);
    window.open(`https://wa.me/972${contactPhone?.replace(/^0/, '')}?text=${message}`, '_blank');
  };

  const columns = [
    { key: 'name', label: 'שם תלמיד', sortable: true },
    { 
      key: 'phone', 
      label: 'טלפון',
      render: (phone) => (
        <a href={`tel:${phone}`} className="text-[#00F0FF] hover:underline">
          {phone}
        </a>
      )
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
          const phone = student.contact_parent ? student.parent_phone : student.phone;
          window.open(`tel:${phone}`, '_self'); 
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
          <p className="text-slate-400 mt-1">{students.length} תלמידים במערכת</p>
        </div>

        <div className="flex items-center gap-3">
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
                onClick={() => handleEdit(student)}
                onWhatsApp={handleWhatsApp}
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