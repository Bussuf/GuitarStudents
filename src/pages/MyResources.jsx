import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { BookOpen, FileText, Video, Music, Link2, Image } from 'lucide-react';
import CyberCard from '../components/ui/CyberCard';

const topicColors = {
  'אקורדים': 'from-blue-500 to-cyan-500',
  'שירים': 'from-purple-500 to-pink-500',
  'תרגילים': 'from-green-500 to-emerald-500',
  'תיאוריה': 'from-orange-500 to-red-500',
  'טכניקה': 'from-yellow-500 to-amber-500',
  'אחר': 'from-slate-500 to-gray-500',
};

const mediaIcons = {
  'PDF': FileText,
  'וידאו': Video,
  'אודיו': Music,
  'קישור': Link2,
  'תמונה': Image,
};

export default function MyResources() {
  const { data: resources = [], isLoading } = useQuery({
    queryKey: ['resources'],
    queryFn: () => base44.entities.Resource.list()
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-[#00F0FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const groupedResources = resources.reduce((acc, resource) => {
    const topic = resource.topic || 'אחר';
    if (!acc[topic]) acc[topic] = [];
    acc[topic].push(resource);
    return acc;
  }, {});

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00F0FF] to-[#BD00FF] flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">חומרי לימוד</h1>
            <p className="text-slate-400">כל החומרים שלי במקום אחד</p>
          </div>
        </div>
      </motion.div>

      {Object.entries(groupedResources).map(([topic, items], idx) => (
        <motion.div
          key={topic}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
        >
          <h2 className="text-2xl font-bold mb-4" style={{
            background: `linear-gradient(135deg, ${topicColors[topic] || topicColors['אחר']})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            {topic}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((resource) => {
              const Icon = mediaIcons[resource.media_type] || FileText;
              return (
                <CyberCard
                  key={resource.id}
                  className="p-5 cursor-pointer"
                  onClick={() => resource.file_url && window.open(resource.file_url, '_blank')}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${topicColors[topic] || topicColors['אחר']} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg mb-1 truncate">{resource.title}</h3>
                      <p className="text-xs text-slate-400 mb-2">{resource.media_type}</p>
                      {resource.description && (
                        <p className="text-sm text-slate-300 line-clamp-2">{resource.description}</p>
                      )}
                    </div>
                  </div>
                </CyberCard>
              );
            })}
          </div>
        </motion.div>
      ))}

      {resources.length === 0 && (
        <CyberCard className="p-8 text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-slate-400" />
          <p className="text-xl text-slate-300">אין חומרי לימוד זמינים כרגע</p>
        </CyberCard>
      )}
    </div>
  );
}