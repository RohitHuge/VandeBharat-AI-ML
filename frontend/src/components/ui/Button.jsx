import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  icon,
  ...props 
}) => {
  const variants = {
    primary: 'bg-gradient-to-b from-primary to-[#004ca3] text-on-primary shadow-sm border-t border-white/20 hover:shadow-md transition-all active:scale-95 duration-200',
    secondary: 'bg-surface-container-lowest border border-outline-variant/50 text-primary hover:bg-surface-variant transition-colors',
    error: 'bg-error text-on-error hover:bg-[#a01616] transition-colors',
    ghost: 'hover:bg-surface-variant/50 transition-colors active:scale-95 duration-200 p-2 rounded-full flex items-center justify-center text-on-surface-variant'
  };

  const baseStyles = 'text-title-sm font-title-sm px-6 py-2 rounded-lg flex items-center justify-center gap-2 transition-all';
  
  // Ghost variant has different base padding/styles
  const finalClassName = variant === 'ghost' 
    ? `${variants.ghost} ${className}`
    : `${baseStyles} ${variants[variant]} ${className}`;

  return (
    <button className={finalClassName} {...props}>
      {icon && <span className="material-symbols-outlined">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
