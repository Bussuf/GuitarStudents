import React from 'react';
import { AlertTriangle, User } from 'lucide-react';
import CyberCard from '../ui/CyberCard';
import NeonButton from '../ui/NeonButton';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';

export default function LowBalanceCard({ students }) {
  const lowBalanceStudents = students.filter(s => s.balance <= 1);

  return (
    <CyberCard className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
        </div>
        <h3 className="text-lg font-bold">צריך חידוש</h3>
        <span className="mr-auto bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-sm">
          {lowBalanceStudents.length}
        </span>
      </div>

      {lowBalanceStudents.length === 0 ? (
        <p className="text-slate-400 text-center py-8">כל התלמידים מעודכנים 🎉</p>
      ) : (
        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {lowBalanceStudents.map((student) => (
            <div
              key={student.id}
              className="flex items-center gap-4 p-4 rounded-xl bg-[#0F172A] border border-[#334155] hover:border-yellow-500/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00F0FF] to-[#BD00FF] flex items-center justify-center">
                {student.photo_url ? (
                  <img src={student.photo_url} alt={student.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">{student.name}</p>
                <p className="text-sm text-yellow-400">יתרה: {student.balance} שיעורים</p>
              </div>
              <Link to={`${createPageUrl('Finance')}?student=${student.id}`}>
                <NeonButton variant="secondary" size="sm">
                  חידוש
                </NeonButton>
              </Link>
            </div>
          ))}
        </div>
      )}
    </CyberCard>
  );
}