import React, { useState, useEffect } from 'react';
import FormInput from '../ui/FormInput';
import NeonButton from '../ui/NeonButton';
import { Save, X, Upload, Link as LinkIcon } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const topicOptions = ['אקורדים', 'שירים', 'תרגילים', 'תיאוריה', 'טכניקה', 'אחר'];
const mediaTypeOptions = ['PDF', 'וידאו', 'אודיו', 'קישור', 'תמונה'];

export default function ResourceForm({ resource, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    topic: '',
    media_type: '',
    file_url: '',
    description: ''
  });
  const [uploading, setUploading] = useState(false);
  const [useLink, setUseLink] = useState(false);

  useEffect(() => {
    if (resource) {
      setFormData({
        title: resource.title || '',
        topic: resource.topic || '',
        media_type: resource.media_type || '',
        file_url: resource.file_url || '',
        description: resource.description || ''
      });
      setUseLink(resource.media_type === 'קישור' || resource.media_type === 'וידאו');
    }
  }, [resource]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'media_type') {
      setUseLink(value === 'קישור' || value === 'וידאו');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setFormData(prev => ({ ...prev, file_url }));
    setUploading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormInput
        label="כותרת"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="שם החומר"
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="נושא"
          name="topic"
          type="select"
          value={formData.topic}
          onChange={handleChange}
          options={topicOptions}
          required
        />
        <FormInput
          label="סוג מדיה"
          name="media_type"
          type="select"
          value={formData.media_type}
          onChange={handleChange}
          options={mediaTypeOptions}
          required
        />
      </div>

      {/* File Upload or Link */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          {useLink ? 'קישור' : 'קובץ'}
        </label>
        
        {useLink ? (
          <div className="relative">
            <LinkIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="url"
              name="file_url"
              value={formData.file_url}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full bg-[#0F172A] border border-[#334155] rounded-xl pl-4 pr-10 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF] transition-all duration-200 text-right"
              dir="ltr"
            />
          </div>
        ) : (
          <div className="border-2 border-dashed border-[#334155] rounded-xl p-6 text-center hover:border-[#00F0FF]/50 transition-colors">
            {formData.file_url ? (
              <div className="space-y-2">
                <p className="text-emerald-400">✓ קובץ הועלה בהצלחה</p>
                <a 
                  href={formData.file_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#00F0FF] text-sm hover:underline"
                >
                  צפה בקובץ
                </a>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, file_url: '' }))}
                  className="block mx-auto text-red-400 text-sm hover:underline"
                >
                  הסר קובץ
                </button>
              </div>
            ) : (
              <label className="cursor-pointer">
                <input type="file" onChange={handleFileUpload} className="hidden" />
                {uploading ? (
                  <div className="w-8 h-8 border-2 border-[#00F0FF] border-t-transparent rounded-full animate-spin mx-auto" />
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                    <p className="text-slate-400">לחץ להעלאת קובץ</p>
                  </>
                )}
              </label>
            )}
          </div>
        )}
      </div>

      <FormInput
        label="תיאור"
        name="description"
        type="textarea"
        value={formData.description}
        onChange={handleChange}
        placeholder="תיאור קצר של החומר..."
        rows={3}
      />

      <div className="flex gap-3 pt-4">
        <NeonButton type="submit" className="flex-1">
          <Save className="w-5 h-5" />
          {resource ? 'עדכן' : 'הוסף חומר'}
        </NeonButton>
        <NeonButton type="button" variant="ghost" onClick={onCancel}>
          <X className="w-5 h-5" />
          ביטול
        </NeonButton>
      </div>
    </form>
  );
}