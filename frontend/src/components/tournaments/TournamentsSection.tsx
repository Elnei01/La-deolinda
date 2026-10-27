import React, { useState } from 'react';
import type { UserRole } from '../layout/Navbar';
import type { Match } from '../../types';
import { RegisterTeamModal } from './RegisterTeamModal';
import { CreateTournamentModal } from './CreateTournamentModal';
import { TeamApprovalModal } from './TeamApprovalModal';
import { MatchCard } from './MatchCard';
import { useTournament } from '../../hooks/useTournament';
import { INITIAL_TOURNAMENTS } from '../../data/tournamentsData';
import { exportTournamentTeamsToExcel } from '../../utils/exportUtils';

export const TournamentsSection: React.FC<{ currentRole: UserRole }> = ({ currentRole }) => {
  const {
    tournaments,
    selectedTournament,
    setSelectedTournament,
    requests,
    updateMatchScore,
    registerTeam,
    approveRequest,
    rejectRequest,
    createTournament,
  } = useTournament(INITIAL_TOURNAMENTS);

  const [activeTab, setActiveTab] = useState<'standings' | 'fixture' | 'scorers' | 'rules'>('standings');
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);

  // Filtrar solicitudes pendientes para el torneo seleccionado
  const pendingRequests = requests.filter(
    (r) => r.tournamentId === selectedTournament.id && r.status === 'pending'
  );

  return (
    <div className="space-y-6">
      {/* SECTOR DE CABECERA Y SELECCIÓN */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <select
              value={selectedTournament.id}
              onChange={(e) => {
                const found = tournaments.find(t => t.id === e.target.value);
                if (found) setSelectedTournament(found);
              }}
              className="text-xl font-bold bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-slate-900 dark:text-white cursor-pointer"
            >
              {tournaments.map(t => (
                <option key={t.id} value={t.id}>{t.title}</option>
              ))}
            </select>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 uppercase">
              {selectedTournament.sport.replace('_', ' ')}
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs">
            Cupos: {selectedTournament.registeredTeamsCount} / {selectedTournament.maxTeams} equipos | Estado:{' '}
            <strong className="capitalize">
              {selectedTournament.status === 'abierto' ? 'Abierto' : selectedTournament.status}
            </strong>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {currentRole === 'cliente' && selectedTournament.status === 'abierto' && (
            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md cursor-pointer transition-colors"
            >
              📝 Inscribir Mi Equipo
            </button>
          )}

          {/* Habilitado tanto para Admin como para Empleado */}
          {(currentRole === 'admin' || currentRole === 'empleado') && (
            <>
              <button
                onClick={() => {
                  const teamsToExport = selectedTournament.teams || [];
                  exportTournamentTeamsToExcel(selectedTournament.title, teamsToExport);
                }}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md cursor-pointer transition-colors flex items-center gap-2"
                title="Descargar listado de equipos y jugadores ordenados"
              >
                📊 Descargar Excel
              </button>

              <button
                onClick={() => setIsApprovalModalOpen(true)}
                className="relative px-4 py-2.5 bg-slate-700 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-md cursor-pointer transition-colors"
              >
                📋 Solicitudes Pendientes
                {pendingRequests.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-white dark:border-slate-800">
                    {pendingRequests.length}
                  </span>
                )}
              </button>
            </>
          )}

          {/* Crear torneo reservado para Admin (o puedes incluir 'empleado' si también lo requiere) */}
          {currentRole === 'admin' && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md cursor-pointer transition-colors"
            >
              ➕ Crear Torneo
            </button>
          )}
        </div>
      </div>

      {/* PESTAÑAS */}
      <div className="flex border-b border-slate-200 dark:border-slate-700 gap-2 overflow-x-auto">
        {[
          { id: 'standings', label: 'Tabla de Posiciones', icon: '🏆' },
          { id: 'fixture', label: 'Fixture & Resultados', icon: '📅' },
          { id: 'scorers', label: 'Goleadores', icon: '⚽' },
          { id: 'rules', label: 'Reglamento e Info', icon: '📜' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* RENDERIZADO DE VISTAS */}
      {activeTab === 'standings' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          {selectedTournament.standings.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              Aún no hay posiciones registradas para este torneo.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700 uppercase">
                  <tr>
                    <th className="p-3">Pos</th>
                    <th className="p-3">Equipo</th>
                    <th className="p-3 text-center">PJ</th>
                    <th className="p-3 text-center">PG</th>
                    <th className="p-3 text-center">PE</th>
                    <th className="p-3 text-center">PP</th>
                    <th className="p-3 text-center">GF</th>
                    <th className="p-3 text-center">GC</th>
                    <th className="p-3 text-center">DIF</th>
                    <th className="p-3 text-center font-extrabold text-slate-900 dark:text-white">PTS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {selectedTournament.standings.map((team, idx) => (
                    <tr key={team.teamId} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                      <td className="p-3 font-bold text-slate-400">{idx + 1}</td>
                      <td className="p-3 font-bold text-slate-900 dark:text-white">{team.teamName}</td>
                      <td className="p-3 text-center">{team.played}</td>
                      <td className="p-3 text-center">{team.won}</td>
                      <td className="p-3 text-center">{team.drawn}</td>
                      <td className="p-3 text-center">{team.lost}</td>
                      <td className="p-3 text-center">{team.goalsFor}</td>
                      <td className="p-3 text-center">{team.goalsAgainst}</td>
                      <td className="p-3 text-center font-mono">{team.goalDifference}</td>
                      <td className="p-3 text-center font-black text-emerald-600 dark:text-emerald-400 text-sm">{team.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'fixture' && (
        <div className="space-y-4">
          {selectedTournament.matches.length === 0 ? (
            <div className="p-8 text-center text-slate-500 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm">
              El fixture para este torneo aún no ha sido publicado.
            </div>
          ) : (
            selectedTournament.matches.map(match => (
              <MatchCard
                key={match.id}
                match={match}
                currentRole={currentRole}
                onEditScore={(m) => setEditingMatch(m)}
              />
            ))
          )}
        </div>
      )}

      {activeTab === 'scorers' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm p-4">
          {selectedTournament.topScorers.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              Aún no se registran goles en este torneo.
            </div>
          ) : (
            <div className="space-y-2">
              {selectedTournament.topScorers.map((scorer, index) => (
                <div key={scorer.id} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-400 text-xs">#{index + 1}</span>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{scorer.playerName}</p>
                      <p className="text-xs text-slate-500">{scorer.teamName}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold rounded-lg text-xs">
                    ⚽ {scorer.goals} Goles
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'rules' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4 text-sm">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Bases y Condiciones del Torneo</h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {selectedTournament.rules || 'Reglamento estándar de La Deolinda Complejo Deportivo.'}
          </p>
          <div className="pt-4 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-500 space-y-1">
            <p><strong>Precio Inscripción:</strong> ${selectedTournament.registrationFee.toLocaleString()}</p>
            <p><strong>Fecha de Inicio:</strong> {selectedTournament.startDate}</p>
            {selectedTournament.registrationDeadline && (
              <p><strong>Cierre de Inscripción:</strong> {selectedTournament.registrationDeadline}</p>
            )}
          </div>
        </div>
      )}

      {/* MODAL EDICIÓN MARCADOR */}
      {editingMatch && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Actualizar Marcador</h3>
            <p className="text-xs text-slate-500">Fecha {editingMatch.round} - {editingMatch.homeTeamName} vs {editingMatch.awayTeamName}</p>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const h = Number((form.elements.namedItem('homeG') as HTMLInputElement).value);
              const a = Number((form.elements.namedItem('awayG') as HTMLInputElement).value);
              updateMatchScore(editingMatch.id, h, a);
              setEditingMatch(null);
            }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">{editingMatch.homeTeamName}</label>
                  <input type="number" min="0" name="homeG" defaultValue={editingMatch.homeGoals ?? 0} className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 font-bold text-center text-slate-900 dark:text-white" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">{editingMatch.awayTeamName}</label>
                  <input type="number" min="0" name="awayG" defaultValue={editingMatch.awayGoals ?? 0} className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 font-bold text-center text-slate-900 dark:text-white" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setEditingMatch(null)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl cursor-pointer">Cancelar</button>
                <button type="submit" className="px-4 py-2 text-xs font-bold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 cursor-pointer">Guardar Marcador</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODALES EXTERNOS */}
      {isRegisterModalOpen && (
        <RegisterTeamModal
          tournamentId={selectedTournament.id}
          tournamentType={selectedTournament.sport}
          onClose={() => setIsRegisterModalOpen(false)}
          onSubmit={(data: any) => {
            registerTeam(data);
            setIsRegisterModalOpen(false);
          }}
        />
      )}

      {isCreateModalOpen && (
        <CreateTournamentModal
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={(data: any) => {
            createTournament(data);
            setIsCreateModalOpen(false);
          }}
        />
      )}

      {isApprovalModalOpen && (
        <TeamApprovalModal
          request={pendingRequests[0]}
          tournament={selectedTournament}
          onClose={() => setIsApprovalModalOpen(false)}
          onApprove={(requestId, _message) => {
            approveRequest(requestId);
            if (pendingRequests.length <= 1) {
              setIsApprovalModalOpen(false);
            }
          }}
          onReject={(requestId, _reason) => {
            rejectRequest(requestId);
            if (pendingRequests.length <= 1) {
              setIsApprovalModalOpen(false);
            }
          }}
        />
      )}
    </div>
  );
};