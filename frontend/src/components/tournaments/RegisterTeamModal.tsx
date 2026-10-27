import React, { useState, useEffect } from 'react';

interface PlayerInput {
  fullName: string;
  dni: string;
  shirtNumber: string;
}

interface RegisterTeamModalProps {
  tournamentId: string;
  onClose: () => void;
  onSubmit: (data: {
    tournamentId: string;
    team: {
      name: string;
      captainName: string;
      captainPhone: string;
      players: PlayerInput[];
    };
  }) => void;
  tournamentType?: string | number; 
  format?: string | number; 
  category?: string | number; 
  minPlayers?: number;
  maxPlayers?: number;
}

export const RegisterTeamModal: React.FC<RegisterTeamModalProps> = ({
  tournamentId,
  onClose,
  onSubmit,
  tournamentType = '7',
  format,
  category,
  minPlayers,
  maxPlayers,
}) => {
  // Detección centralizada de cualquier variante que mandes desde el componente padre
  const resolvedMinPlayers = minPlayers ?? (() => {
    const rawValue = tournamentType ?? format ?? category ?? 5;
    const stringVal = String(rawValue);
    
    const directNum = parseInt(stringVal, 10);
    if (!isNaN(directNum) && directNum > 0) return directNum;

    const match = stringVal.match(/\d+/);
    if (match) {
      const num = parseInt(match[0], 10);
      return isNaN(num) ? 5 : num;
    }
    return 5;
  })();

  const resolvedMaxPlayers = maxPlayers ?? (resolvedMinPlayers + 7);

  const [teamName, setTeamName] = useState('');
  const [captainName, setCaptainName] = useState('');
  const [captainPhone, setCaptainPhone] = useState('');
  const [error, setError] = useState('');
  
  // Inicializamos con el mínimo correcto detectado
  const [players, setPlayers] = useState<PlayerInput[]>(() =>
    Array.from({ length: resolvedMinPlayers }, () => ({ fullName: '', dni: '', shirtNumber: '' }))
  );

  // Sincronizamos la plantilla si los mínimos cambian o se abre con un torneo distinto
  useEffect(() => {
    setPlayers(prevPlayers => {
      if (prevPlayers.length >= resolvedMinPlayers) {
        return prevPlayers;
      }
      return Array.from({ length: resolvedMinPlayers }, (_, i) => 
        prevPlayers[i] || { fullName: '', dni: '', shirtNumber: '' }
      );
    });
  }, [resolvedMinPlayers]);

  const handleAddPlayer = () => {
    if (players.length >= resolvedMaxPlayers) {
      setError(`El número máximo de jugadores permitidos es ${resolvedMaxPlayers}.`);
      return;
    }
    setError('');
    setPlayers([...players, { fullName: '', dni: '', shirtNumber: '' }]);
  };

  const handleRemovePlayer = (index: number) => {
    if (players.length <= resolvedMinPlayers) {
      setError(`Se requiere un mínimo de ${resolvedMinPlayers} jugadores para este torneo.`);
      return;
    }
    setError('');
    setPlayers(players.filter((_, i) => i !== index));
  };

  const handlePlayerChange = (index: number, field: keyof PlayerInput, value: string) => {
    const updated = [...players];
    let sanitizedValue = value;

    if (field === 'dni') {
      sanitizedValue = value.replace(/\D/g, '').slice(0, 8);
    } else if (field === 'shirtNumber') {
      sanitizedValue = value.replace(/\D/g, '').slice(0, 2);
    } else if (field === 'fullName') {
      sanitizedValue = value.replace(/[0-9]/g, '');
    }

    updated[index] = {
      ...updated[index],
      [field]: sanitizedValue,
    };

    setPlayers(updated);
  };

  const handleTeamNameChange = (value: string) => {
    setTeamName(value);
  };

  const handleCaptainNameChange = (value: string) => {
    const sanitized = value.replace(/[0-9]/g, '');
    setCaptainName(sanitized);
  };

  const handleCaptainPhoneChange = (value: string) => {
    const sanitized = value.replace(/\D/g, '');
    setCaptainPhone(sanitized);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (players.length < resolvedMinPlayers) {
      setError(`Debes registrar al menos ${resolvedMinPlayers} jugadores.`);
      return;
    }

    const shirts = players.map(p => p.shirtNumber).filter(s => s !== '');
    const uniqueShirts = new Set(shirts);
    if (shirts.length !== uniqueShirts.size) {
      setError('Hay números de camiseta (dorsales) repetidos en la plantilla.');
      return;
    }

    const dnis = players.map(p => p.dni).filter(d => d !== '');
    const uniqueDnis = new Set(dnis);
    if (dnis.length !== uniqueDnis.size) {
      setError('Hay números de DNI repetidos en la plantilla.');
      return;
    }

    setError('');
    onSubmit({
      tournamentId,
      team: {
        name: teamName,
        captainName,
        captainPhone,
        players,
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-xl w-full space-y-4 border border-slate-200 dark:border-slate-700 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Inscribir Mi Equipo al Torneo</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Mínimo {resolvedMinPlayers} y máximo {resolvedMaxPlayers} jugadores.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold text-lg cursor-pointer">✕</button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium">
            ⚠️ {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">Nombre del Equipo</label>
              <input
                type="text"
                required
                value={teamName}
                onChange={(e) => handleTeamNameChange(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                placeholder="Ej: Los Amigos FC"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">Nombre del Capitán</label>
              <input
                type="text"
                required
                value={captainName}
                onChange={(e) => handleCaptainNameChange(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                placeholder="Ej: Juan Pérez"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">Teléfono de Contacto</label>
              <input
                type="tel"
                required
                value={captainPhone}
                onChange={(e) => handleCaptainPhoneChange(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                placeholder="Ej: 2645123456"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Plantilla ({players.length}/{resolvedMaxPlayers})
              </h4>
              {players.length < resolvedMaxPlayers && (
                <button
                  type="button"
                  onClick={handleAddPlayer}
                  className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-bold text-xs rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer"
                >
                  + Agregar Jugador
                </button>
              )}
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {players.map((player, index) => (
                <div key={index} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-slate-400 w-4">{index + 1}</span>
                  <input
                    type="text"
                    required
                    placeholder="Nombre y Apellido"
                    value={player.fullName}
                    onChange={(e) => handlePlayerChange(index, 'fullName', e.target.value)}
                    className="flex-1 p-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                  />
                  <input
                    type="text"
                    required
                    placeholder="DNI"
                    maxLength={8}
                    value={player.dni}
                    onChange={(e) => handlePlayerChange(index, 'dni', e.target.value)}
                    className="w-28 p-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white font-mono"
                  />
                  <input
                    type="text"
                    placeholder="Nº"
                    maxLength={2}
                    value={player.shirtNumber}
                    onChange={(e) => handlePlayerChange(index, 'shirtNumber', e.target.value)}
                    className="w-16 p-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white font-mono text-center"
                  />
                  {players.length > resolvedMinPlayers && (
                    <button
                      type="button"
                      onClick={() => handleRemovePlayer(index)}
                      className="text-rose-500 hover:text-rose-700 font-bold px-1.5 text-sm cursor-pointer"
                      title="Eliminar jugador"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 cursor-pointer shadow-md shadow-emerald-600/20"
            >
              Enviar Inscripción y Plantilla
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};