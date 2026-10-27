import React from 'react';
import type { Match } from '../../types';
import type { UserRole } from '../layout/Navbar';

interface MatchCardProps {
  match: Match;
  currentRole: UserRole;
  onEditScore?: (match: Match) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, currentRole, onEditScore }) => {
  const canEdit = currentRole === 'empleado' || currentRole === 'admin';

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
      <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
        <span className="font-bold uppercase text-emerald-600 dark:text-emerald-400">Fecha {match.round}</span>
        <p>{match.date} - {match.time} hs ({match.pitchName})</p>
      </div>

      <div className="flex items-center justify-center gap-6 text-base font-bold my-2 md:my-0">
        <span className="w-36 text-right text-slate-800 dark:text-slate-200">{match.homeTeamName}</span>
        <div className="px-4 py-2 bg-slate-100 dark:bg-slate-900 rounded-xl font-mono text-lg border border-slate-200 dark:border-slate-700">
          {match.status === 'finished' ? `${match.homeGoals} - ${match.awayGoals}` : 'VS'}
        </div>
        <span className="w-36 text-left text-slate-800 dark:text-slate-200">{match.awayTeamName}</span>
      </div>

      <div className="flex justify-end">
        {canEdit && onEditScore && (
          <button
            onClick={() => onEditScore(match)}
            className="px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors cursor-pointer"
          >
            ✏️ Cargar Resultado
          </button>
        )}
      </div>
    </div>
  );
};