import React, { useState, useEffect } from 'react';
import FormInput from '../ui/FormInput';
import NeonButton from '../ui/NeonButton';
import { Save, X } from 'lucide-react';

const statusOptions = ['חדש', 'בטיפול', 'נקבע ניסיון', 'נרשם', 'לא רלוונטי'];
const sourceOptions = ['פייסבוק', 'אינסטגרם', 'המלצה', 'גוגל', 'אחר'];

export default function LeadForm({ lead, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    age: '',
    for_whom: 'עצמי',
    status: 'חדש',
    source: '',
    notes: ''
  });

  useEffect(() => {
    if (lead) {
      setFormData({
        full_name: lead.full_name || '',
        phone: lead.phone || '',
        age: lead.age || '',
        for_whom: lead.for_whom || 'עצמי',
        status: lead.status || 'חדש',
        source: lead.source || '',
        notes: lead.notes || ''
      });
    }
  }, [lead]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="שם מלא"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          placeholder="הכנס שם מלא"
          required
        />
        <FormInput
          label="טלפון"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="050-0000000"
          required
        />
        <FormInput
          label="גיל"
          name="age"
          type="number"
          value={formData.age}
          onChange={handleChange}
          placeholder="הכנס גיל"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300">מתעניין עבור</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="for_whom"
              value="עצמי"
              checked={formData.for_whom === 'עצמי'}
              onChange={handleChange}
              className="w-4 h-4 text-[#00F0FF] bg-[#1E293B] border-[#334155] focus:ring-[#00F0FF]"
            />
            <span className="text-slate-300">עצמי</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="for_whom"
              value="מישהו אחר"
              checked={formData.for_whom === 'מישהו אחר'}
              onChange={handleChange}
              className="w-4 h-4 text-[#00F0FF] bg-[#1E293B] border-[#334155] focus:ring-[#00F0FF]"
            />
            <span className="text-slate-300">מישהו אחר</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="סטטוס"
          name="status"
          type="select"
          value={formData.status}
          onChange={handleChange}
          options={statusOptions}
        />
        <FormInput
          label="מקור"
          name="source"
          type="select"
          value={formData.source}
          onChange={handleChange}
          options={sourceOptions}
        />
      </div>

      <FormInput
        label="הערות"
        name="notes"
        type="textarea"
        value={formData.notes}
        onChange={handleChange}
        placeholder="הוסף הערות..."
        rows={4}
      />

      <div className="flex gap-3 pt-4">
        <NeonButton type="submit" className="flex-1">
          <Save className="w-5 h-5" />
          {lead ? 'עדכן ליד' : 'הוסף ליד'}
        </NeonButton>
        <NeonButton type="button" variant="ghost" onClick={onCancel}>
          <X className="w-5 h-5" />
          ביטול
        </NeonButton>
      </div>
    </form>
  );
}