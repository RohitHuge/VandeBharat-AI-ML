import React from 'react';

const Badge = ({ children, variant = 'info', className = '', dot = false, ...props }) => {
  const variants = {
    success: 'bg-secondary/10 text-secondary',
    info: 'bg-surface-variant text-primary',
    error: 'bg-error-container text-on-error-container',
    warning: 'bg-tertiary-container/10 text-tertiary'
  };

  const baseStyles = 'px-3 py-1 rounded-full text-label-caps font-label-caps uppercase flex items-center gap-1';
  
  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {dot && (
        <span className={`w-2 h-2 rounded-full ${variant === 'success' ? 'bg-secondary animate-pulse' : 'bg-current'}`}></span>
      )}
      {children}
    </span>
  );
};

export default Badge;
