import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

// Formatea una fecha "YYYY-MM-DD" a texto legible en español (Ej: "Martes, 22 de Septiembre de 2026")
export const formatLocalDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });
  } catch {
    return dateString;
  }
};

// Obtiene la fecha actual en formato "YYYY-MM-DD"
export const getTodayString = (): string => {
  return format(new Date(), 'yyyy-MM-dd');
};