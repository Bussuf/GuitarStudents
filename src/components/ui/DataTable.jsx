import React from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown, MoreVertical } from 'lucide-react';

export default function DataTable({ 
  columns, 
  data, 
  onRowClick,
  sortBy,
  sortOrder,
  onSort,
  actions,
  emptyMessage = 'אין נתונים להצגה'
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[#334155]">
      <table className="w-full">
        <thead>
          <tr className="bg-[#1E293B] border-b border-[#334155]">
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => col.sortable && onSort && onSort(col.key)}
                className={`
                  px-6 py-4 text-right text-sm font-medium text-slate-400
                  ${col.sortable ? 'cursor-pointer hover:text-white' : ''}
                `}
              >
                <div className="flex items-center gap-2">
                  <span>{col.label}</span>
                  {col.sortable && sortBy === col.key && (
                    sortOrder === 'asc' 
                      ? <ChevronUp size={16} className="text-[#00F0FF]" />
                      : <ChevronDown size={16} className="text-[#00F0FF]" />
                  )}
                </div>
              </th>
            ))}
            {actions && <th className="px-6 py-4 w-16"></th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td 
                colSpan={columns.length + (actions ? 1 : 0)} 
                className="px-6 py-12 text-center text-slate-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <motion.tr
                key={row.id || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => onRowClick && onRowClick(row)}
                className={`
                  border-b border-[#334155] transition-colors
                  ${onRowClick ? 'cursor-pointer hover:bg-[#1E293B]/50' : ''}
                `}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 text-sm">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                {actions && (
                  <td className="px-6 py-4">
                    {actions(row)}
                  </td>
                )}
              </motion.tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}