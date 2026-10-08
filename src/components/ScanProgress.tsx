import React, { useEffect, useState } from 'react';
import { Cpu, Search, Sparkles, MapPin, Database } from 'lucide-react';

interface ScanProgressProps {
  onComplete: () => void;
  queryText: string;
}

export const ScanProgress: React.FC<ScanProgressProps> = ({ onComplete, queryText }) => {
  const [step, setStep] = useState(0);

  const steps = [
    { label: `Векторизация запроса «${queryText || 'Белые беспроводные наушники'}»`, icon: Search },
    { label: 'Сверка с базой находок кампуса (библиотека, коворкинги, гардеробы)...', icon: Database },
    { label: 'Анализ совпадений по цвету, типу корпуса и локации...', icon: Cpu },
    { label: 'Расчёт демонстрационных коэффициентов сходства Foundly AI...', icon: Sparkles },
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(1), 350);
    const timer2 = setTimeout(() => setStep(2), 750);
    const timer3 = setTimeout(() => setStep(3), 1150);
    const timer4 = setTimeout(() => onComplete(), 1550);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <div className="w-full max-w-2xl mx-auto my-8 px-4 text-center animate-in fade-in duration-300">
      <div className="p-8 rounded-2xl bg-[#0e1322] border border-purple-500/30 shadow-2xl shadow-purple-950/40 relative overflow-hidden">
        
        {/* Animated background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-indigo-500/10 to-cyan-500/5 animate-pulse" />

        {/* Central pulsing radar graphic */}
        <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-purple-500/30 animate-ping opacity-75" />
          <div className="absolute inset-2 rounded-full border border-indigo-500/40 animate-pulse" />
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/40">
            <Cpu className="w-8 h-8 text-white animate-spin" style={{ animationDuration: '6s' }} />
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-2">
          Foundly AI анализирует совпадения
        </h3>
        <p className="text-xs text-purple-300/80 mb-6 font-mono">
          Сканирование студенческих находок в реальном времени...
        </p>

        {/* Step-by-step indicator */}
        <div className="space-y-3 text-left max-w-md mx-auto">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isDone = step > idx;
            const isCurrent = step === idx;

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 p-2.5 rounded-xl transition-all duration-300 ${
                  isCurrent
                    ? 'bg-purple-950/50 border border-purple-500/50 text-white translate-x-1'
                    : isDone
                    ? 'bg-slate-900/40 border border-slate-800 text-slate-400'
                    : 'opacity-40 text-slate-500 border border-transparent'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    isCurrent
                      ? 'bg-purple-500 text-white animate-pulse'
                      : isDone
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-medium truncate">{s.label}</span>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-800/80 rounded-full h-1.5 mt-6 overflow-hidden">
          <div
            className="bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, (step + 1) * 25)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
