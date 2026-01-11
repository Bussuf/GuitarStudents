import React from 'react';

export default function FormInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  options = [],
  rows = 3,
  name,
  error
}) {
  const baseClasses = `
    w-full bg-[#0F172A] border border-[#334155] rounded-xl px-4 py-3
    text-white placeholder-slate-500
    focus:outline-none focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF]
    transition-all duration-200
    direction-rtl text-right
  `;

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-2">
          {label}
          {required && <span className="text-[#BD00FF] mr-1">*</span>}
        </label>
      )}
      
      {type === 'select' ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={baseClasses}
        >
          <option value="">בחר...</option>
          {options.map((opt) => (
            <option key={opt.value || opt} value={opt.value || opt}>
              {opt.label || opt}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className={baseClasses}
        />
      ) : type === 'checkbox' ? (
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name={name}
            checked={value}
            onChange={onChange}
            className="w-5 h-5 rounded bg-[#0F172A] border-[#334155] text-[#00F0FF] focus:ring-[#00F0FF]"
          />
          <span className="text-slate-300">{placeholder}</span>
        </label>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={baseClasses}
        />
      )}
      
      {error && (
        <p className="text-red-400 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}