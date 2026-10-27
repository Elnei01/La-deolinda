import React, { useState } from 'react';
import type { RegistrationRequest, Tournament } from '../../types';
import { exportTournamentTeamsToExcel } from '../../utils/exportUtils';

interface TeamApprovalModalProps {
  request?: RegistrationRequest;
  tournament?: Tournament; // <-- Añadido opcional para mostrar datos del torneo
  onClose: () => void;
  onApprove: (requestId: string, message: string) => void;
  onReject: (requestId: string, reason: string) => void;
}

export const TeamApprovalModal: React.FC<TeamApprovalModalProps> = ({
  request,
  tournament,
  onClose,
  onApprove,
  onReject,
}) => {
  const [responseMessage, setResponseMessage] = useState('');

  if (!request || !request.team) {
    return null; 
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-xl w-full space-y-4 border border-slate-200 dark:border-slate-700 shadow-xl">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Solicitud de Inscripción: {request.team.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Capitán: {request.team.captainName} ({request.team.captainPhone})
              {tournament?.registrationDeadline && (
                <span className="ml-2 text-amber-600 dark:text-amber-400 font-medium">
                  • Cierre Inscripción: {tournament.registrationDeadline}
                </span>
              )}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {tournament && tournament.teams && tournament.teams.length > 0 && (
              <button
                type="button"
                onClick={() => exportTournamentTeamsToExcel(tournament.title, tournament.teams ?? [])}
                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm flex items-center gap-1 cursor-pointer"
                title="Descargar planteles en Excel"
              >
                📊 Excel
              </button>
            )}
            <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2.5 py-1 rounded-lg">
              Pendiente
            </span>
          </div>
        </div>

        {/* Lista de Jugadores */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Plantilla Presentada ({request.team.players?.length || 0} Jugadores)
          </h4>
          <div className="max-h-40 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-700">
            {request.team.players?.map((player) => (
              <div key={player.id} className="p-2.5 flex justify-between items-center text-xs text-slate-800 dark:text-slate-200">
                <div>
                  <span className="font-semibold">{player.fullName}</span> {player.isCaptain && <span className="text-emerald-500 font-bold">(C)</span>}
                  <span className="text-slate-400 block text-[10px]">DNI: {player.dni}</span>
                </div>
                <span className="bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded font-mono text-[11px]">
                  #{player.shirtNumber || 'N/A'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Nota o Respuesta */}
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
            Mensaje para el Capitán/Equipo (Opcional)
          </label>
          <textarea
            rows={2}
            value={responseMessage}
            onChange={(e) => setResponseMessage(e.target.value)}
            placeholder="Ej: Solicitud aprobada. Por favor abonar la seña antes del viernes."
            className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl cursor-pointer"
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={() => onReject(request.id, responseMessage || 'Solicitud rechazada por la administración.')}
            className="px-4 py-2 text-xs font-bold bg-rose-600 text-white rounded-xl hover:bg-rose-700 cursor-pointer shadow-md shadow-rose-600/20"
          >
            Rechazar Equipo
          </button>
          <button
            type="button"
            onClick={() => onApprove(request.id, responseMessage || '¡Inscripción aprobada con éxito!')}
            className="px-4 py-2 text-xs font-bold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 cursor-pointer shadow-md shadow-emerald-600/20"
          >
            Aceptar Equipo
          </button>
        </div>
      </div>
    </div>
  );
};