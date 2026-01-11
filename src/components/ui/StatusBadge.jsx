import React from 'react';

const statusStyles = {
  // Lead statuses
  'חדש': 'bg-blue-500/20 text-blue-400 border-blue-500',
  'בטיפול': 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
  'נקבע ניסיון': 'bg-purple-500/20 text-purple-400 border-purple-500',
  'נרשם': 'bg-emerald-500/20 text-emerald-400 border-emerald-500',
  'לא רלוונטי': 'bg-slate-500/20 text-slate-400 border-slate-500',
  
  // Lesson statuses
  'עתידי': 'bg-cyan-500/20 text-cyan-400 border-cyan-500',
  'בוצע': 'bg-emerald-500/20 text-emerald-400 border-emerald-500',
  'בוטל': 'bg-red-500/20 text-red-400 border-red-500',
};

export default function StatusBadge({ status }) {
  const style = statusStyles[status] || 'bg-slate-500/20 text-slate-400 border-slate-500';
  
  return (
    <span className={`
      inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
      border ${style}
    `}>
      {status}
    </span>
  );
}