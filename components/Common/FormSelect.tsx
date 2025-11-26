// components/Common/FormSelect.tsx
import React from 'react';

interface FormSelectProps {
  label: string;
  options: { value: any; label: string }[];
  onChange: (value: any) => void;
  value?: any;
}

export const FormSelect: React.FC<FormSelectProps> = ({ 
  label, 
  options, 
  onChange, 
  value 
}) => {
  return (
    <div style={{ marginBottom: '15px' }}>
      <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '8px',
          border: '1px solid #ddd',
          borderRadius: '4px'
        }}
      >
        <option value="">-- Chọn --</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};