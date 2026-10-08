import React from 'react';
import { MapPin, Calendar, CheckCircle2, ArrowRight, RotateCcw, Sparkles, Info, ExternalLink } from 'lucide-react';
import { MatchResultItem, SearchQuery } from '../types';

interface MatchResultsProps {
  results: MatchResultItem[];
  query: SearchQuery;
  onSelectMatch: (match: MatchResultItem) => void;
  onResetSearch: () => void;
  txSignature?: string | null;
}

export const MatchResults: React.FC<MatchResultsProps> = ({
  results,
  query,
  onSelectMatch,
  onResetSearch,
  txSignature,
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Найдена':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-600/50">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Найдена
          </span>
        );
      case 'Ожидает подтверждения':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-600/50">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Ожидает подтверждения
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-950/80 text-blue-300 border border-blue-600/50">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            Передано в бюро находок
          </span>
        );
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-4 space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
      
      {/* Blockchain Confirmed Transaction Banner */}
      {txSignature && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 shadow-lg shadow-emerald-950/20 text-xs">
          <div className="flex items-center gap-2.5 text-emerald-300 font-semibold">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Записано в блокчейн</div>
              <div className="text-[11px] text-emerald-300/90 font-normal">
                Поиск зафиксирован в Solana Devnet через программу Memo
              </div>
            </div>
          </div>

          <a
            href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-900 text-emerald-100 border border-emerald-500/40 font-medium transition-all text-xs shrink-0"
          >
            <span>Посмотреть запись</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Top Header & Search Query Recap */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-[#0f1423] border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Потенциальные совпадения
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-900/60 text-purple-200 border border-purple-500/40">
              {results.length} найден{results.length === 1 ? 'о' : 'о'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Запрос: <span className="text-purple-300 font-medium">«{query.description || 'Белые беспроводные наушники'}»</span>
            {query.location && (
              <> • Локация: <span className="text-slate-200 font-medium">{query.location}</span></>
            )}
          </p>
        </div>

        {/* Change query / return button */}
        <button
          type="button"
          onClick={onResetSearch}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-slate-600 transition-all text-left"
        >
          <RotateCcw className="w-4 h-4 text-purple-400" />
          <span>Изменить запрос</span>
        </button>
      </div>

      {/* Demo metric disclaimer banner */}
      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs text-purple-200/90">
        <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5 leading-relaxed">
          <p className="font-semibold text-purple-200">
            Тестовый режим AI-сопоставления
          </p>
          <p className="text-purple-300/80">
            Проценты сходства являются демонстрационными коэффициентами прототипа на основе текстовых признаков и геолокации. Нажмите «Проверить совпадение», чтобы сверить детали вещи с нашедшим.
          </p>
        </div>
      </div>

      {/* Result Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {results.map((matchItem, index) => {
          const { item, similarityScore, highlightFeatures } = matchItem;

          // Distinctive styling for top match
          const isTopMatch = index === 0;

          return (
            <div
              key={item.id}
              className={`group flex flex-col rounded-2xl bg-[#0e1322] border transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${
                isTopMatch
                  ? 'border-purple-500/40 hover:border-purple-400/80 shadow-lg shadow-purple-950/30'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Card Image Area with Overlays */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden rounded-t-2xl bg-slate-900">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e1322] via-[#0e1322]/20 to-transparent" />

                {/* Similarity Badge in Top Right */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-purple-500/50 text-white shadow-lg">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-xs font-bold tracking-tight text-purple-200">
                    {similarityScore}% сходство
                  </span>
                </div>

                {/* Status Badge in Top Left */}
                <div className="absolute top-3 left-3">
                  {getStatusBadge(item.status)}
                </div>

                {/* Campus zone badge over bottom image */}
                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-[11px] font-medium text-slate-300 border border-white/10">
                  {item.campusZone}
                </div>
              </div>

              {/* Card Content Area */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-purple-200 transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Metadata Chips: Location & Date */}
                  <div className="pt-1 flex flex-wrap gap-y-2 gap-x-4 text-xs text-slate-400 border-t border-slate-800/80 pt-2.5">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{item.date}</span>
                    </div>
                  </div>

                  {/* AI matching highlights */}
                  <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs space-y-1">
                    <div className="text-[11px] font-medium text-purple-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-purple-400" />
                      AI-факторы совпадения:
                    </div>
                    <ul className="text-slate-400 space-y-0.5 text-[11px]">
                      {highlightFeatures.slice(0, 2).map((h, i) => (
                        <li key={i} className="flex items-center gap-1">
                          <span className="text-purple-400">•</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Primary Action Button: «Проверить совпадение» */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => onSelectMatch(matchItem)}
                    className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 transition-all flex items-center justify-center gap-2 shadow-md shadow-purple-900/20 group-hover:shadow-purple-700/30"
                  >
                    <span>Проверить совпадение</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom fallback suggestion */}
      <div className="text-center pt-3 pb-6">
        <p className="text-xs text-slate-400 mb-2">
          Не нашли вашу вещь в этих совпадениях?
        </p>
        <button
          type="button"
          onClick={onResetSearch}
          className="text-xs font-medium text-purple-400 hover:text-purple-300 underline underline-offset-4"
        >
          Уточнить описание или создать подписку на новые находки кампуса
        </button>
      </div>
    </div>
  );
};
