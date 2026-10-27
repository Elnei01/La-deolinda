import type { RegistrationRequest } from '../types';

export const MOCK_REGISTRATION_REQUESTS: RegistrationRequest[] = [
  {
    id: 'req_101',
    tournamentId: 't1',
    submittedAt: '2026-09-06 18:30',
    status: 'pending',
    team: {
      id: 'team_201',
      name: 'Los Rayos FC',
      captainName: 'Carlos Gómez',
      captainPhone: '1122334455',
      players: [
        { id: 'p1', fullName: 'Carlos Gómez', dni: '38123456', phone: '1122334455', shirtNumber: 10, isCaptain: true },
        { id: 'p2', fullName: 'Gonzalo Pérez', dni: '40123987', phone: '1199887766', shirtNumber: 1 },
        { id: 'p3', fullName: 'Mariano López', dni: '39555444', phone: '1144556677', shirtNumber: 7 }
      ]
    }
  }
];