import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Plus, BookOpen, FileText, Video, Music, Link as LinkIcon, Image, ExternalLink, Trash2 } from 'lucide-react';

import FullScreenModal from '../components/ui/FullScreenModal';
import NeonButton from '../components/ui/NeonButton';
import CyberCard from '../components/ui/CyberCard';
import ResourceForm from '../components/resources/ResourceForm';

const topicColors = {
  'אקורדים': 'from-blue-500 to-cyan-500',
  'שירים': 'from-purple-500 to-pink-500',
  'תרגילים': 'from-orange-500 to-yellow-500',
  'תיאוריה': 'from-emerald-500 to-green-500',
  'טכניקה': 'from-red-500 to-rose-500',
  'אחר': 'from-slate-500 to-slate-600',
};

const mediaIcons = {
  'PDF': FileText,
  'וידאו': Video,
  'אודיו': Music,
  'קישור': LinkIcon,
  'תמונה': Image,
};

export default function Resources() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState('all');

  const { data: resources = [], isLoading } = useQuery({
    queryKey: ['resources'],
    queryFn: () => base44.entities.Resource.list('-created_date')
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Resource.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      setModalOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Resource.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      setModalOpen(false);
      setEditingResource(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Resource.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    }
  });

  const handleSave = (data) => {
    if (editingResource) {
      updateMutation.mutate({ id: editingResource.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (resource) => {
    setEditingResource(resource);
    setModalOpen(true);
  };

  const handleDelete = (e, resource) => {
    e.stopPropagation();
    if (confirm('למחוק את החומר?')) {
      deleteMutation.mutate(resource.id);
    }
  };

  // Get unique topics
  const topics = [...new Set(resources.map(r => r.topic))];

  // Filter resources
  const filteredResources = selectedTopic === 'all' 
    ? resources 
    : resources.filter(r => r.topic === selectedTopic);

  // Group by topic
  const groupedResources = filteredResources.reduce((acc, resource) => {
    const topic = resource.topic || 'אחר';
    if (!acc[topic]) acc[topic] = [];
    acc[topic].push(resource);
    return acc;
  }, {});

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
          <h1 className="text-3xl font-bold">חומרי לימוד</h1>
          <p className="text-slate-400 mt-1">{resources.length} חומרים במערכת</p>
        </div>

        <NeonButton onClick={() => { setEditingResource(null); setModalOpen(true); }}>
          <Plus size={20} />
          חומר חדש
        </NeonButton>
      </motion.div>

      {/* Topic Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-2"
      >
        <button
          onClick={() => setSelectedTopic('all')}
          className={`px-4 py-2 rounded-xl text-sm transition-all ${
            selectedTopic === 'all' 
              ? 'bg-gradient-to-r from-[#00F0FF] to-[#BD00FF] text-white' 
              : 'bg-[#1E293B] text-slate-400 hover:text-white'
          }`}
        >
          הכל ({resources.length})
        </button>
        {topics.map(topic => (
          <button
            key={topic}
            onClick={() => setSelectedTopic(topic)}
            className={`px-4 py-2 rounded-xl text-sm transition-all ${
              selectedTopic === topic 
                ? `bg-gradient-to-r ${topicColors[topic] || topicColors['אחר']} text-white` 
                : 'bg-[#1E293B] text-slate-400 hover:text-white'
            }`}
          >
            {topic} ({resources.filter(r => r.topic === topic).length})
          </button>
        ))}
      </motion.div>

      {/* Resources Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-8"
      >
        {Object.entries(groupedResources).map(([topic, items]) => (
          <div key={topic}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${topicColors[topic] || topicColors['אחר']}`} />
              <h2 className="text-xl font-bold">{topic}</h2>
              <span className="text-slate-400 text-sm">({items.length})</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {items.map((resource, idx) => {
                const Icon = mediaIcons[resource.media_type] || FileText;
                return (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <CyberCard 
                      className="p-5 h-full group"
                      onClick={() => handleEdit(resource)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${topicColors[resource.topic] || topicColors['אחר']} flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {resource.file_url && (
                            <a
                              href={resource.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-2 hover:bg-[#334155] rounded-lg transition-colors text-[#00F0FF]"
                            >
                              <ExternalLink size={16} />
                            </a>
                          )}
                          <button
                            onClick={(e) => handleDelete(e, resource)}
                            className="p-2 hover:bg-[#334155] rounded-lg transition-colors text-red-400"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <h3 className="font-bold mb-2 line-clamp-2">{resource.title}</h3>
                      
                      {resource.description && (
                        <p className="text-sm text-slate-400 line-clamp-2 mb-3">
                          {resource.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#334155]">
                        <span className="text-xs text-slate-500">{resource.media_type}</span>
                        {resource.file_url && (
                          <a
                            href={resource.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs text-[#00F0FF] hover:underline"
                          >
                            פתח קובץ
                          </a>
                        )}
                      </div>
                    </CyberCard>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}

        {Object.keys(groupedResources).length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">אין חומרים עדיין</p>
            <NeonButton onClick={() => setModalOpen(true)} className="mt-4">
              <Plus size={20} />
              הוסף חומר ראשון
            </NeonButton>
          </div>
        )}
      </motion.div>

      {/* Modal */}
      <FullScreenModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingResource(null); }}
        title={editingResource ? 'עריכת חומר' : 'חומר חדש'}
      >
        <ResourceForm
          resource={editingResource}
          onSave={handleSave}
          onCancel={() => { setModalOpen(false); setEditingResource(null); }}
        />
      </FullScreenModal>
    </div>
  );
}