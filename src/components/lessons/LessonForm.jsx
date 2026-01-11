import React, { useState, useEffect } from 'react';
import FormInput from '../ui/FormInput';
import NeonButton from '../ui/NeonButton';
import { Save, X } from 'lucide-react';
import moment from 'moment';

const statusOptions = ['עתידי', 'בוצע', 'בוטל'];

export default function LessonForm({ lesson, students, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    student_id: '',
    date_time: '',
    status: 'עתידי',
    summary: ''
  });

  useEffect(() => {
    if (lesson) {
      setFormData({
        student_id: lesson.student_id || '',
        date_time: lesson.date_time ? moment(lesson.date_time).format('YYYY-MM-DDTHH:mm') : '',
        status: lesson.status || 'עתידי',
        summary: lesson.summary || ''
      });
    }
  }, [lesson]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const student = students.find(s => s.id === formData.student_id);
    onSave({
      ...formData,
      student_name: student?.name || '',
      date_time: new Date(formData.date_time).toISOString()
    });
  };

  const studentOptions = students.map(s => ({
    value: s.id,
    label: s.name
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
        label="מועד השיעור"
        name="date_time"
        type="datetime-local"
        value={formData.date_time}
        onChange={handleChange}
        required
      />

      <FormInput
        label="סטטוס"
        name="status"
        type="select"
        value={formData.status}
        onChange={handleChange}
        options={statusOptions}
      />

      <FormInput
        label="סיכום שיעור"
        name="summary"
        type="textarea"
        value={formData.summary}
        onChange={handleChange}
        placeholder="מה עשיתם בשיעור?"
        rows={4}
      />

      <div className="flex gap-3 pt-4">
        <NeonButton type="submit" className="flex-1">
          <Save className="w-5 h-5" />
          {lesson ? 'עדכן שיעור' : 'הוסף שיעור'}
        </NeonButton>
        <NeonButton type="button" variant="ghost" onClick={onCancel}>
          <X className="w-5 h-5" />
          ביטול
        </NeonButton>
      </div>
    </form>
  );
}