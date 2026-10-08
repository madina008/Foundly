import React from 'react';
import { Sparkles, Clock, Compass, ShieldCheck } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <div className="text-center pt-8 pb-6 px-4">
      {/* Micro-badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-cyan-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium mb-5 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
        <span>Умная нейросеть сопоставления находок для кампуса</span>
      </div>

      {/* Main Heading */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-4">
        Потерял?{' '}
        <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-sm">
          Найдём.
        </span>
      </h1>

      {/* Description */}
      <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 font-normal leading-relaxed mb-3">
        AI сопоставляет потерянные и найденные вещи, чтобы вернуть их владельцам быстрее.
      </p>

      {/* Tagline phrase as requested */}
      <p className="text-sm sm:text-base font-semibold tracking-wide text-purple-300/90 mb-6">
        Меньше поисков. Больше найденных вещей.
      </p>

      {/* Quick live campus stats chips */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400 pt-1">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span>Поиск за 1 клик по всем базам</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800">
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span>Локации корпусов, аудиторий и библиотек</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Конфиденциальная верификация</span>
        </div>
      </div>
    </div>
  );
};
