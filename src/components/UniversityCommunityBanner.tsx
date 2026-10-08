import React from 'react';
import { Building2, MapPin, Globe, ChevronRight, ShieldCheck, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const UniversityCommunityBanner: React.FC = () => {
  const {
    user,
    activeFilter,
    setActiveFilter,
    currentUniversity,
    openUniSelector,
  } = useAuth();

  return (
    <div className="w-full max-w-5xl mx-auto px-4 mt-6">
      <div className="relative rounded-2xl bg-gradient-to-r from-[#12182c] via-[#0f1526] to-[#141b30] border border-slate-800 p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Left: Community Brand & University Info */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 p-[1.5px] shadow-lg shrink-0">
            <div className="w-full h-full bg-[#0a0e19] rounded-[14px] flex items-center justify-center">
              <Building2 className="w-6 h-6 text-purple-400" />
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                <span>Foundly</span>
                <span className="text-purple-400">·</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-200">
                  {currentUniversity?.shortName || 'Zhubanov University'}
                </span>
              </h2>

              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-950/80 text-purple-300 border border-purple-800/60">
                <MapPin className="w-2.5 h-2.5 text-cyan-400" />
                <span>{currentUniversity?.city || 'Казахстан'}</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 mt-0.5">
              {activeFilter === 'my' && user
                ? `Официальное сообщество вашего кампуса (${user.universityName})`
                : activeFilter === 'all'
                ? 'Режим просмотра всех университетов Казахстана'
                : `Кампус: ${currentUniversity?.name}`}
            </p>
          </div>
        </div>

        {/* Right: Filter switchers & Switch Uni button */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Filter: My University vs All Universities */}
          <div className="flex p-1 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveFilter('my')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                activeFilter === 'my'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Мой университет</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                activeFilter === 'all'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Все университеты</span>
            </button>
          </div>

          {/* Change University Button */}
          <button
            type="button"
            onClick={openUniSelector}
            className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5 transition-all"
            title="Каталог ВУЗов Казахстана"
          >
            <span>Выбрать ВУЗ</span>
            <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
