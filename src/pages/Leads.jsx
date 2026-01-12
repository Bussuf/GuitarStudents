import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Plus, LayoutGrid, Table2, Phone, MessageCircle, UserPlus, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';

import FullScreenModal from '../components/ui/FullScreenModal';
import NeonButton from '../components/ui/NeonButton';
import DataTable from '../components/ui/DataTable';
import StatusBadge from '../components/ui/StatusBadge';
import LeadForm from '../components/leads/LeadForm';
import LeadKanban from '../components/leads/LeadKanban';
import MarketingAdvisor from '../components/leads/MarketingAdvisor';

export default function Leads() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState('kanban');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: () => base44.entities.Lead.list('-created_date')
  });

  const { data: settingsData = [] } = useQuery({
    queryKey: ['settings'],
    queryFn: () => base44.entities.Settings.list()
  });

  const settings = settingsData[0] || {};

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Lead.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      setModalOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Lead.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      setModalOpen(false);
      setEditingLead(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Lead.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    }
  });

  const handleSave = async (data) => {
    try {
      if (editingLead) {
        updateMutation.mutate({ id: editingLead.id, data });
      } else {
        await createMutation.mutateAsync(data);
        
        // Send webhook for new lead
        fetch('https://hook.eu1.make.com/45o0jplqjoohlbtkaoxndkvk4ko2lg7p', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      }
    } catch (error) {
      console.error('Error saving lead:', error);
    }
  };

  const handleEdit = (lead) => {
    setEditingLead(lead);
    setModalOpen(true);
  };

  const handleStatusChange = (lead, newStatus) => {
    updateMutation.mutate({ id: lead.id, data: { ...lead, status: newStatus } });
  };

  const handleConvertToStudent = async (lead) => {
    await base44.entities.Student.create({
      name: lead.full_name,
      phone: lead.phone,
      balance: 0
    });
    await updateMutation.mutateAsync({ id: lead.id, data: { ...lead, status: 'נרשם' } });
    navigate(createPageUrl('Students'));
  };

  const handleWhatsApp = (lead) => {
    const template = settings.whatsapp_lead_template || 'היי {name}! תודה על הפנייה 🎸';
    const message = encodeURIComponent(template.replace('{name}', lead.full_name));
    window.open(`https://wa.me/972${lead.phone?.replace(/^0/, '')}?text=${message}`, '_blank');
  };

  const columns = [
    { key: 'full_name', label: 'שם מלא', sortable: true },
    { 
      key: 'phone', 
      label: 'טלפון',
      render: (phone) => (
        <a href={`tel:${phone}`} className="text-[#00F0FF] hover:underline">
          {phone}
        </a>
      )
    },
    { 
      key: 'status', 
      label: 'סטטוס', 
      sortable: true,
      render: (status) => <StatusBadge status={status} />
    },
    { key: 'source', label: 'מקור' },
    { key: 'notes', label: 'הערות', render: (notes) => (
      <span className="line-clamp-1 max-w-[200px]">{notes}</span>
    )}
  ];

  const tableActions = (lead) => (
    <div className="flex gap-2">
      <button
        onClick={(e) => { e.stopPropagation(); window.open(`tel:${lead.phone}`, '_self'); }}
        className="p-2 hover:bg-[#334155] rounded-lg transition-colors text-blue-400"
      >
        <Phone size={16} />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); handleWhatsApp(lead); }}
        className="p-2 hover:bg-[#334155] rounded-lg transition-colors text-[#25D366]"
      >
        <MessageCircle size={16} />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); handleEdit(lead); }}
        className="p-2 hover:bg-[#334155] rounded-lg transition-colors text-slate-400 hover:text-white"
      >
        <Edit2 size={16} />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (confirm('האם למחוק את הליד?')) {
            deleteMutation.mutate(lead.id);
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
          <h1 className="text-3xl font-bold">ניהול לידים</h1>
          <p className="text-slate-400 mt-1">{leads.length} לידים במערכת</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-[#1E293B] rounded-xl p-1">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'kanban' ? 'bg-[#00F0FF]/20 text-[#00F0FF]' : 'text-slate-400 hover:text-white'}`}
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

          <NeonButton onClick={() => { setEditingLead(null); setModalOpen(true); }}>
            <Plus size={20} />
            ליד חדש
          </NeonButton>
        </div>
      </motion.div>

      {/* Marketing Advisor */}
      <MarketingAdvisor leads={leads} />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {viewMode === 'kanban' ? (
          <LeadKanban
            leads={leads}
            onStatusChange={handleStatusChange}
            onEdit={handleEdit}
            onConvertToStudent={handleConvertToStudent}
            onWhatsApp={handleWhatsApp}
            settings={settings}
          />
        ) : (
          <DataTable
            columns={columns}
            data={leads}
            onRowClick={handleEdit}
            actions={tableActions}
            emptyMessage="אין לידים עדיין"
          />
        )}
      </motion.div>

      {/* Modal */}
      <FullScreenModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingLead(null); }}
        title={editingLead ? 'עריכת ליד' : 'ליד חדש'}
      >
        <LeadForm
          lead={editingLead}
          onSave={handleSave}
          onCancel={() => { setModalOpen(false); setEditingLead(null); }}
        />
      </FullScreenModal>
    </div>
  );
}