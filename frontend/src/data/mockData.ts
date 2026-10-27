import type { Booking, Field, Product, Tournament } from '../types';

// Canchas disponibles en el complejo
export const MOCK_FIELDS: Field[] = [
  { id: 'f1', name: 'Cancha 1 (Sintético techado)', type: 'F5', pricePerHour: 18000, isAvailable: true },
  { id: 'f2', name: 'Cancha 2 (Sintético)', type: 'F6', pricePerHour: 22000, isAvailable: true },
  { id: 'f3', name: 'Cancha 3 (Césped Natural)', type: 'F7', pricePerHour: 26000, isAvailable: true },
  { id: 'f4', name: 'Cancha Principal (Césped Sintético)', type: 'F8', pricePerHour: 32000, isAvailable: true },
  { id: 'f5', name: 'Estadio Central (Césped Natural)', type: 'F11', pricePerHour: 50000, isAvailable: false },
];

// Reservas de turnos
export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    fieldId: 'f1',
    customerName: 'Lucas González',
    customerPhone: '1134567890',
    date: '2026-09-07',
    startTime: '19:00',
    endTime: '20:00',
    depositPaid: 5000,
    totalPrice: 18000,
    status: 'confirmed',
  },
  {
    id: 'b2',
    fieldId: 'f4',
    customerName: 'Martín Palermo',
    customerPhone: '1187654321',
    date: '2026-09-07',
    startTime: '21:00',
    endTime: '22:00',
    depositPaid: 10000,
    totalPrice: 32000,
    status: 'pending',
  },
];

// Productos para la sección Buffet/Stock
export const MOCK_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Agua Mineral 500ml', category: 'drinks', costPrice: 400, salePrice: 1000, stock: 45, minStockAlert: 10 },
  { id: 'p2', name: 'Bebida Isotónica 600ml', category: 'drinks', costPrice: 800, salePrice: 1800, stock: 20, minStockAlert: 5 },
  { id: 'p3', name: 'Hamburguesa Completa', category: 'food', costPrice: 1500, salePrice: 3800, stock: 15, minStockAlert: 5 },
  { id: 'p4', name: 'Camiseta Complejo L', category: 'apparel', costPrice: 4500, salePrice: 12000, stock: 8, minStockAlert: 2, sizes: ['S', 'M', 'L', 'XL'] },
];

// Torneos y Ligas
export const MOCK_TOURNAMENTS: Tournament[] = [
  {
    id: 't1',
    title: 'Copa Clausura La Deolinda 2026',
    category: ['libre'],
    sport: 'futbol_7',
    status: 'en_curso',
    startDate: '2026-08-15',
    registrationFee: 45000,
    maxTeams: 8,
    registeredTeamsCount: 6,
    rules: 'Partidos de 2 tiempos de 25 min. Calzado permitido: Zapatillas de papi o tapones de goma.',
    standings: [
      { teamId: 'eq1', teamName: 'Los Magos FC', played: 3, won: 3, drawn: 0, lost: 0, goalsFor: 10, goalsAgainst: 2, goalDifference: 8, points: 9 },
      { teamId: 'eq2', teamName: 'LaSub21', played: 3, won: 2, drawn: 0, lost: 1, goalsFor: 7, goalsAgainst: 4, goalDifference: 3, points: 6 },
      { teamId: 'eq3', teamName: 'Deportivo Tapitas', played: 3, won: 1, drawn: 0, lost: 2, goalsFor: 4, goalsAgainst: 6, goalDifference: -2, points: 3 },
      { teamId: 'eq4', teamName: 'Sintético FC', played: 3, won: 0, drawn: 0, lost: 3, goalsFor: 1, goalsAgainst: 10, goalDifference: -9, points: 0 },
    ],
    matches: [
      { id: 'm1', tournamentId: 't1', round: 1, homeTeamId: 'eq1', homeTeamName: 'Los Magos FC', awayTeamId: 'eq2', awayTeamName: 'LaSub21', homeGoals: 3, awayGoals: 1, date: '2026-08-20', time: '20:00', pitchName: 'Cancha 3', status: 'finished' },
      { id: 'm2', tournamentId: 't1', round: 2, homeTeamId: 'eq3', homeTeamName: 'Deportivo Tapitas', awayTeamId: 'eq4', awayTeamName: 'Sintético FC', homeGoals: 2, awayGoals: 0, date: '2026-08-27', time: '21:00', pitchName: 'Cancha 3', status: 'finished' },
      { id: 'm3', tournamentId: 't1', round: 3, homeTeamId: 'eq1', homeTeamName: 'Los Magos FC', awayTeamId: 'eq3', awayTeamName: 'Deportivo Tapitas', homeGoals: 0, awayGoals: 0, date: '2026-09-10', time: '20:00', pitchName: 'Cancha 3', status: 'scheduled' },
    ],
    topScorers: [
      { id: 'g1', playerName: 'Mateo Rossi', teamName: 'Los Magos FC', goals: 5 },
      { id: 'g2', playerName: 'Joaquín Silva', teamName: 'LaSub21', goals: 4 },
    ],
  },
  {
    id: 't2',
    title: 'Torneo Nocturno F5',
    category: ['empresarial'],
    sport: 'futbol_5',
    status: 'abierto',
    startDate: '2026-10-01',
    registrationFee: 25000,
    maxTeams: 12,
    registeredTeamsCount: 4,
    rules: 'Cancha de césped sintético. Partidos eliminatorios directos.',
    standings: [],
    matches: [],
    topScorers: [],
  },
];