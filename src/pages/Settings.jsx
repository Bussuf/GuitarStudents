import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Save, User, DollarSign, MessageCircle, Sparkles, Upload, X, Plus, Image as ImageIcon } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CyberCard from '../components/ui/CyberCard';
import NeonButton from '../components/ui/NeonButton';
import FormInput from '../components/ui/FormInput';

export default function Settings() {
  const queryClient = useQueryClient();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [accordionState, setAccordionState] = useState(() => {
    const saved = localStorage.getItem('settings-accordion-state');
    return saved ? JSON.parse(saved) : ["personal", "whatsapp"];
  });

  useEffect(() => {
    localStorage.setItem('settings-accordion-state', JSON.stringify(accordionState));
  }, [accordionState]);

  const [formData, setFormData] = useState({
    teacher_name: '',
    default_lesson_price: '',
    price_image_url: '',
    whatsapp_templates: [
      { name: 'ליד חדש', message: 'שלום {name}, ראיתי שהתעניינת בשיעורי גיטרה! אשמח לספר לך עוד 🎸', attach_price_image: true },
      { name: 'תזכורת לשיעור', message: 'היי {name}, רציתי להזכיר לך שיש לנו שיעור מחר! 🎵', attach_price_image: false }
    ],
    motd: '',
    notify_before_lesson: false,
    notify_new_lead: false
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
        price_image_url: settingsData[0].price_image_url || '',
        whatsapp_templates: settingsData[0].whatsapp_templates || [
          { name: 'ליד חדש', message: 'שלום {name}, ראיתי שהתעניינת בשיעורי גיטרה! אשמח לספר לך עוד 🎸', attach_price_image: true },
          { name: 'תזכורת לשיעור', message: 'היי {name}, רציתי להזכיר לך שיש לנו שיעור מחר! 🎵', attach_price_image: false }
        ],
        motd: settingsData[0].motd || '',
        notify_before_lesson: settingsData[0].notify_before_lesson || false,
        notify_new_lead: settingsData[0].notify_new_lead || false
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

  const handleTemplateChange = (index, field, value) => {
    const updated = [...formData.whatsapp_templates];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, whatsapp_templates: updated }));
  };

  const addTemplate = () => {
    setFormData(prev => ({
      ...prev,
      whatsapp_templates: [...prev.whatsapp_templates, { name: '', message: '', attach_price_image: false }]
    }));
  };

  const removeTemplate = (index) => {
    setFormData(prev => ({
      ...prev,
      whatsapp_templates: prev.whatsapp_templates.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadingImage(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData(prev => ({ ...prev, price_image_url: file_url }));
    } catch (error) {
      alert('שגיאה בהעלאת התמונה');
    } finally {
      setUploadingImage(false);
    }
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

      <form onSubmit={handleSubmit}>
        <Accordion type="multiple" value={accordionState} onValueChange={setAccordionState} className="space-y-4">
          {/* Personal Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <AccordionItem value="personal" className="border-0">
              <CyberCard>
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-[#00F0FF]" />
                    <h2 className="text-xl font-bold">פרטים אישיים</h2>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="grid gap-4 pt-2">
                    <FormInput
                      label="שם המורה"
                      name="teacher_name"
                      value={formData.teacher_name}
                      onChange={handleChange}
                      placeholder="הכנס את שמך"
                    />
                    <FormInput
                      label="מחיר שיעור רגיל (₪)"
                      name="default_lesson_price"
                      type="number"
                      value={formData.default_lesson_price}
                      onChange={handleChange}
                      placeholder="150"
                    />
                  </div>
                </AccordionContent>
              </CyberCard>
            </AccordionItem>
          </motion.div>

          {/* Price Image */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <AccordionItem value="price-image" className="border-0">
              <CyberCard>
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <ImageIcon className="w-5 h-5 text-[#00F0FF]" />
                    <h2 className="text-xl font-bold">תמונת מחירון</h2>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="pt-2 space-y-4">
                    <p className="text-sm text-slate-400">העלה תמונה של כרטיסיית המחירים - תישלח ללידים חדשים</p>
                    
                    {formData.price_image_url ? (
                      <div className="relative inline-block">
                        <img 
                          src={formData.price_image_url} 
                          alt="מחירון" 
                          className="max-w-xs rounded-xl border border-[#334155]"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, price_image_url: '' }))}
                          className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-500 rounded-lg transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <label className="block">
                        <div className="border-2 border-dashed border-[#334155] rounded-xl p-8 text-center cursor-pointer hover:border-[#00F0FF] transition-colors">
                          {uploadingImage ? (
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-8 h-8 border-4 border-[#00F0FF] border-t-transparent rounded-full animate-spin" />
                              <span className="text-slate-400">מעלה תמונה...</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-3">
                              <Upload className="w-8 h-8 text-slate-400" />
                              <span className="text-slate-400">לחץ להעלאת תמונה</span>
                            </div>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={uploadingImage}
                        />
                      </label>
                    )}
                  </div>
                </AccordionContent>
              </CyberCard>
            </AccordionItem>
          </motion.div>

          {/* WhatsApp Templates */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <AccordionItem value="whatsapp" className="border-0">
              <CyberCard>
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-5 h-5 text-[#25D366]" />
                    <h2 className="text-xl font-bold">תבניות וואטסאפ</h2>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="pt-2 space-y-4">
                    <div className="bg-[#0F172A] border border-[#334155] rounded-xl p-4">
                      <h3 className="text-sm font-bold text-[#00F0FF] mb-3">משתנים זמינים:</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-300">
                        <div className="flex items-center gap-2">
                          <code className="bg-[#1E293B] px-2 py-1 rounded text-[#00F0FF]">{'{name}'}</code>
                          <span>שם התלמיד/ליד</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="bg-[#1E293B] px-2 py-1 rounded text-[#00F0FF]">{'{parent}'}</code>
                          <span>שם ההורה</span>
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
                          <code className="bg-[#1E293B] px-2 py-1 rounded text-[#00F0FF]">{'{balance}'}</code>
                          <span>יתרת שיעורים</span>
                        </div>
                      </div>
                    </div>

                    {formData.whatsapp_templates.map((template, index) => (
                      <div key={index} className="border border-[#334155] rounded-xl p-4 space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <FormInput
                              label="שם התבנית"
                              value={template.name}
                              onChange={(e) => handleTemplateChange(index, 'name', e.target.value)}
                              placeholder="לדוגמה: ליד חדש"
                            />
                          </div>
                          {formData.whatsapp_templates.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeTemplate(index)}
                              className="p-2 mt-6 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                            >
                              <X size={20} />
                            </button>
                          )}
                        </div>
                        
                        <FormInput
                          label="תוכן ההודעה"
                          type="textarea"
                          rows={4}
                          value={template.message}
                          onChange={(e) => handleTemplateChange(index, 'message', e.target.value)}
                          placeholder="היי {name}, תודה שפנית אליי..."
                        />

                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`attach-${index}`}
                            checked={template.attach_price_image}
                            onChange={(e) => handleTemplateChange(index, 'attach_price_image', e.target.checked)}
                            className="w-4 h-4 rounded accent-[#00F0FF]"
                          />
                          <label htmlFor={`attach-${index}`} className="text-sm text-slate-300 cursor-pointer">
                            צרף תמונת מחירון
                          </label>
                        </div>
                      </div>
                    ))}

                    <NeonButton type="button" onClick={addTemplate} variant="secondary" size="sm">
                      <Plus size={16} />
                      הוסף תבנית
                    </NeonButton>
                  </div>
                </AccordionContent>
              </CyberCard>
            </AccordionItem>
          </motion.div>

          {/* MOTD */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <AccordionItem value="motd" className="border-0">
              <CyberCard>
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-[#BD00FF]" />
                    <h2 className="text-xl font-bold">הודעה אישית</h2>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="pt-2">
                    <FormInput
                      label="הודעה שתוצג בדשבורד"
                      name="motd"
                      type="textarea"
                      value={formData.motd}
                      onChange={handleChange}
                      placeholder="כתוב הודעה מעוררת השראה..."
                      rows={2}
                    />
                  </div>
                </AccordionContent>
              </CyberCard>
            </AccordionItem>
          </motion.div>

          {/* Notifications */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <AccordionItem value="notifications" className="border-0">
              <CyberCard>
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-5 h-5 text-[#00F0FF]" />
                    <h2 className="text-xl font-bold">התראות</h2>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="pt-2 space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-[#0F172A] rounded-xl">
                      <input
                        type="checkbox"
                        id="notify-lesson"
                        checked={formData.notify_before_lesson || false}
                        onChange={(e) => setFormData(prev => ({ ...prev, notify_before_lesson: e.target.checked }))}
                        className="w-5 h-5 rounded accent-[#00F0FF]"
                      />
                      <label htmlFor="notify-lesson" className="text-slate-300 cursor-pointer flex-1">
                        שלח התראה 15 דקות לפני שיעור
                      </label>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-[#0F172A] rounded-xl">
                      <input
                        type="checkbox"
                        id="notify-lead"
                        checked={formData.notify_new_lead || false}
                        onChange={(e) => setFormData(prev => ({ ...prev, notify_new_lead: e.target.checked }))}
                        className="w-5 h-5 rounded accent-[#00F0FF]"
                      />
                      <label htmlFor="notify-lead" className="text-slate-300 cursor-pointer flex-1">
                        שלח התראה על ליד חדש
                      </label>
                    </div>
                  </div>
                </AccordionContent>
              </CyberCard>
            </AccordionItem>
          </motion.div>
        </Accordion>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6"
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