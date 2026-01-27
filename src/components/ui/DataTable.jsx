import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown, Filter } from 'lucide-react';

export default function DataTable({ 
  columns, 
  data, 
  onRowClick,
  actions,
  emptyMessage = 'אין נתונים להצגה'
}) {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [filters, setFilters] = useState({});

  const handleSort = (columnKey) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const handleFilterChange = (columnKey, value) => {
    setFilters(prev => ({ ...prev, [columnKey]: value }));
  };

  // Apply filters
  const filteredData = data.filter(row => {
    return columns.every(column => {
      const filterValue = filters[column.key];
      if (!filterValue || filterValue === '') return true;
      
      const cellValue = row[column.key];
      if (cellValue === null || cellValue === undefined) return false;
      
      return String(cellValue).toLowerCase().includes(filterValue.toLowerCase());
    });
  });

  // Apply sorting
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];
    
    if (aVal === bVal) return 0;
    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;
    
    const comparison = aVal < bVal ? -1 : 1;
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  return (
    <div className="overflow-x-auto rounded-2xl border border-[#334155]">
      <table className="w-full">
        <thead>
          <tr className="bg-[#1E293B] border-b border-[#334155]">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-4 text-right text-sm font-medium text-slate-400"
              >
                <div 
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  className={`
                    flex items-center gap-2 mb-2
                    ${col.sortable !== false ? 'cursor-pointer hover:text-white transition-colors' : ''}
                  `}
                >
                  <span>{col.label}</span>
                  {col.sortable !== false && sortColumn === col.key && (
                    <span className="text-[#00F0FF]">
                      {sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </span>
                  )}
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    placeholder="סינון..."
                    value={filters[col.key] || ''}
                    onChange={(e) => handleFilterChange(col.key, e.target.value)}
                    className="w-full px-2 py-1 bg-[#0F172A] border border-[#334155] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F0FF] transition-colors"
                  />
                </div>
              </th>
            ))}
            {actions && (
              <th className="px-6 py-4 text-sm font-medium text-slate-400">
                <div className="mb-2">פעולות</div>
                <div className="h-[30px]"></div>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {sortedData.length === 0 ? (
            <tr>
              <td 
                colSpan={columns.length + (actions ? 1 : 0)} 
                className="px-6 py-12 text-center text-slate-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedData.map((row, idx) => (
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