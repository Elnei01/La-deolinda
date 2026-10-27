import React, { useState } from 'react';
import type { Court, Reservation } from '../../types/reservation';
import { formatLocalDate, getTodayString } from '../../utils/dateUtils';
import { addDays, subDays, parseISO } from 'date-fns';
import { DatePickerControl } from '../common/DatePickerControl';

const INITIAL_COURTS: Court[] = [
  { id: 'c1', name: 'Cancha 1 - Principal', sportType: 'futbol_11', pricePerHour: 55000 },
  { id: 'c2', name: 'Cancha 2 - Auxiliar', sportType: 'futbol_8', pricePerHour: 48000 },
  { id: 'c3', name: 'Cancha 3 - Techada', sportType: 'futbol_7', pricePerHour: 40000 },
  { id: 'c4', name: 'Cancha 4 - Rápida', sportType: 'futbol_5', pricePerHour: 32000 },
  { id: 'c5', name: 'Cancha 5 - Polideportiva', sportType: 'futbol_6', pricePerHour: 36000 },
];

const TIME_SLOTS = [
  '14:00', '15:30', '17:00', '18:30', '20:00', '21:30', '23:00'
];

const SPORT_LABELS: Record<string, { label: string; icon: string }> = {
  todos: { label: 'Todas las canchas', icon: '🏟️' },
  futbol_11: { label: 'Fútbol 11', icon: '⚽' },
  futbol_8: { label: 'Fútbol 8', icon: '⚽' },
  futbol_7: { label: 'Fútbol 7', icon: '⚽' },
  futbol_6: { label: 'Fútbol 6', icon: '⚽' },
  futbol_5: { label: 'Fútbol 5', icon: '⚽' },
};

interface CourtBookingSectionProps {
  userRole?: 'cliente' | 'empleado' | 'admin';
}

export const CourtBookingSection: React.FC<CourtBookingSectionProps> = ({ userRole = 'cliente' }) => {
  const [courts, setCourts] = useState<Court[]>(INITIAL_COURTS);
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
  
  // Iniciamos en null para que NO muestre ninguna cancha por defecto al entrar
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [currentClientPhone] = useState<string>('2644123456');

  // Modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
  
  const [activeSlot, setActiveSlot] = useState<{ courtId: string; time: string } | null>(null);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState(currentClientPhone);
  const [paymentMethod, setPaymentMethod] = useState<'caja' | 'pendiente'>('caja');
  const [hoursCount, setHoursCount] = useState<number>(1);
  const [lastNotification, setLastNotification] = useState<string | null>(null);

  const [editingCourtPrice, setEditingCourtPrice] = useState<{ courtId: string; price: number } | null>(null);

  // Permisos basados exactamente en la prop global userRole
  const isAdmin = userRole === 'admin';
  const isStaff = userRole === 'empleado' || userRole === 'admin';

  const changeDateByDays = (days: number) => {
    const current = parseISO(selectedDate);
    const newDate = days > 0 ? addDays(current, days) : subDays(current, Math.abs(days));
    setSelectedDate(newDate.toISOString().split('T')[0]);
  };

  const getReservationForSlot = (courtId: string, time: string) => {
    return reservations.find(r => {
      if (r.courtId !== courtId || r.date !== selectedDate || r.status === 'cancelada') return false;
      
      const startIndex = TIME_SLOTS.indexOf(r.startTime);
      const currentIndex = TIME_SLOTS.indexOf(time);
      const duration = typeof r.endTime === 'number' ? r.endTime : parseInt(r.endTime) || 1;
      
      if (startIndex === -1 || currentIndex === -1) return false;
      
      return currentIndex >= startIndex && currentIndex < startIndex + duration;
    });
  };

  const handleSlotClick = (courtId: string, time: string) => {
    const existing = getReservationForSlot(courtId, time);
    if (existing) {
      if (isStaff) {
        setIsManageModalOpen(true);
      } else {
        alert('Este turno ya se encuentra ocupado.');
      }
      return;
    }
    setActiveSlot({ courtId, time });
    setClientName('');
    setClientPhone(currentClientPhone);
    setPaymentMethod('caja');
    setHoursCount(1);
    setIsModalOpen(true);
  };

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSlot) return;

    const startIndex = TIME_SLOTS.indexOf(activeSlot.time);
    for (let i = 0; i < hoursCount; i++) {
      const slotToCheck = TIME_SLOTS[startIndex + i];
      if (!slotToCheck || getReservationForSlot(activeSlot.courtId, slotToCheck)) {
        alert(`No es posible reservar por ${hoursCount} hora/s porque uno de los horarios intermedios ya está ocupado.`);
        return;
      }
    }

    const court = courts.find(c => c.id === activeSlot.courtId);
    const unitPrice = court ? court.pricePerHour : 0;
    const totalAmount = unitPrice * hoursCount;

    const newReservation: Reservation = {
      id: `res_${Date.now()}`,
      courtId: activeSlot.courtId,
      date: selectedDate,
      startTime: activeSlot.time,
      endTime: hoursCount as any, 
      clientName,
      clientPhone,
      paymentMethod,
      status: paymentMethod === 'caja' ? 'pagada' : 'reservada',
      totalAmount,
    };

    setReservations([...reservations, newReservation]);
    setIsModalOpen(false);
    setLastNotification(`Mensaje generado para ${clientName} (${clientPhone}) - Cancha: ${court?.name} (${hoursCount} hora/s)`);
    setActiveSlot(null);
  };

  const handleCancelReservation = (reservationId: string) => {
    if (!isStaff) return;

    if (confirm('¿Estás seguro de que deseas cancelar este turno?')) {
      setReservations(reservations.map(r => 
        r.id === reservationId ? { ...r, status: 'cancelada' as const } : r
      ));
    }
  };

  const handleUpdatePrice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourtPrice) return;

    setCourts(courts.map(c => 
      c.id === editingCourtPrice.courtId ? { ...c, pricePerHour: editingCourtPrice.price } : c
    ));
    setIsPriceModalOpen(false);
    setEditingCourtPrice(null);
  };

  const handleExtendHours = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReservation) return;

    const startIndex = TIME_SLOTS.indexOf(selectedReservation.startTime);
    
    for (let i = 0; i < hoursCount; i++) {
      const slotToCheck = TIME_SLOTS[startIndex + i];
      const occupant = getReservationForSlot(selectedReservation.courtId, slotToCheck);
      if (slotToCheck && occupant && occupant.id !== selectedReservation.id) {
        alert(`No se puede extender a ${hoursCount} hora/s porque el horario de las ${slotToCheck} hs ya está reservado.`);
        return;
      }
    }

    const court = courts.find(c => c.id === selectedReservation.courtId);
    const unitPrice = court ? court.pricePerHour : (selectedReservation.totalAmount / 1);
    const newTotal = unitPrice * hoursCount;

    setReservations(reservations.map(r => 
      r.id === selectedReservation.id 
        ? { ...r, endTime: hoursCount as any, totalAmount: newTotal } 
        : r
    ));

    setIsExtendModalOpen(false);
    setSelectedReservation(null);
    alert('Duración de la reserva actualizada con éxito.');
  };

  // Filtrado condicional: si no se seleccionó ningún botón, devuelve un array vacío (no muestra nada)
  const filteredCourts = selectedSport === null 
    ? [] 
    : selectedSport === 'todos' 
      ? courts 
      : courts.filter(c => c.sportType === selectedSport);

  const displayedReservations = reservations.filter(r => {
    if (r.date !== selectedDate || r.status === 'cancelada') return false;
    if (isStaff) return true;
    return r.clientPhone === currentClientPhone;
  });

  return (
    <div className="space-y-6">
      
      {/* Controles Principales */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          <div className="w-full lg:w-auto">
            <DatePickerControl
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              onNextDay={() => changeDateByDays(1)}
              onToday={() => setSelectedDate(getTodayString())}
              minDate={getTodayString()} 
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {isAdmin && (
              <button
                onClick={() => setIsPriceModalOpen(true)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition-all cursor-pointer flex items-center gap-2 shadow-sm"
              >
                <span>⚙️</span>
                <span>Configurar Precios por Hora</span>
              </button>
            )}

            {isStaff ? (
              <button
                onClick={() => setIsManageModalOpen(true)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600 transition-all cursor-pointer flex items-center gap-2 shadow-sm"
              >
                <span>📋</span>
                <span>Historial / Turnos del Día ({displayedReservations.length})</span>
              </button>
            ) : (
              <button
                onClick={() => setIsManageModalOpen(true)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-all cursor-pointer flex items-center gap-2 shadow-sm"
              >
                <span>📅</span>
                <span>Ver Mis Reservas ({displayedReservations.length})</span>
              </button>
            )}
          </div>

        </div>

        {/* Filtros de Categorías (Al hacer clic en uno, se muestran las canchas correspondientes) */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-700">
          {Object.entries(SPORT_LABELS).map(([key, { label, icon }]) => (
            <button
              key={key}
              onClick={() => setSelectedSport(key)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedSport === key
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/60 border border-slate-200/60 dark:border-slate-800'
              }`}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Notificación Bot WhatsApp */}
      {lastNotification && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-4 rounded-2xl flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-200 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-base">🤖</span>
            <div>
              <strong className="block font-bold">Bot de Confirmación Activo:</strong>
              <span>{lastNotification}</span>
            </div>
          </div>
          <button 
            onClick={() => setLastNotification(null)}
            className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 font-bold px-2 py-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Lista de Canchas (Se muestra solo si se seleccionó una categoría) */}
      <div className="space-y-4">
        {selectedSport === null ? (
          <div className="bg-white dark:bg-slate-800 p-16 text-center rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 shadow-sm">
            <div className="text-4xl">🏟️</div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-white">Selecciona una categoría arriba</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Haz clic en <strong className="text-emerald-600 dark:text-emerald-400">"Todas las canchas"</strong> o en cualquier modalidad de fútbol para ver los horarios y reservar.
            </p>
          </div>
        ) : filteredCourts.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-700">
            <p className="text-slate-400 text-sm">No hay canchas disponibles para la categoría seleccionada.</p>
          </div>
        ) : (
          filteredCourts.map(court => (
            <div 
              key={court.id} 
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-all hover:border-slate-300 dark:hover:border-slate-600"
            >
              <div className="px-5 py-4 bg-slate-50/70 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                    <span>{SPORT_LABELS[court.sportType]?.icon || '⚽'}</span>
                    {court.name}
                  </h4>
                  <span className="text-xs text-slate-500 capitalize">Modalidad: {court.sportType.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 font-medium">Valor por hora:</span>
                  <span className="text-xs font-mono font-bold px-3 py-1 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    ${court.pricePerHour.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="p-4 overflow-x-auto">
                <div className="flex gap-3 min-w-max">
                  {TIME_SLOTS.map(time => {
                    const reservation = getReservationForSlot(court.id, time);
                    return (
                      <div key={time} className="w-36 shrink-0">
                        {reservation ? (
                          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200 text-xs space-y-1.5 h-full flex flex-col justify-between">
                            <div>
                              <div className="font-mono font-bold text-[11px] text-rose-700 dark:text-rose-300 mb-1">
                                🕒 {time} hs ({reservation.endTime}h)
                              </div>
                              <div className="font-bold truncate" title={isStaff ? reservation.clientName : 'Ocupado'}>
                                🔴 {isStaff ? reservation.clientName : 'Ocupado'}
                              </div>
                            </div>

                            <div className="pt-1 border-t border-rose-200/50 dark:border-rose-900/50 flex items-center justify-between">
                              {isStaff && (
                                <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-mono font-bold ${
                                  reservation.status === 'pagada' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {reservation.status}
                                </span>
                              )}
                              <span className="text-[10px] text-rose-600 dark:text-rose-400 font-medium ml-auto">
                                Ocupado
                              </span>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleSlotClick(court.id, time)}
                            className="w-full p-3 rounded-xl border border-dashed border-emerald-300 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/10 text-emerald-700 dark:text-emerald-400 text-xs hover:bg-emerald-100/60 dark:hover:bg-emerald-900/30 transition-all cursor-pointer flex flex-col items-center justify-center gap-1 h-full shadow-sm"
                          >
                            <span className="font-mono font-bold text-[11px]">{time} hs</span>
                            <span className="font-bold text-[11px] flex items-center gap-1">
                              <span>🟢</span> Disponible
                            </span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Nueva Reserva */}
      {isModalOpen && activeSlot && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 border border-slate-200 dark:border-slate-700 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Registrar Reserva de Fútbol</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white font-bold text-lg cursor-pointer">✕</button>
            </div>

            <div className="text-xs bg-slate-50 dark:bg-slate-900 p-3 rounded-xl space-y-1 border border-slate-200 dark:border-slate-700">
              <p><strong className="text-slate-500">Fecha:</strong> <span className="capitalize">{formatLocalDate(selectedDate)}</span></p>
              <p><strong className="text-slate-500">Horario de Inicio:</strong> {activeSlot.time} hs</p>
              <p><strong className="text-slate-500">Cancha:</strong> {courts.find(c => c.id === activeSlot.courtId)?.name}</p>
              <p><strong className="text-slate-500">Valor por hora:</strong> ${(courts.find(c => c.id === activeSlot.courtId)?.pricePerHour || 0).toLocaleString()}</p>
            </div>

            <form onSubmit={handleConfirmReservation} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">Nombre del Capitán / Responsable</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                  placeholder="Ej: Marcos Acuña"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">Celular (para Bot de WhatsApp)</label>
                <input
                  type="tel"
                  required
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                  placeholder="Ej: 2644123456"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">Duración (Horas)</label>
                  <select
                    value={hoursCount}
                    onChange={(e) => setHoursCount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white font-bold"
                  >
                    <option value={1}>1 Hora</option>
                    <option value={2}>2 Horas</option>
                    <option value={3}>3 Horas</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">Método de Cobro</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as 'caja' | 'pendiente')}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="caja">💵 Caja</option>
                    <option value="pendiente">⏳ Pendiente</option>
                  </select>
                </div>
              </div>

              <div className="text-right text-xs pt-1 font-bold text-emerald-600 dark:text-emerald-400">
                Total a abonar: ${((courts.find(c => c.id === activeSlot.courtId)?.pricePerHour || 0) * hoursCount).toLocaleString()}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 cursor-pointer shadow-md shadow-emerald-600/20"
                >
                  Confirmar Reserva 🤖
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Configuración de Precios (Solo Admin) */}
      {isPriceModalOpen && isAdmin && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 border border-slate-200 dark:border-slate-700 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">⚙️ Actualizar Tarifas por Hora</h3>
              <button onClick={() => setIsPriceModalOpen(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white font-bold text-lg cursor-pointer">✕</button>
            </div>

            <div className="space-y-3">
              {courts.map(court => (
                <div key={court.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div>
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white">{court.name}</h5>
                    <span className="text-[10px] text-slate-500">Actual: ${court.pricePerHour.toLocaleString()} / hr</span>
                  </div>
                  <button
                    onClick={() => {
                      setEditingCourtPrice({ courtId: court.id, price: court.pricePerHour });
                    }}
                    className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 cursor-pointer"
                  >
                    Modificar
                  </button>
                </div>
              ))}
            </div>

            {editingCourtPrice && (
              <form onSubmit={handleUpdatePrice} className="pt-3 border-t space-y-3 bg-emerald-50/50 dark:bg-emerald-950/20 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <h4 className="font-bold text-xs text-emerald-800 dark:text-emerald-300">
                  Editando tarifa para: {courts.find(c => c.id === editingCourtPrice.courtId)?.name}
                </h4>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">Nuevo Precio por Hora ($)</label>
                  <input
                    type="number"
                    required
                    value={editingCourtPrice.price}
                    onChange={(e) => setEditingCourtPrice({ ...editingCourtPrice, price: Number(e.target.value) })}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingCourtPrice(null)}
                    className="px-3 py-1 text-xs font-bold text-slate-500 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 text-xs font-bold bg-emerald-600 text-white rounded-lg cursor-pointer"
                  >
                    Guardar Precio
                  </button>
                </div>
              </form>
            )}

            <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-end">
              <button
                onClick={() => setIsPriceModalOpen(false)}
                className="px-4 py-2 text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-300 cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Extender Tiempo (Solo Empleado y Admin) */}
      {isExtendModalOpen && selectedReservation && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4 border border-slate-200 dark:border-slate-700 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">⏱️ Ampliar Tiempo de Turno</h3>
              <button onClick={() => setIsExtendModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold text-lg cursor-pointer">✕</button>
            </div>

            <div className="text-xs bg-slate-50 dark:bg-slate-900 p-3 rounded-xl space-y-1">
              <p><strong className="text-slate-500">Cliente:</strong> {selectedReservation.clientName}</p>
              <p><strong className="text-slate-500">Horario Inicio:</strong> {selectedReservation.startTime} hs</p>
            </div>

            <form onSubmit={handleExtendHours} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">Nueva Duración Total</label>
                <select
                  value={hoursCount}
                  onChange={(e) => setHoursCount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold"
                >
                  <option value={1}>1 Hora</option>
                  <option value={2}>2 Horas</option>
                  <option value={3}>3 Horas</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsExtendModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-500 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold bg-emerald-600 text-white rounded-xl cursor-pointer"
                >
                  Actualizar Tiempo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Historial / Mis Reservas */}
      {isManageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-2xl w-full space-y-4 border border-slate-200 dark:border-slate-700 shadow-xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {isStaff ? 'Historial y Turnos del Día (Staff)' : 'Mis Reservas Realizadas'}
                </h3>
                <p className="text-xs text-slate-500 capitalize">Fecha: {formatLocalDate(selectedDate)}</p>
              </div>
              <button onClick={() => setIsManageModalOpen(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white font-bold text-lg cursor-pointer">✕</button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-3 pr-1">
              {displayedReservations.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  {isStaff ? 'No hay reservas registradas para esta fecha.' : 'No tienes reservas registradas a tu nombre en esta fecha.'}
                </div>
              ) : (
                displayedReservations.map(res => {
                  const court = courts.find(c => c.id === res.courtId);
                  return (
                    <div key={res.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded">
                            {res.startTime} hs ({res.endTime}h)
                          </span>
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white">{res.clientName}</h4>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          🏟️ {court?.name} {isStaff && `• 📱 ${res.clientPhone}`}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 justify-between sm:justify-end">
                        <div className="text-right">
                          <span className="block font-mono font-bold text-xs text-slate-900 dark:text-white">${res.totalAmount.toLocaleString()}</span>
                          {isStaff && (
                            <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                              res.status === 'pagada' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {res.status}
                            </span>
                          )}
                        </div>

                        {/* Controles exclusivos para Staff (Empleado y Admin) */}
                        {isStaff && (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedReservation(res);
                                setHoursCount(typeof res.endTime === 'number' ? res.endTime : parseInt(res.endTime) || 1);
                                setIsExtendModalOpen(true);
                              }}
                              className="px-2.5 py-1.5 bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 rounded-xl text-[11px] font-bold cursor-pointer"
                              title="Extender tiempo"
                            >
                              ⏱️ Extender
                            </button>
                            <button
                              onClick={() => handleCancelReservation(res.id)}
                              className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-xl text-[11px] font-bold cursor-pointer"
                            >
                              Cancelar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-end">
              <button
                onClick={() => setIsManageModalOpen(false)}
                className="px-4 py-2 text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-300 cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};