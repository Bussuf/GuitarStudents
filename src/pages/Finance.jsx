import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Plus, Wallet, TrendingUp, CreditCard, Banknote } from 'lucide-react';
import moment from 'moment';
import 'moment/locale/he';

import FullScreenModal from '../components/ui/FullScreenModal';
import NeonButton from '../components/ui/NeonButton';
import DataTable from '../components/ui/DataTable';
import CyberCard from '../components/ui/CyberCard';
import FinanceForm from '../components/finance/FinanceForm';

moment.locale('he');

export default function Finance() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFinance, setEditingFinance] = useState(null);
  const [groupBy, setGroupBy] = useState('month'); // 'month' or 'method'

  // Get student from URL
  const urlParams = new URLSearchParams(window.location.search);
  const preSelectedStudent = urlParams.get('student');

  useEffect(() => {
    if (preSelectedStudent) {
      setModalOpen(true);
    }
  }, [preSelectedStudent]);

  const { data: finances = [], isLoading } = useQuery({
    queryKey: ['finances'],
    queryFn: () => base44.entities.Finance.list('-date')
  });

  const { data: students = [] } = useQuery({
    queryKey: ['students'],
    queryFn: () => base44.entities.Student.list()
  });

  const { data: settingsData = [] } = useQuery({
    queryKey: ['settings'],
    queryFn: () => base44.entities.Settings.list()
  });

  const settings = settingsData[0] || {};

  const createMutation = useMutation({
    mutationFn: async (data) => {
      // Create finance record
      await base44.entities.Finance.create(data);
      
      // Update student balance
      const student = students.find(s => s.id === data.student_id);
      if (student) {
        await base44.entities.Student.update(student.id, {
          balance: (student.balance || 0) + data.lessons_count
        });
        queryClient.invalidateQueries({ queryKey: ['students'] });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finances'] });
      setModalOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Finance.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finances'] });
      setModalOpen(false);
      setEditingFinance(null);
    }
  });

  const handleSave = (data) => {
    if (editingFinance) {
      updateMutation.mutate({ id: editingFinance.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (finance) => {
    setEditingFinance(finance);
    setModalOpen(true);
  };

  // Calculate stats
  const currentMonth = moment().startOf('month');
  const monthlyTotal = finances
    .filter(f => moment(f.date).isSameOrAfter(currentMonth))
    .reduce((sum, f) => sum + (f.amount || 0), 0);

  const totalRevenue = finances.reduce((sum, f) => sum + (f.amount || 0), 0);

  // Group finances
  const groupedFinances = () => {
    if (groupBy === 'month') {
      const groups = {};
      finances.forEach(f => {
        const key = moment(f.date).format('MMMM YYYY');
        if (!groups[key]) groups[key] = { label: key, items: [], total: 0 };
        groups[key].items.push(f);
        groups[key].total += f.amount || 0;
      });
      return Object.values(groups);
    } else {
      const groups = {};
      finances.forEach(f => {
        const key = f.payment_method || 'אחר';
        if (!groups[key]) groups[key] = { label: key, items: [], total: 0 };
        groups[key].items.push(f);
        groups[key].total += f.amount || 0;
      });
      return Object.values(groups);
    }
  };

  const columns = [
    { 
      key: 'student_name', 
      label: 'תלמיד',
      render: (name, row) => name || students.find(s => s.id === row.student_id)?.name || 'לא ידוע'
    },
    { 
      key: 'date', 
      label: 'תאריך',
      render: (date) => moment(date).format('DD/MM/YYYY')
    },
    { key: 'package_type', label: 'סוג חבילה' },
    { 
      key: 'amount', 
      label: 'סכום',
      render: (amount) => (
        <span className="text-emerald-400 font-bold">₪{amount?.toLocaleString()}</span>
      )
    },
    { key: 'payment_method', label: 'אמצעי תשלום' }
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
          <h1 className="text-3xl font-bold">כספים וחבילות</h1>
          <p className="text-slate-400 mt-1">{finances.length} רשומות תשלום</p>
        </div>

        <NeonButton onClick={() => { setEditingFinance(null); setModalOpen(true); }}>
          <Plus size={20} />
          תשלום חדש
        </NeonButton>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <CyberCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">הכנסות החודש</p>
              <p className="text-2xl font-bold text-emerald-400">₪{monthlyTotal.toLocaleString()}</p>
            </div>
          </div>
        </CyberCard>

        <CyberCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00F0FF]/20 to-[#BD00FF]/20 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-[#00F0FF]" />
            </div>
            <div>
              <p className="text-sm text-slate-400">סה״כ הכנסות</p>
              <p className="text-2xl font-bold neon-text">₪{totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </CyberCard>

        <CyberCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">רשומות תשלום</p>
              <p className="text-2xl font-bold text-purple-400">{finances.length}</p>
            </div>
          </div>
        </CyberCard>
      </motion.div>

      {/* Group Toggle */}
      <div className="flex items-center gap-4">
        <span className="text-slate-400">קיבוץ לפי:</span>
        <div className="flex bg-[#1E293B] rounded-xl p-1">
          <button
            onClick={() => setGroupBy('month')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${groupBy === 'month' ? 'bg-[#00F0FF]/20 text-[#00F0FF]' : 'text-slate-400 hover:text-white'}`}
          >
            חודש
          </button>
          <button
            onClick={() => setGroupBy('method')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${groupBy === 'method' ? 'bg-[#00F0FF]/20 text-[#00F0FF]' : 'text-slate-400 hover:text-white'}`}
          >
            אמצעי תשלום
          </button>
        </div>
      </div>

      {/* Grouped List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        {groupedFinances().map((group, idx) => (
          <div key={idx}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                {groupBy === 'method' && <Banknote className="w-5 h-5 text-[#00F0FF]" />}
                {group.label}
              </h3>
              <span className="text-emerald-400 font-bold">₪{group.total.toLocaleString()}</span>
            </div>
            <DataTable
              columns={columns}
              data={group.items}
              onRowClick={handleEdit}
              emptyMessage="אין רשומות"
            />
          </div>
        ))}
      </motion.div>

      {/* Modal */}
      <FullScreenModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingFinance(null); }}
        title={editingFinance ? 'עריכת תשלום' : 'תשלום חדש'}
      >
        <FinanceForm
          finance={editingFinance}
          students={students}
          settings={settings}
          preSelectedStudent={preSelectedStudent}
          onSave={handleSave}
          onCancel={() => { setModalOpen(false); setEditingFinance(null); }}
        />
      </FullScreenModal>
    </div>
  );
}