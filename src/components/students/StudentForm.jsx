import React, { useState, useEffect } from 'react';
import FormInput from '../ui/FormInput';
import NeonButton from '../ui/NeonButton';
import { Save, X, Upload } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function StudentForm({ student, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    age: '',
    balance: 0,
    contact_parent: false,
    parent_name: '',
    parent_phone: '',
    photo_url: ''
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        phone: student.phone || '',
        age: student.age || '',
        balance: student.balance || 0,
        contact_parent: student.contact_parent || false,
        parent_name: student.parent_name || '',
        parent_phone: student.parent_phone || '',
        photo_url: student.photo_url || ''
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
    onSave({
      ...formData,
      age: formData.age ? Number(formData.age) : null,
      balance: Number(formData.balance)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="שם תלמיד"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="הכנס שם"
          required
        />
        <FormInput
          label="טלפון תלמיד"
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
          label="גיל"
          name="age"
          type="number"
          value={formData.age}
          onChange={handleChange}
          placeholder="גיל התלמיד"
        />
        <FormInput
          label="יתרת שיעורים"
          name="balance"
          type="number"
          value={formData.balance}
          onChange={handleChange}
        />
      </div>

      <div className="border-t border-[#334155] pt-4">
        <FormInput
          name="contact_parent"
          type="checkbox"
          value={formData.contact_parent}
          onChange={handleChange}
          placeholder="צור קשר עם הורה במקום תלמיד"
        />

        {formData.contact_parent && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-[#0F172A] rounded-xl">
            <FormInput
              label="שם הורה"
              name="parent_name"
              value={formData.parent_name}
              onChange={handleChange}
              placeholder="שם ההורה"
            />
            <FormInput
              label="טלפון הורה"
              name="parent_phone"
              type="tel"
              value={formData.parent_phone}
              onChange={handleChange}
              placeholder="050-0000000"
            />
          </div>
        )}
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