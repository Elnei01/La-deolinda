import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-5 sm:p-6 transition-all duration-200 shadow-sm ${
        onClick ? 'cursor-pointer hover:border-emerald-500 dark:hover:border-emerald-400' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};