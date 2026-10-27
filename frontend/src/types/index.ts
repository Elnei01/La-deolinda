// ==========================================
// 1. CANCHAS Y RESERVAS
// ==========================================
export type FieldType = 'F5' | 'F6' | 'F7' | 'F8' | 'F11';

export interface Field {
  id: string;
  name: string; // Ej: "Cancha 1 - Sintético"
  type: FieldType;
  pricePerHour: number;
  isAvailable: boolean;
}

export interface Booking {
  id: string;
  fieldId: string;
  customerName: string;
  customerPhone: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  depositPaid: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

// ==========================================
// 2. BUFFET Y STOCK
// ==========================================
export type ProductCategory = 'drinks' | 'food' | 'apparel' | 'accessories';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  costPrice: number;
  salePrice: number;
  stock: number;
  minStockAlert: number;
  sizes?: string[]; // Ej: ['S', 'M', 'L', 'XL']
  imageUrl?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}

// ==========================================
// 3. TORNEOS Y LIGAS (Estructura Unificada)
// ==========================================
export type TournamentStatus = 'draft' | 'abierto' | 'in_progress' | 'completed';
export type TournamentCategory = 'libre' | 'femenino' | 'veteranos_35' | 'empresarial';
export type SportType = 'futbol_5' | 'futbol_6' | 'futbol_7' | 'futbol_8' | 'futbol_11';

export interface Team {
  id: string;
  name: string;
  logoUrl?: string;
  captainName: string;
  captainPhone: string;
}

export interface TeamStanding {
  teamId: string;
  teamName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface Match {
  id: string;
  tournamentId: string;
  round: number; // Número de fecha (ej: 1 para Fecha 1)
  homeTeamId: string;
  homeTeamName: string;
  awayTeamId: string;
  awayTeamName: string;
  homeGoals?: number;
  awayGoals?: number;
  date: string;
  time: string;
  pitchName: string;
  status: 'scheduled' | 'live' | 'finished';
}

export interface TopScorer {
  id: string;
  playerName: string;
  teamName: string;
  goals: number;
}

export interface Tournament {
  id: string;
  title: string;
  sport: string;
  status: 'abierto' | 'en_curso' | 'finalizado';
  maxTeams: number;
  registeredTeamsCount: number;
  registrationFee: number;
  startDate: string;
  rules?: string;
  standings: Standing[];
  matches: Match[];
  topScorers: TopScorer[];
  category?:string[];
  teams?: any[]; // <-- Añade esto para almacenar los equipos completos con sus jugadores
  registrationDeadline?: string;
}

export interface Standing {
  teamId: string;
  teamName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

// Entidad Jugador
export interface Player {
  id: string;
  fullName: string;
  dni: string;
  phone: string;
  shirtNumber?: number;
  isCaptain?: boolean;
}

// Extensión de Equipo para incluir a su plantilla
export interface Team {
  id: string;
  name: string;
  logoUrl?: string;
  captainName: string;
  captainPhone: string;
  players: Player[]; // Lista de jugadores inscritos
}

// Solicitud de Inscripción (Pendiente / Aprobada / Rechazada)
export type RequestStatus = 'pending' | 'approved' | 'rejected';

export interface RegistrationRequest {
  id: string;
  tournamentId: string;
  team: Team;
  submittedAt: string; // YYYY-MM-DD HH:mm
  status: RequestStatus;
  responseMessage?: string; // Nota opcional del Admin (ej: "Aprobado tras pago de seña")
}
