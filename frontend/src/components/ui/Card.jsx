import React from 'react';

const Card = ({ children, className = '', title, headerAction, ...props }) => {
  return (
    <div 
      className={`bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col ${className}`} 
      {...props}
    >
      {title && (
        <div className="px-6 py-4 border-b border-outline-variant/30 bg-surface-bright flex justify-between items-center">
          <h3 className="text-title-sm font-title-sm text-on-surface font-semibold flex items-center gap-2">
            {title}
          </h3>
          {headerAction && (
            <div className="flex items-center gap-3">
              {headerAction}
            </div>
          )}
        </div>
      )}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

export default Card;
