import type { TournamentStatus, SportType } from '../types';

/**
 * Traduce el estado técnico del torneo a un formato legible para el usuario final.
 */
export const getTournamentStatusLabel = (status: TournamentStatus): string => {
  const statusMap: Record<TournamentStatus, string> = {
    draft: 'Borrador',
    abierto: 'Inscripción Abierta',
    in_progress: 'En Progreso',
    completed: 'Finalizado',
  };

  return statusMap[status] || status;
};

/**
 * Mapea el tipo de deporte/cancha a un nombre descriptivo.
 */
export const getSportLabel = (sport: SportType): string => {
  const sportMap: Record<SportType, string> = {
    futbol_5: 'Fútbol 5',
    futbol_6: 'Fútbol 6',
    futbol_7: 'Fútbol 7',
    futbol_8: 'Fútbol 8',
    futbol_11: 'Fútbol 11',
  };

  return sportMap[sport] || sport;
};