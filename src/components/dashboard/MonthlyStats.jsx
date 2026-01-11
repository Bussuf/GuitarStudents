import React from 'react';
import { Wallet, TrendingUp, Users, BookOpen } from 'lucide-react';
import moment from 'moment';

export default function MonthlyStats({ finances, lessons, students }) {
  const currentMonth = moment().startOf('month');
  
  const monthlyRevenue = finances
    .filter(f => moment(f.date).isSameOrAfter(currentMonth))
    .reduce((sum, f) => sum + (f.amount || 0), 0);

  const monthlyLessons = lessons
    .filter(l => moment(l.date_time).isSameOrAfter(currentMonth) && l.status === 'בוצע')
    .length;

  const activeStudents = students.filter(s => s.balance > 0).length;

  const stats = [
    {
      label: 'הכנסות החודש',
      value: `₪${monthlyRevenue.toLocaleString()}`,
      icon: Wallet,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'from-emerald-500/20 to-emerald-600/20'
    },
    {
      label: 'שיעורים שבוצעו',
      value: monthlyLessons,
      icon: BookOpen,
      color: 'from-[#00F0FF] to-[#BD00FF]',
      bgColor: 'from-[#00F0FF]/20 to-[#BD00FF]/20'
    },
    {
      label: 'תלמידים פעילים',
      value: activeStudents,
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-500/20 to-pink-500/20'
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-5 h-5 text-[#00F0FF]" />
        <h2 className="text-xl font-bold">סטטיסטיקות החודש</h2>
        <span className="mr-auto text-sm text-slate-400">{moment().format('MMMM YYYY')}</span>
      </div>

      <div className="grid gap-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="flex items-center gap-4 p-4 rounded-xl bg-[#0F172A] border border-[#334155]"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.bgColor} flex items-center justify-center`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-400">{stat.label}</p>
              <p className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}