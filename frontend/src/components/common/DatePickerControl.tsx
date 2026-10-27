import React from 'react';
import { formatLocalDate } from '../../utils/dateUtils';

interface DatePickerControlProps {
  selectedDate: string;
  onDateChange: (newDate: string) => void;
  onNextDay: () => void;
  onToday: () => void;
  minDate?: string;
}

export const DatePickerControl: React.FC<DatePickerControlProps> = ({
  selectedDate,
  onDateChange,
  onNextDay,
  onToday,
  minDate,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">Gestión de Canchas de Fútbol 11</h2>
        <p className="text-xs mt-0.5 capitalize font-medium text-emerald-600 dark:text-emerald-400">
          📅 {formatLocalDate(selectedDate)}
        </p>
      </div>

      {/* Controles de Fecha */}
      <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
        
        <button
          onClick={onToday}
          className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-xs font-bold shadow-sm hover:bg-emerald-100 cursor-pointer"
        >
          Hoy
        </button>

        <button
          onClick={onNextDay}
          className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-xs font-bold shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer text-slate-700 dark:text-slate-200"
          title="Día siguiente"
        >
          Día Sig. ▶
        </button>

        {/* Input de fecha nativo activado */}
        <input
          type="date"
          value={selectedDate}
          min={minDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium cursor-pointer text-slate-700 dark:text-slate-200"
          title="Seleccionar fecha"
        />
      </div>
    </div>
  );
};