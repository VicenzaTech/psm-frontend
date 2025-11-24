// components/Common/Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  ...rest
}) => {
  const getClasses = () => {
    let classes = 'btn';
    
    // Variant
    if (variant === 'primary') classes += ' btn-primary';
    else if (variant === 'secondary') classes += ' btn-secondary';
    else if (variant === 'danger') classes += ' btn-danger';
    
    // Size
    if (size === 'sm') classes += ' btn-sm';
    else if (size === 'md') classes += ' btn-md';
    else if (size === 'lg') classes += ' btn-lg';
    
    // Custom classes
    if (className) classes += ` ${className}`;
    
    return classes;
  };

  return (
    <button
      type={type}
      className={getClasses()}
      {...rest}
    >
      {children}
    </button>
  );
};