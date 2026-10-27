import type { Tournament } from '../types';

export const INITIAL_TOURNAMENTS: Tournament[] = [
  {
    id: 't1',
    title: 'Copa Apertura La Deolinda 2026',
    category: ['libre'],
    sport: 'futbol_7',
    status: 'abierto',
    startDate: '2026-09-01',
    registrationFee: 45000,
    maxTeams: 12,
    registeredTeamsCount: 4,
    rules: 'Partidos de 2 tiempos de 25 minutos.',
    standings: [
      { teamId: 'eq1', teamName: 'Los Magos FC', played: 4, won: 3, drawn: 1, lost: 0, goalsFor: 12, goalsAgainst: 4, goalDifference: 8, points: 10 },
      { teamId: 'eq2', teamName: 'Deportivo Tapitas', played: 4, won: 2, drawn: 2, lost: 0, goalsFor: 9, goalsAgainst: 5, goalDifference: 4, points: 8 },
    ],
    matches: [
      { id: 'm1', tournamentId: 't1', round: 1, homeTeamId: 'eq1', homeTeamName: 'Los Magos FC', awayTeamId: 'eq2', awayTeamName: 'Deportivo Tapitas', homeGoals: 2, awayGoals: 2, date: '2026-09-05', time: '18:00', pitchName: 'Cancha 1 (Sintético)', status: 'finished' }
    ],
    topScorers: [
      { id: 'p1', playerName: 'Mateo Rossi', teamName: 'Los Magos FC', goals: 6 }
    ]
  },
  {
    id: 't2',
    title: 'Torneo Relámpago F5 Nocturno',
    category: ['libre'],
    sport: 'futbol_5',
    status: 'abierto',
    startDate: '2026-10-01',
    registrationFee: 20000,
    maxTeams: 8,
    registeredTeamsCount: 5,
    rules: 'Partidos eliminatorios de 40 minutos.',
    standings: [],
    matches: [],
    topScorers: []
  }
];