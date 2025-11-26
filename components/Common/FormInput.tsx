// components/Common/FormInput.tsx
import React from 'react';

interface FormInputProps {
  label: string;
  value: any;
  onChange: (value: any) => void;
  placeholder?: string;
  type?: 'text' | 'number' | 'textarea';
}

export const FormInput: React.FC<FormInputProps> = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  type = 'text' 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
    onChange(newValue);
  };

  return (
    <div style={{ marginBottom: '15px' }}>
      <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            minHeight: '80px'
          }}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
      )}
    </div>
  );
};