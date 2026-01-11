import React, { useState, useEffect } from 'react';
import FormInput from '../ui/FormInput';
import NeonButton from '../ui/NeonButton';
import { Save, X } from 'lucide-react';
import moment from 'moment';

const packageOptions = [
  { value: 'שיעור בודד', label: 'שיעור בודד', lessons: 1 },
  { value: 'חבילת 4 שיעורים', label: 'חבילת 4 שיעורים', lessons: 4 },
  { value: 'חבילת 8 שיעורים', label: 'חבילת 8 שיעורים', lessons: 8 },
  { value: 'חבילת 12 שיעורים', label: 'חבילת 12 שיעורים', lessons: 12 },
];

const paymentMethods = ['מזומן', 'העברה בנקאית', 'ביט', 'פייבוקס', 'אשראי'];

export default function FinanceForm({ finance, students, settings, onSave, onCancel, preSelectedStudent }) {
  const [formData, setFormData] = useState({
    student_id: preSelectedStudent || '',
    date: moment().format('YYYY-MM-DD'),
    package_type: 'שיעור בודד',
    amount: settings?.default_lesson_price || '',
    lessons_count: 1,
    payment_method: ''
  });

  useEffect(() => {
    if (finance) {
      setFormData({
        student_id: finance.student_id || '',
        date: finance.date || moment().format('YYYY-MM-DD'),
        package_type: finance.package_type || 'שיעור בודד',
        amount: finance.amount || '',
        lessons_count: finance.lessons_count || 1,
        payment_method: finance.payment_method || ''
      });
    } else if (preSelectedStudent) {
      setFormData(prev => ({ ...prev, student_id: preSelectedStudent }));
    }
  }, [finance, preSelectedStudent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'package_type') {
      const pkg = packageOptions.find(p => p.value === value);
      const basePrice = settings?.default_lesson_price || 150;
      setFormData(prev => ({
        ...prev,
        [name]: value,
        lessons_count: pkg?.lessons || 1,
        amount: basePrice * (pkg?.lessons || 1)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const student = students.find(s => s.id === formData.student_id);
    onSave({
      ...formData,
      student_name: student?.name || '',
      amount: Number(formData.amount),
      lessons_count: Number(formData.lessons_count)
    });
  };

  const studentOptions = students.map(s => ({
    value: s.id,
    label: `${s.name} (יתרה: ${s.balance || 0})`
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormInput
        label="תלמיד"
        name="student_id"
        type="select"
        value={formData.student_id}
        onChange={handleChange}
        options={studentOptions}
        required
      />

      <FormInput
        label="תאריך"
        name="date"
        type="date"
        value={formData.date}
        onChange={handleChange}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="סוג חבילה"
          name="package_type"
          type="select"
          value={formData.package_type}
          onChange={handleChange}
          options={packageOptions.map(p => p.value)}
        />
        <FormInput
          label="מספר שיעורים"
          name="lessons_count"
          type="number"
          value={formData.lessons_count}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="סכום (₪)"
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          required
        />
        <FormInput
          label="אמצעי תשלום"
          name="payment_method"
          type="select"
          value={formData.payment_method}
          onChange={handleChange}
          options={paymentMethods}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <NeonButton type="submit" className="flex-1">
          <Save className="w-5 h-5" />
          {finance ? 'עדכן' : 'הוסף תשלום'}
        </NeonButton>
        <NeonButton type="button" variant="ghost" onClick={onCancel}>
          <X className="w-5 h-5" />
          ביטול
        </NeonButton>
      </div>
    </form>
  );
}