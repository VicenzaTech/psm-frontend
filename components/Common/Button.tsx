// components/Common/Button.tsx - Cập nhật để hỗ trợ màu đỏ

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  type = 'button',
  className = ''
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
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};