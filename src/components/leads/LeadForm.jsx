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
    status: 'חדש',
    source: '',
    notes: ''
  });

  useEffect(() => {
    if (lead) {
      setFormData({
        full_name: lead.full_name || '',
        phone: lead.phone || '',
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