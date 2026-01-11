import React, { useState, useEffect } from 'react';
import FormInput from '../ui/FormInput';
import NeonButton from '../ui/NeonButton';
import { Save, X, Upload, Plus, Trash2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const DAYS = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

export default function StudentForm({ student, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    age: '',
    balance: 0,
    is_active: true,
    contact_parent: false,
    parent_name: '',
    parent_phone: '',
    photo_url: '',
    weekly_lessons: 1,
    recurring_schedule: []
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        phone: student.phone || '',
        age: student.age || '',
        balance: student.balance || 0,
        is_active: student.is_active !== undefined ? student.is_active : true,
        contact_parent: student.contact_parent || false,
        parent_name: student.parent_name || '',
        parent_phone: student.parent_phone || '',
        photo_url: student.photo_url || '',
        weekly_lessons: student.weekly_lessons || 1,
        recurring_schedule: student.recurring_schedule || []
      });
    }
  }, [student]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setFormData(prev => ({ ...prev, photo_url: file_url }));
    setUploading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Validate phone numbers
    if (!formData.phone && !formData.parent_phone) {
      setError('חייב למלא לפחות טלפון אחד - תלמיד או הורה');
      return;
    }
    
    onSave({
      ...formData,
      age: formData.age ? Number(formData.age) : null,
      balance: Number(formData.balance),
      weekly_lessons: Number(formData.weekly_lessons)
    });
  };

  const addRecurringSlot = () => {
    setFormData(prev => ({
      ...prev,
      recurring_schedule: [...prev.recurring_schedule, { day: 0, time: '16:00' }]
    }));
  };

  const removeRecurringSlot = (index) => {
    setFormData(prev => ({
      ...prev,
      recurring_schedule: prev.recurring_schedule.filter((_, i) => i !== index)
    }));
  };

  const updateRecurringSlot = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      recurring_schedule: prev.recurring_schedule.map((slot, i) => 
        i === index ? { ...slot, [field]: field === 'day' ? Number(value) : value } : slot
      )
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Photo Upload */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#00F0FF] to-[#BD00FF] p-1">
            <div className="w-full h-full rounded-full bg-[#1E293B] overflow-hidden flex items-center justify-center">
              {formData.photo_url ? (
                <img src={formData.photo_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl text-slate-500">
                  {formData.name?.[0]?.toUpperCase() || '?'}
                </span>
              )}
            </div>
          </div>
          <label className="absolute -bottom-2 -left-2 w-8 h-8 rounded-full bg-[#00F0FF] flex items-center justify-center cursor-pointer hover:bg-[#00D4E0] transition-colors">
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            {uploading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload size={14} className="text-[#0F172A]" />
            )}
          </label>
        </div>
      </div>

      <FormInput
        label="שם תלמיד"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="טלפון תלמיד"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="לא חובה אם יש טלפון הורה"
        />
        <FormInput
          label="גיל"
          name="age"
          type="number"
          value={formData.age}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="יתרת שיעורים"
          name="balance"
          type="number"
          value={formData.balance}
          onChange={handleChange}
        />
        <FormInput
          label="תלמיד פעיל"
          name="is_active"
          type="checkbox"
          checked={formData.is_active}
          onChange={handleChange}
        />
      </div>

      <div className="border-t border-[#334155] pt-6">
        <h3 className="text-lg font-bold mb-4">פרטי קשר</h3>
        
        <FormInput
          label="צור קשר עם הורה?"
          name="contact_parent"
          type="checkbox"
          checked={formData.contact_parent}
          onChange={handleChange}
        />

        {formData.contact_parent && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-[#0F172A] rounded-xl border border-[#334155]">
            <FormInput
              label="שם הורה"
              name="parent_name"
              value={formData.parent_name}
              onChange={handleChange}
            />
            <FormInput
              label="טלפון הורה"
              name="parent_phone"
              value={formData.parent_phone}
              onChange={handleChange}
              placeholder="חובה אם אין טלפון תלמיד"
            />
          </div>
        )}
      </div>

      <div className="border-t border-[#334155] pt-6">
        <h3 className="text-lg font-bold mb-4">שיעורים קבועים</h3>
        
        <FormInput
          label="מספר שיעורים בשבוע"
          name="weekly_lessons"
          type="number"
          value={formData.weekly_lessons}
          onChange={handleChange}
          min="0"
        />

        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-300">ימים ושעות קבועים</label>
            <NeonButton type="button" size="sm" variant="secondary" onClick={addRecurringSlot}>
              <Plus size={16} />
              הוסף מועד
            </NeonButton>
          </div>

          {formData.recurring_schedule.map((slot, index) => (
            <div key={index} className="flex gap-2 items-center p-3 bg-[#0F172A] rounded-xl border border-[#334155]">
              <select
                value={slot.day}
                onChange={(e) => updateRecurringSlot(index, 'day', e.target.value)}
                className="flex-1 bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-white"
              >
                {DAYS.map((day, idx) => (
                  <option key={idx} value={idx}>{day}</option>
                ))}
              </select>
              <input
                type="time"
                value={slot.time}
                onChange={(e) => updateRecurringSlot(index, 'time', e.target.value)}
                className="flex-1 bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-white"
              />
              <button
                type="button"
                onClick={() => removeRecurringSlot(index)}
                className="p-2 hover:bg-[#334155] rounded-lg transition-colors text-red-400"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}

          {formData.recurring_schedule.length === 0 && (
            <p className="text-sm text-slate-500 text-center py-4">אין שיעורים קבועים מוגדרים</p>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <NeonButton type="submit" className="flex-1">
          <Save className="w-5 h-5" />
          {student ? 'עדכן תלמיד' : 'הוסף תלמיד'}
        </NeonButton>
        <NeonButton type="button" variant="ghost" onClick={onCancel}>
          <X className="w-5 h-5" />
          ביטול
        </NeonButton>
      </div>
    </form>
  );
}