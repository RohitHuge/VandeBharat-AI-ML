import React from 'react';
import Card from '../ui/Card';

const StatCard = ({ label, value, icon, trend, trendIcon, isCritical = false }) => {
  return (
    <div className={`bg-[#F1F5F9] border border-[#E2E8F0] p-4 rounded-xl hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-shadow duration-300 relative overflow-hidden group`}>
      {isCritical && (
        <div className="absolute right-0 top-0 w-2 h-full bg-error opacity-80"></div>
      )}
      <div className="flex justify-between items-start mb-2">
        <span className="text-label-caps font-semibold text-on-surface-variant uppercase tracking-wider">
          {label}
        </span>
        <span className={`material-symbols-outlined ${isCritical ? 'text-error' : 'text-primary'} text-[20px]`}>
          {icon}
        </span>
      </div>
      <div className="text-headline-md font-bold text-on-surface">
        {value}
      </div>
      {(trend || trendIcon) && (
        <div className={`text-[12px] flex items-center mt-1 ${isCritical ? 'text-error' : 'text-secondary'}`}>
          {trendIcon && <span className="material-symbols-outlined text-[14px] mr-1">{trendIcon}</span>}
          {trend}
        </div>
      )}
    </div>
  );
};

export default StatCard;
