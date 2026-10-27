export type SportType = 'futbol_11' | 'futbol_7' | 'futbol_5' | 'futbol_6' | 'futbol_8' ; // Por si en el complejo también hay auxiliares, pero centrado en F11

export interface Court {
  id: string;
  name: string; // Ej: "Cancha Principal (Cesped Natural)", "Cancha Auxiliar"
  sportType: SportType;
  pricePerHour: number;
}

export interface Reservation {
  id: string;
  courtId: string;
  date: string; // Formato "YYYY-MM-DD"
  startTime: string; // Ej: "18:00"
  endTime: string; // Ej: "20:00" (Los partidos de F11 suelen durar 1h30 o 2h)
  clientName: string;
  clientPhone: string;
  paymentMethod: 'caja' | 'pendiente'; // Pago presencial por caja o por cobrar en mostrador
  status: 'reservada' | 'pagada' | 'cancelada';
  totalAmount: number;
}