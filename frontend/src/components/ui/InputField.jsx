import React from 'react';

const InputField = ({ 
  icon, 
  placeholder, 
  className = '', 
  containerClassName = '',
  ...props 
}) => {
  return (
    <div className={`flex items-center bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-4 py-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all ${containerClassName}`}>
      {icon && (
        <span className="material-symbols-outlined text-on-surface-variant mr-2">
          {icon}
        </span>
      )}
      <input 
        className={`bg-transparent border-none outline-none w-full text-body-compact font-body-compact text-on-surface placeholder:text-on-surface-variant/50 focus:ring-0 p-0 ${className}`} 
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
};

export default InputField;
