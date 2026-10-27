import { useState } from 'react';
import type { Tournament, Match, Standing, RegistrationRequest } from '../types';

export const useTournament = (initialTournaments: Tournament[], initialRequests: RegistrationRequest[] = []) => {
  const [tournaments, setTournaments] = useState<Tournament[]>(initialTournaments);
  const [selectedTournament, setSelectedTournament] = useState<Tournament>(initialTournaments[0]);
  const [requests, setRequests] = useState<RegistrationRequest[]>(initialRequests);

  const recalculateStandings = (matches: Match[], currentStandings: Standing[]): Standing[] => {
    return currentStandings
      .map(standing => {
        const teamMatches = matches.filter(
          m => m.status === 'finished' && (m.homeTeamId === standing.teamId || m.awayTeamId === standing.teamId)
        );

        let won = 0, drawn = 0, lost = 0, goalsFor = 0, goalsAgainst = 0;

        teamMatches.forEach(m => {
          const isHome = m.homeTeamId === standing.teamId;
          const gf = isHome ? (m.homeGoals ?? 0) : (m.awayGoals ?? 0);
          const ga = isHome ? (m.awayGoals ?? 0) : (m.homeGoals ?? 0);

          goalsFor += gf;
          goalsAgainst += ga;

          if (gf > ga) won++;
          else if (gf === ga) drawn++;
          else lost++;
        });

        return {
          ...standing,
          played: teamMatches.length,
          won,
          drawn,
          lost,
          goalsFor,
          goalsAgainst,
          goalDifference: goalsFor - goalsAgainst,
          points: won * 3 + drawn,
        };
      })
      .sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference);
  };

  const updateMatchScore = (matchId: string, homeGoals: number, awayGoals: number) => {
    const updatedMatches = selectedTournament.matches.map(m =>
      m.id === matchId ? { ...m, homeGoals, awayGoals, status: 'finished' as const } : m
    );

    const newStandings = recalculateStandings(updatedMatches, selectedTournament.standings);
    const updatedTournament = { ...selectedTournament, matches: updatedMatches, standings: newStandings };

    setSelectedTournament(updatedTournament);
    setTournaments(prev => prev.map(t => (t.id === updatedTournament.id ? updatedTournament : t)));
  };

  // Guarda la solicitud con estado 'pending' y asegura un ID para el equipo
  const registerTeam = (registrationData: Omit<RegistrationRequest, 'id' | 'submittedAt' | 'status'>) => {
    const newRequest: RegistrationRequest = {
      ...registrationData,
      team: {
        ...registrationData.team,
        id: `team_${Date.now()}`, // <--- Generamos un ID único para el equipo aquí
      },
      id: `req_${Date.now()}`,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    setRequests(prev => [...prev, newRequest]);
  };

  // Aprueba la solicitud y agrega el equipo a la tabla de posiciones del torneo
  const approveRequest = (requestId: string) => {
    const targetRequest = requests.find(r => r.id === requestId);
    if (!targetRequest) return;

    setRequests(prev =>
      prev.map(r => (r.id === requestId ? { ...r, status: 'approved' } : r))
    );

    const newStanding: Standing = {
      teamId: targetRequest.team.id,
      teamName: targetRequest.team.name,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    };

    setTournaments(prev =>
      prev.map(t => {
        if (t.id === targetRequest.tournamentId) {
          const currentTeams = t.teams || [];
          const updatedTournament = {
            ...t,
            registeredTeamsCount: t.registeredTeamsCount + 1,
            standings: [...t.standings, newStanding],
            teams: [...currentTeams, targetRequest.team], // <-- Guardamos el equipo completo con sus jugadores aquí
          };
          if (t.id === selectedTournament.id) {
            setSelectedTournament(updatedTournament);
          }
          return updatedTournament;
        }
        return t;
      })
    );
  };

  // Rechaza la solicitud de inscripción
  const rejectRequest = (requestId: string) => {
    setRequests(prev =>
      prev.map(r => (r.id === requestId ? { ...r, status: 'rejected' } : r))
    );
  };

  const createTournament = (newTData: Omit<Tournament, 'id' | 'registeredTeamsCount' | 'standings' | 'matches' | 'topScorers'>) => {
    const newTournament: Tournament = {
      ...newTData,
      id: `t_${Date.now()}`,
      registeredTeamsCount: 0,
      standings: [],
      matches: [],
      topScorers: [],
    };

    setTournaments(prev => [...prev, newTournament]);
    setSelectedTournament(newTournament);
  };

  return {
    tournaments,
    selectedTournament,
    setSelectedTournament,
    requests,
    updateMatchScore,
    registerTeam,
    approveRequest,
    rejectRequest,
    createTournament,
  };
};

