import React from 'react';
import type { RegistrationRequest } from '../../types';

interface TeamStatusCardProps {
  request: RegistrationRequest;
}

export const TeamStatusCard: React.FC<TeamStatusCardProps> = ({ request }) => {
  const getStatusStyles = () => {
    switch (request.status) {
      case 'approved':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800',
          title: 'text-emerald-900 dark:text-emerald-300',
          badge: 'Aprobado',
          badgeBg: 'bg-emerald-600 text-white'
        };
      case 'rejected':
        return {
          bg: 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800',
          title: 'text-rose-900 dark:text-rose-300',
          badge: 'Rechazado',
          badgeBg: 'bg-rose-600 text-white'
        };
      default:
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800',
          title: 'text-amber-900 dark:text-amber-300',
          badge: 'En Revisión',
          badgeBg: 'bg-amber-500 text-white'
        };
    }
  };

  const style = getStatusStyles();

  return (
    <div className={`p-4 rounded-2xl border ${style.bg} space-y-2`}>
      <div className="flex justify-between items-center">
        <h4 className={`text-sm font-bold ${style.title}`}>
          Estado de Inscripción: {request.team.name}
        </h4>
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${style.badgeBg}`}>
          {style.badge}
        </span>
      </div>

      {request.responseMessage && (
        <p className="text-xs text-slate-700 dark:text-slate-300 bg-white/50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
          <span className="font-bold">Mensaje de la organización:</span> {request.responseMessage}
        </p>
      )}
    </div>
  );
};