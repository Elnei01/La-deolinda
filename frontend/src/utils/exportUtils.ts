import * as XLSX from 'xlsx';

export const exportTournamentTeamsToExcel = (tournamentName: string, teams: any[]) => {
  const excelData: any[] = [];

  if (!teams || !Array.isArray(teams) || teams.length === 0) {
    alert('No hay equipos registrados para exportar en este torneo.');
    return;
  }

  // Ordenar equipos alfabéticamente por nombre
  const sortedTeams = [...teams].sort((a, b) => (a.name || '').localeCompare(b.name || ''));

  sortedTeams.forEach((team, teamIndex) => {
    const players = team.players || [];
    
    if (players.length === 0) {
      excelData.push({
        'Equipo': team.name || 'Sin nombre',
        'Capitán': team.captainName || '-',
        'Teléfono Capitán': team.captainPhone || '-',
        'Nº Dorsal': '-',
        'Jugador': 'Sin jugadores inscriptos',
        'DNI': '-',
      });
    } else {
      players.forEach((player: any, index: number) => {
        excelData.push({
          'Equipo': index === 0 ? (team.name || 'Sin nombre') : '',
          'Capitán': index === 0 ? (team.captainName || '-') : '',
          'Teléfono Capitán': index === 0 ? (team.captainPhone || '-') : '',
          'Nº Dorsal': player.shirtNumber || '-',
          'Jugador': player.fullName || '-',
          'DNI': player.dni || '-',
        });
      });
    }

    // Agregar una fila en blanco (separadora) DESPUÉS de cada equipo, 
    // excepto después del último equipo de la lista
    if (teamIndex < sortedTeams.length - 1) {
      excelData.push({
        'Equipo': '--------------------',
        'Capitán': '--------------------',
        'Teléfono Capitán': '--------------------',
        'Nº Dorsal': '-----',
        'Jugador': '----------------------------------------',
        'DNI': '------------',
      });
    }
  });

  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Equipos Inscriptos');

  const safeFileName = (tournamentName || 'Torneo').replace(/[^a-zA-Z0-9]/g, '_');
  XLSX.writeFile(workbook, `Equipos_${safeFileName}.xlsx`);
};