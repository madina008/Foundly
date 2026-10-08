import React, { useState, useMemo } from 'react';
import { X, Search, MapPin, Building2, Check, Sparkles } from 'lucide-react';
import { KAZAKHSTAN_UNIVERSITIES, KAZAKHSTAN_CITIES, University } from '../data/kazakhstanUniversities';

interface UniversitySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedId: string;
  onSelect: (university: University, customName?: string) => void;
  title?: string;
}

export const UniversitySelectorModal: React.FC<UniversitySelectorModalProps> = ({
  isOpen,
  onClose,
  selectedId,
  onSelect,
  title = 'Каталог университетов Казахстана',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Все города');
  const [customUniversityName, setCustomUniversityName] = useState('');

  const filteredUniversities = useMemo(() => {
    return KAZAKHSTAN_UNIVERSITIES.filter((uni) => {
      const matchesCity = selectedCity === 'Все города' || uni.city === selectedCity;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        uni.name.toLowerCase().includes(q) ||
        uni.shortName.toLowerCase().includes(q) ||
        uni.city.toLowerCase().includes(q);
      return matchesCity && matchesSearch;
    });
  }, [searchQuery, selectedCity]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0e1424] border border-slate-700/80 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl relative text-left overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{title}</h3>
              <p className="text-xs text-slate-400">
                Выберите ваше учебное заведение для поиска находок в кампусе
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & City Filter */}
        <div className="p-5 space-y-3 border-b border-slate-800/80 shrink-0 bg-slate-950/40">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск ВУЗа по названию (Жубанов, Heriot-Watt, NU, Satbayev...)"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-purple-500 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Cities Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {KAZAKHSTAN_CITIES.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => setSelectedCity(city)}
                className={`px-3 py-1.5 rounded-lg border whitespace-nowrap transition-all ${
                  selectedCity === city
                    ? 'bg-purple-900/50 border-purple-500 text-purple-200 font-semibold'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Universities List */}
        <div className="p-5 overflow-y-auto flex-1 space-y-2.5">
          {filteredUniversities.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              По запросу «{searchQuery}» университетов не найдено.
            </div>
          ) : (
            filteredUniversities.map((uni) => {
              const isSelected = selectedId === uni.id;
              const isOther = uni.id === 'other';

              return (
                <div
                  key={uni.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-purple-950/40 border-purple-500 text-white'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-slate-300'
                  }`}
                >
                  <div
                    onClick={() => {
                      if (!isOther) {
                        onSelect(uni);
                        onClose();
                      }
                    }}
                    className="flex items-start justify-between gap-3 cursor-pointer"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white group-hover:text-purple-300">
                          {uni.shortName}
                        </span>
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                          <MapPin className="w-2.5 h-2.5 text-indigo-400" />
                          <span>{uni.city}</span>
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1">
                        {uni.name}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* If "Other university" is selected, show input */}
                  {isOther && (
                    <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
                      <label className="block text-xs text-slate-300">
                        Укажите название вашего учебного заведения:
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={customUniversityName}
                          onChange={(e) => setCustomUniversityName(e.target.value)}
                          placeholder="Например: Университет «Туран» или колледж..."
                          className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-purple-500"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (customUniversityName.trim()) {
                              onSelect(uni, customUniversityName.trim());
                              onClose();
                            }
                          }}
                          disabled={!customUniversityName.trim()}
                          className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-semibold"
                        >
                          Выбрать
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
