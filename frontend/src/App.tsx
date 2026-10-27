import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeProvider';
import { Navbar, type NavSection, type UserRole } from './components/layout/Navbar';
import { HomeSection } from './components/home/HomeSection'; // <--- Importamos la vista separada
import { TournamentsSection } from './components/tournaments/TournamentsSection';
import { CourtBookingSection } from './components/reservations/CourtBookingSection';

export const AppContent: React.FC = () => {
  const [activeSection, setActiveSection] = useState<NavSection>('home');
  const [currentRole, setCurrentRole] = useState<UserRole>('cliente');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navbar
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 1. Vista de Inicio (Home) */}
        {activeSection === 'home' && (
  <HomeSection onSelectSection={setActiveSection} />
)}

        {/* 2. Vista de Reservas de Canchas */}
        {activeSection === 'bookings' && (
          <CourtBookingSection userRole={currentRole} />
        )}

        {/* 3. Vista de Buffet & Tienda */}
        {activeSection === 'buffet' && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h1 className="text-2xl font-bold mb-2">🍔 Buffet & Tienda</h1>
            <p className="text-slate-600 dark:text-slate-300 text-xs">
              Próximamente: gestión de stock, consumos de cantina y la futura integración de facturación con ARCA.
            </p>
          </div>
        )}

        {/* 4. Vista de Torneos */}
        {activeSection === 'tournaments' && (
          <TournamentsSection currentRole={currentRole} />
        )}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}