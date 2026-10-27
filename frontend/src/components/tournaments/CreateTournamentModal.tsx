import React, { useState } from 'react';
import type { TournamentCategory, SportType, Tournament } from '../../types';

interface CreateTournamentModalProps {
  onClose: () => void;
  onSubmit: (newTournament: Omit<Tournament, 'id' | 'registeredTeamsCount' | 'standings' | 'matches' | 'topScorers'>) => void;
}

export const CreateTournamentModal: React.FC<CreateTournamentModalProps> = ({
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TournamentCategory>('libre');
  const [sport, setSport] = useState<SportType>('futbol_7');
  const [startDate, setStartDate] = useState('');
  const [registrationDeadline, setRegistrationDeadline] = useState(''); // <-- Nuevo estado para fecha límite
  const [registrationFee, setRegistrationFee] = useState<number>(30000);
  const [maxTeams, setMaxTeams] = useState<number>(10);
  const [rules, setRules] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !startDate) return;

    onSubmit({
      title,
      category:[category],
      sport,
      status: 'abierto',
      startDate,
      registrationDeadline, // <-- Se incluye al enviar
      registrationFee,
      maxTeams,
      rules: rules || 'Reglamento estándar de La Deolinda Complejo Deportivo.',
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl border border-slate-200 dark:border-slate-700">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Crear Nuevo Torneo</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configura los parámetros iniciales para habilitar inscripciones.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Nombre del Torneo
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Liga Nocturna Clausura 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Deporte / Cancha</label>
              <select
                value={sport}
                onChange={(e) => setSport(e.target.value as SportType)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
              >
                <option value="futbol_5">Fútbol 5</option>
                <option value="futbol_6">Fútbol 6</option>
                <option value="futbol_7">Fútbol 7</option>
                <option value="futbol_8">Fútbol 8</option>
                <option value="futbol_11">Fútbol 11</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Categoría</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TournamentCategory)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
              >
                <option value="libre">Libre</option>
                <option value="femenino">Femenino</option>
                <option value="veteranos_35">Veteranos +35</option>
                <option value="empresarial">Empresarial</option>
              </select>
            </div>
          </div>

          {/* Fechas de inicio y límite de inscripción */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Inicio del Torneo</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Cierre de Inscripción</label>
              <input
                type="date"
                value={registrationDeadline}
                onChange={(e) => setRegistrationDeadline(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Inscripción ($)</label>
              <input
                type="number"
                min="0"
                value={registrationFee}
                onChange={(e) => setRegistrationFee(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Cupo Equipos</label>
              <input
                type="number"
                min="2"
                value={maxTeams}
                onChange={(e) => setMaxTeams(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Reglamento o Notas
            </label>
            <textarea
              rows={3}
              placeholder="Describa tiempos de juego, premios o formato de clasificación..."
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              Publicar Torneo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};