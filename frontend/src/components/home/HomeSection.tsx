import React, { useState, useEffect } from 'react';
import { MessageCircle, Camera, Clock, MapPin, Calendar, Trophy, Utensils, ArrowRight, Sparkles } from 'lucide-react';
import type { NavSection } from '../layout/Navbar';

interface HomeSectionProps {
  onSelectSection: (section: NavSection) => void;
}

const CANTEEN_OFFERS = [
  {
    id: 1,
    title: 'Combo Post-Partido ⚽🍻',
    description: '1 Fernet con Coca (o Cerveza 1L) + 1 Picada de la casa.',
    price: '$12.500',
    tag: 'Más Vendido',
    bgGradient: 'from-amber-950 via-slate-900 to-slate-900',
    border: 'border-amber-500/30',
  },
  {
    id: 2,
    title: 'Sandwiches & Milanesas 🥪',
    description: 'Milanesa tiernizada al plato o en pan francés con abundantes papas fritas.',
    price: '$8.900',
    tag: 'Especial Cantina',
    bgGradient: 'from-emerald-950 via-slate-900 to-slate-900',
    border: 'border-emerald-500/30',
  },
  {
    id: 3,
    title: 'Bebidas Energéticas & Hidratación ⚡',
    description: 'Variedad de isotónicas, gaseosas y agua bien fría para recuperar energía.',
    price: '$2.500',
    tag: 'Refrescante',
    bgGradient: 'from-sky-950 via-slate-900 to-slate-900',
    border: 'border-sky-500/30',
  },
];

export const HomeSection: React.FC<HomeSectionProps> = ({ onSelectSection }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CANTEEN_OFFERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-8 pb-10">
      
      {/* 1. HERO / BANNER PRINCIPAL */}
      <div className="relative overflow-hidden bg-linear-to-br from-emerald-950 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-10 text-white shadow-2xl border border-emerald-500/20">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30 shadow-inner">
            <Sparkles className="w-3.5 h-3.5" /> Complejo Deportivo La Deolinda
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Viví la pasión del fútbol al siguiente nivel
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Reservá tu cancha online en segundos, sumate a los torneos competitivos y disfrutá de nuestro buffet y tienda deportiva.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onSelectSection('bookings')}
              className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition-all cursor-pointer flex items-center gap-2 group"
            >
              <Calendar className="w-4 h-4" /> Reservar Canchas 
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => onSelectSection('tournaments')}
              className="px-6 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm border border-slate-700 transition-all cursor-pointer flex items-center gap-2"
            >
              <Trophy className="w-4 h-4 text-amber-400" /> Ver Torneos Activos
            </button>
          </div>
        </div>
        <div className="absolute right-[-20px] bottom-[-40px] opacity-10 text-[180px] pointer-events-none select-none">
          ⚽
        </div>
      </div>

      {/* 2. ACCESOS DIRECTOS PRINCIPALES (GRID) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        <div 
          onClick={() => onSelectSection('bookings')}
          className="bg-white dark:bg-slate-800/90 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-xl hover:border-emerald-500 dark:hover:border-emerald-500 transition-all cursor-pointer group space-y-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Reserva de Canchas</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Elegí entre Fútbol 5, 6, 7, 8 u 11. Visualiza horarios disponibles y asegura tu turno al instante.
          </p>
        </div>

        <div 
          onClick={() => onSelectSection('tournaments')}
          className="bg-white dark:bg-slate-800/90 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-xl hover:border-emerald-500 dark:hover:border-emerald-500 transition-all cursor-pointer group space-y-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
            <Trophy className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Torneos & Ligas</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Inscribí a tu equipo, revisa las tablas de posiciones actualizadas y sigue los resultados fecha a fecha.
          </p>
        </div>

        <div 
          onClick={() => onSelectSection('buffet')}
          className="bg-white dark:bg-slate-800/90 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-xl hover:border-emerald-500 dark:hover:border-emerald-500 transition-all cursor-pointer group space-y-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
            <Utensils className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Buffet & Tienda</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Conocé las promos post-partido, bebidas frías, comidas rápidas y la disponibilidad de stock.
          </p>
        </div>

      </div>

      {/* 3. CARRUSEL DE OFERTAS DEL BUFFET */}
      <div className="bg-white dark:bg-slate-800/90 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <Utensils className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Destacados de la Cantina</h3>
          </div>
          <div className="flex gap-1.5">
            {CANTEEN_OFFERS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentSlide === idx ? 'bg-emerald-500 w-6' : 'bg-slate-300 dark:bg-slate-700 w-2'
                }`}
                aria-label={`Ver oferta ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        <div className={`relative overflow-hidden rounded-2xl bg-linear-to-r ${CANTEEN_OFFERS[currentSlide].bgGradient} p-6 sm:p-8 text-white shadow-lg border ${CANTEEN_OFFERS[currentSlide].border} transition-all duration-500`}>
          <div className="max-w-xl space-y-3 relative z-10">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-widest border border-white/10">
              {CANTEEN_OFFERS[currentSlide].tag}
            </span>
            <h4 className="text-xl sm:text-2xl font-black">{CANTEEN_OFFERS[currentSlide].title}</h4>
            <p className="text-xs sm:text-sm text-slate-300">{CANTEEN_OFFERS[currentSlide].description}</p>
            <div className="pt-2 flex items-center justify-between">
              <span className="text-xl font-mono font-black text-emerald-400">{CANTEEN_OFFERS[currentSlide].price}</span>
              <button 
                onClick={() => onSelectSection('buffet')}
                className="px-4 py-2.5 bg-white text-slate-900 hover:bg-emerald-50 rounded-xl text-xs font-bold transition-all cursor-pointer shadow flex items-center gap-1.5"
              >
                Ver Menú <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. SECCIÓN INFERIOR: HORARIOS, ATENCIÓN/REDES Y MAPA (GRID DE 3 COLUMNAS) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Columna 1: Horarios de Atención */}
        <div className="bg-white dark:bg-slate-800/90 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200/50 dark:border-emerald-800/50 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm text-slate-900 dark:text-white">Horarios de Atención</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 space-y-1">
            <span className="text-xs text-slate-500 block font-medium">Lunes a Domingo</span>
            <span className="text-base font-black text-emerald-600 dark:text-emerald-400">14:00 a 01:00 hs</span>
          </div>
          <p className="text-[11px] text-slate-400">Abierto todos los días feriados y fines de semana de partidos.</p>
        </div>

        {/* Columna 2: Atención al Cliente & Redes Sociales */}
        <div className="bg-white dark:bg-slate-800/90 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm flex flex-col justify-between space-y-4">
          <span className="font-bold text-sm text-slate-900 dark:text-white block">Atención al Cliente & Redes</span>
          
          <div className="space-y-3">
            {/* Botón WhatsApp */}
            <a 
              href="#whatsapp-pendiente" 
              onClick={(e) => { e.preventDefault(); alert('Próximamente disponible el número de WhatsApp.'); }}
              className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase block">Escribinos</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">WhatsApp Oficial</span>
              </div>
            </a>

            {/* Botón Instagram */}
            <a 
              href="https://www.instagram.com/ladeolindafutbol/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3.5 rounded-xl bg-pink-50/60 dark:bg-pink-950/30 border border-pink-200/80 dark:border-pink-800/50 hover:bg-pink-100 dark:hover:bg-pink-900/40 transition-all group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-linear-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform shrink-0">
                <Camera className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-pink-600 dark:text-pink-400 font-bold uppercase block">Seguinos</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">@ladeolindafutbol</span>
              </div>
            </a>
          </div>
        </div>

        {/* Columna 3: Ubicación y Mapa Interactivo */}
        <div className="bg-white dark:bg-slate-800/90 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-200/50 dark:border-sky-800/50 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm text-slate-900 dark:text-white block">Ubicación</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Roque Sáenz Peña Este • San Juan</span>
            </div>
          </div>

          <div className="w-full h-36 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3237.0066477467103!2d-68.46514492446195!3d-31.528288701669826!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x96816b1036645e3d%3A0x43e475b23de600b1!2sLa%20Deolinda%20Futbol!5e1!3m2!1ses!2sar!4v1790053722565!5m2!1ses!2sar" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="strict-origin-when-cross-origin"
              title="Ubicación La Deolinda Fútbol"
            />
          </div>
        </div>

      </div>

    </div>
  );
};