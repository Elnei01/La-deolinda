import React from 'react';
import type { Tournament } from '../../types';
import { getTournamentStatusLabel, getSportLabel } from '../../utils/formatters';

interface TournamentCardProps {
  tournament: Tournament;
  onSelect: (tournament: Tournament) => void;
}

export const getBadgeColor = (status: 'abierto' | 'en_curso' | 'finalizado' | string) => {
  switch (status) {
    case 'en_curso':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    case 'finalizado':
      return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
    case 'abierto':
    default:
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
  }
};

export const TournamentCard: React.FC<TournamentCardProps> = ({ tournament, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect(tournament)}
      className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer space-y-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
          {getSportLabel(tournament.sport as any)}
        </span>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${getBadgeColor(tournament.status)}`}>
          {getTournamentStatusLabel(tournament.status as any)}
        </span>
      </div>

      <div>
        <h4 className="text-base font-bold text-slate-900 dark:text-white">{tournament.title}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Inicia: {tournament.startDate}
        </p>
      </div>

      <div className="pt-2 border-t border-slate-100 dark:border-slate-700/50 flex justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>Equipos: {tournament.registeredTeamsCount} / {tournament.maxTeams}</span>
        <span>Inscripción: ${tournament.registrationFee.toLocaleString()}</span>
      </div>
    </div>
  );
};