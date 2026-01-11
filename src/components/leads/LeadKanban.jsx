import React from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, UserPlus, MoreVertical } from 'lucide-react';
import NeonButton from '../ui/NeonButton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const columns = [
  { id: 'חדש', title: 'חדש', color: 'from-blue-500 to-blue-600' },
  { id: 'בטיפול', title: 'בטיפול', color: 'from-yellow-500 to-orange-500' },
  { id: 'נקבע ניסיון', title: 'נקבע ניסיון', color: 'from-purple-500 to-pink-500' },
  { id: 'נרשם', title: 'נרשם', color: 'from-emerald-500 to-green-500' },
  { id: 'לא רלוונטי', title: 'לא רלוונטי', color: 'from-slate-500 to-slate-600' },
];

export default function LeadKanban({ 
  leads, 
  onStatusChange, 
  onEdit, 
  onConvertToStudent,
  onWhatsApp,
  settings 
}) {
  const getLeadsByStatus = (status) => leads.filter(l => l.status === status);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((column) => (
        <div key={column.id} className="flex-shrink-0 w-80">
          <div className={`bg-gradient-to-r ${column.color} rounded-t-xl p-3`}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white">{column.title}</h3>
              <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-sm">
                {getLeadsByStatus(column.id).length}
              </span>
            </div>
          </div>
          
          <div className="bg-[#1E293B]/50 rounded-b-xl p-3 min-h-[400px] space-y-3">
            {getLeadsByStatus(column.id).map((lead, idx) => (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-[#1E293B] border border-[#334155] rounded-xl p-4 hover:border-[#00F0FF]/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold">{lead.full_name}</h4>
                    <a 
                      href={`tel:${lead.phone}`}
                      className="text-sm text-[#00F0FF] hover:underline"
                    >
                      {lead.phone}
                    </a>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 hover:bg-[#334155] rounded-lg transition-colors">
                        <MoreVertical size={18} className="text-slate-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#1E293B] border-[#334155]">
                      <DropdownMenuItem onClick={() => onEdit(lead)} className="text-white hover:bg-[#334155]">
                        עריכה
                      </DropdownMenuItem>
                      {column.id !== 'נרשם' && (
                        <DropdownMenuItem onClick={() => onConvertToStudent(lead)} className="text-emerald-400 hover:bg-[#334155]">
                          <UserPlus size={16} className="ml-2" />
                          הפוך לתלמיד
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => onStatusChange(lead, 'לא רלוונטי')} className="text-red-400 hover:bg-[#334155]">
                        סמן לא רלוונטי
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {lead.source && (
                  <p className="text-xs text-slate-400 mb-3">מקור: {lead.source}</p>
                )}

                {lead.notes && (
                  <p className="text-sm text-slate-300 mb-3 line-clamp-2">{lead.notes}</p>
                )}

                <div className="flex gap-2">
                  <NeonButton 
                    variant="phone" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => window.open(`tel:${lead.phone}`, '_self')}
                  >
                    <Phone size={14} />
                  </NeonButton>
                  <NeonButton 
                    variant="whatsapp" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => onWhatsApp(lead)}
                  >
                    <MessageCircle size={14} />
                  </NeonButton>
                </div>

                {/* Status Change Buttons */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {columns
                    .filter(c => c.id !== column.id && c.id !== 'לא רלוונטי')
                    .map(c => (
                      <button
                        key={c.id}
                        onClick={() => onStatusChange(lead, c.id)}
                        className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${c.color} opacity-50 hover:opacity-100 transition-opacity`}
                      >
                        {c.title}
                      </button>
                    ))
                  }
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}