import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Save, User, DollarSign, MessageCircle, Sparkles } from 'lucide-react';
import CyberCard from '../components/ui/CyberCard';
import NeonButton from '../components/ui/NeonButton';
import FormInput from '../components/ui/FormInput';

export default function Settings() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    teacher_name: '',
    default_lesson_price: '',
    whatsapp_new_lead: 'שלום {name}, ראיתי שהתעניינת בשיעורי גיטרה! אשמח לספר לך עוד 🎸',
    whatsapp_reminder: 'היי {name}, רציתי להזכיר לך שיש לנו שיעור מחר! 🎵',
    motd: ''
  });

  const { data: settingsData = [], isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: () => base44.entities.Settings.list()
  });

  useEffect(() => {
    if (settingsData[0]) {
      setFormData({
        teacher_name: settingsData[0].teacher_name || '',
        default_lesson_price: settingsData[0].default_lesson_price || '',
        whatsapp_new_lead: settingsData[0].whatsapp_new_lead || 'שלום {name}, ראיתי שהתעניינת בשיעורי גיטרה! אשמח לספר לך עוד 🎸',
        whatsapp_reminder: settingsData[0].whatsapp_reminder || 'היי {name}, רציתי להזכיר לך שיש לנו שיעור מחר! 🎵',
        motd: settingsData[0].motd || ''
      });
    }
  }, [settingsData]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (settingsData[0]) {
        return base44.entities.Settings.update(settingsData[0].id, data);
      } else {
        return base44.entities.Settings.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate({
      ...formData,
      default_lesson_price: Number(formData.default_lesson_price)
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-[#00F0FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00F0FF] to-[#BD00FF] flex items-center justify-center">
          <SettingsIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">הגדרות מערכת</h1>
          <p className="text-slate-400">התאם את המערכת לצרכים שלך</p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <CyberCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-5 h-5 text-[#00F0FF]" />
              <h2 className="text-xl font-bold">פרטים אישיים</h2>
            </div>
            <div className="grid gap-4">
              <FormInput
                label="שם המורה"
                name="teacher_name"
                value={formData.teacher_name}
                onChange={handleChange}
                placeholder="הכנס את שמך"
              />
            </div>
          </CyberCard>
        </motion.div>

        {/* Pricing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CyberCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="w-5 h-5 text-[#00F0FF]" />
              <h2 className="text-xl font-bold">מחירים</h2>
            </div>
            <FormInput
              label="מחיר שיעור רגיל (₪)"
              name="default_lesson_price"
              type="number"
              value={formData.default_lesson_price}
              onChange={handleChange}
              placeholder="150"
            />
          </CyberCard>
        </motion.div>

        {/* WhatsApp Templates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <CyberCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <MessageCircle className="w-5 h-5 text-[#25D366]" />
              <h2 className="text-xl font-bold">תבניות וואטסאפ</h2>
            </div>
            
            <div className="bg-[#0F172A] border border-[#334155] rounded-xl p-4 mb-4">
              <h3 className="text-sm font-bold text-[#00F0FF] mb-3">משתנים זמינים:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <code className="bg-[#1E293B] px-2 py-1 rounded text-[#00F0FF]">{'{name}'}</code>
                  <span>שם התלמיד/ליד</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-[#1E293B] px-2 py-1 rounded text-[#00F0FF]">{'{date}'}</code>
                  <span>תאריך השיעור</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-[#1E293B] px-2 py-1 rounded text-[#00F0FF]">{'{time}'}</code>
                  <span>שעת השיעור</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-[#1E293B] px-2 py-1 rounded text-[#00F0FF]">{'{lesson_number}'}</code>
                  <span>מספר שיעור נוכחי</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-[#1E293B] px-2 py-1 rounded text-[#00F0FF]">{'{total_lessons}'}</code>
                  <span>סה"כ שיעורים בחבילה</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-[#1E293B] px-2 py-1 rounded text-[#00F0FF]">{'{balance}'}</code>
                  <span>יתרת שיעורים</span>
                </div>
              </div>
              <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                <p className="text-xs text-emerald-400">
                  <strong>דוגמה:</strong> היי {'{name}'}, היום ב{'{time}'} שיעור גיטרה (מספר {'{lesson_number}'}/{'{total_lessons}'})
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <FormInput
                label="הודעת פתיחה לליד חדש"
                name="whatsapp_new_lead"
                type="textarea"
                value={formData.whatsapp_new_lead}
                onChange={handleChange}
                rows={3}
              />
              <FormInput
                label="הודעת תזכורת לשיעור"
                name="whatsapp_reminder"
                type="textarea"
                value={formData.whatsapp_reminder}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </CyberCard>
        </motion.div>

        {/* MOTD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <CyberCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-5 h-5 text-[#BD00FF]" />
              <h2 className="text-xl font-bold">הודעה אישית</h2>
            </div>
            <FormInput
              label="הודעה שתוצג בדשבורד"
              name="motd"
              type="textarea"
              value={formData.motd}
              onChange={handleChange}
              placeholder="כתוב הודעה מעוררת השראה..."
              rows={2}
            />
          </CyberCard>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <NeonButton type="submit" size="lg" className="w-full">
            <Save className="w-5 h-5" />
            {saveMutation.isPending ? 'שומר...' : 'שמור הגדרות'}
          </NeonButton>
        </motion.div>
      </form>
    </div>
  );
}