import React, { useState } from 'react';
import { Search, MapPin, Sparkles, Laptop, FileText, Shirt, Watch, Package, Camera, Upload, X, Loader2, Database, AlertCircle } from 'lucide-react';
import { CategoryType, SearchQuery } from '../types';
import { CATEGORIES, POPULAR_SEARCH_PRESETS, CAMPUS_LOCATIONS } from '../data/mockData';
import { useWallet } from '../context/WalletContext';

interface SearchFormProps {
  onSearch: (query: SearchQuery, txSignature?: string) => void;
  isLoading: boolean;
  initialQuery?: SearchQuery;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading, initialQuery }) => {
  const [description, setDescription] = useState(initialQuery?.description ?? 'Белые беспроводные наушники');
  const [category, setCategory] = useState<CategoryType | 'all'>(initialQuery?.category ?? 'electronics');
  const [location, setLocation] = useState(initialQuery?.location ?? 'Университет, библиотека');
  const [attachedPhoto, setAttachedPhoto] = useState<string | null>(null);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [txNotice, setTxNotice] = useState<{ type: 'error' | 'info'; text: string } | null>(null);

  const {
    walletAddress,
    connectWallet,
    sendSearchMemoTransaction,
    isRecordingBlockchain,
  } = useWallet();

  const handlePresetSelect = (preset: typeof POPULAR_SEARCH_PRESETS[0]) => {
    setDescription(preset.description);
    setCategory(preset.category);
    setLocation(preset.location);
  };

  const getCategoryLabel = (id: string) => {
    switch (id) {
      case 'electronics': return 'Электроника';
      case 'documents': return 'Документы';
      case 'clothing': return 'Одежда';
      case 'accessories': return 'Аксессуары';
      default: return 'Другое';
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setTxNotice(null);

    const finalDesc = description.trim() || 'Белые беспроводные наушники';
    const finalLoc = location.trim() || 'Университет, библиотека';
    const categoryLabel = getCategoryLabel(category);

    // 1. Check if Phantom is connected. If not, request connection.
    let currentAddress = walletAddress;
    if (!currentAddress) {
      currentAddress = await connectWallet();
      if (!currentAddress) {
        setTxNotice({
          type: 'info',
          text: 'Для записи поиска в блокчейн Solana Devnet требуется подключить Phantom Wallet.',
        });
        return;
      }
    }

    // 2. Send transaction into Solana Devnet with Memo instruction
    // While in progress, isRecordingBlockchain is true -> shows «Записываем в блокчейн…»
    const result = await sendSearchMemoTransaction({
      description: finalDesc,
      category: categoryLabel,
      location: finalLoc,
    });

    if (result.success && result.signature) {
      // Successfully recorded in Solana Devnet
      onSearch(
        {
          description: finalDesc,
          category: category,
          location: finalLoc,
          hasPhoto: Boolean(attachedPhoto),
        },
        result.signature
      );
    } else if (result.error) {
      // User cancelled or other error
      setTxNotice({
        type: 'error',
        text: result.error,
      });
    }
  };

  const handlePhotoUploadSim = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAttachedPhoto(url);
    }
  };

  const getCategoryIcon = (id: CategoryType) => {
    switch (id) {
      case 'electronics':
        return <Laptop className="w-4 h-4" />;
      case 'documents':
        return <FileText className="w-4 h-4" />;
      case 'clothing':
        return <Shirt className="w-4 h-4" />;
      case 'accessories':
        return <Watch className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const isBusy = isLoading || isRecordingBlockchain;

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="relative rounded-2xl bg-gradient-to-b from-[#13192b] to-[#0c101c] p-1 border border-slate-800 shadow-2xl shadow-purple-950/20">
        {/* Glow corner accents */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-96 h-20 bg-purple-600/15 blur-3xl rounded-full pointer-events-none" />

        <form onSubmit={handleSubmit} className="relative z-10 p-5 sm:p-7 rounded-[14px] bg-[#0c101b]/95 space-y-6">
          
          {/* Preset chips for lightning demo */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Быстрые примеры для проверки:
              </span>
              <span className="text-[11px] text-slate-500">Нажмите, чтобы заполнить</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {POPULAR_SEARCH_PRESETS.map((preset, index) => {
                const isActive = description === preset.description;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handlePresetSelect(preset)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                      isActive
                        ? 'bg-purple-900/40 text-purple-200 border-purple-500/60 shadow-sm'
                        : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description Input (Primary) */}
          <div className="space-y-2 text-left">
            <label htmlFor="item-desc" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Краткое описание предмета <span className="text-purple-400">*</span>
            </label>
            <div className="relative">
              <input
                id="item-desc"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Например: Белые беспроводные наушники"
                className="w-full pl-4 pr-10 py-3.5 rounded-xl bg-slate-950/80 border border-slate-700/80 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-slate-100 placeholder-slate-500 text-sm sm:text-base outline-none transition-all shadow-inner"
              />
              {description && (
                <button
                  type="button"
                  onClick={() => setDescription('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-300 rounded-md"
                  title="Очистить"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Category Selector */}
          <div className="space-y-2 text-left">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Категория вещи
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border-purple-500 text-purple-200 shadow-md shadow-purple-950/30'
                        : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <span className={isSelected ? 'text-purple-300' : 'text-slate-500'}>
                      {getCategoryIcon(cat.id)}
                    </span>
                    <span className="truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location & Optional Photo Section */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-left">
            {/* Where lost? */}
            <div className="md:col-span-7 space-y-2 relative">
              <label htmlFor="item-loc" className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-300">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  Где потеряли?
                </span>
                <span className="text-[11px] font-normal normal-case text-slate-500">Необязательно</span>
              </label>

              <div className="relative">
                <input
                  id="item-loc"
                  type="text"
                  value={location}
                  onFocus={() => setShowLocationSuggestions(true)}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Например: Университет, библиотека"
                  className="w-full pl-4 pr-10 py-3 rounded-xl bg-slate-950/80 border border-slate-700/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-100 placeholder-slate-500 text-sm outline-none transition-all"
                />
                {location && (
                  <button
                    type="button"
                    onClick={() => setLocation('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-300"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Suggestions dropdown */}
              {showLocationSuggestions && (
                <div className="absolute z-20 left-0 right-0 mt-1 bg-[#101625] border border-slate-700 rounded-xl shadow-xl p-2 max-h-48 overflow-y-auto">
                  <div className="text-[10px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
                    Частые локации кампуса:
                  </div>
                  {CAMPUS_LOCATIONS.map((loc, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onMouseDown={() => {
                        setLocation(loc);
                        setShowLocationSuggestions(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-slate-300 hover:bg-purple-900/30 hover:text-purple-200 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span>{loc}</span>
                    </button>
                  ))}
                  <button
                    type="button"
                    onMouseDown={() => setShowLocationSuggestions(false)}
                    className="w-full text-center text-[11px] text-slate-500 hover:text-slate-300 py-1 mt-1 border-t border-slate-800"
                  >
                    Закрыть подсказки
                  </button>
                </div>
              )}
            </div>

            {/* Photo simulator */}
            <div className="md:col-span-5 space-y-2">
              <label className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-cyan-400" />
                  Фото или похожий снимок
                </span>
                <span className="text-[11px] font-normal normal-case text-slate-500">Для AI Vision</span>
              </label>

              {attachedPhoto ? (
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/80 border border-purple-500/50">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <img src={attachedPhoto} alt="Upload preview" className="w-8 h-8 rounded-lg object-cover" />
                    <span className="text-xs text-purple-300 truncate font-medium">Фото прикреплено</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAttachedPhoto(null)}
                    className="p-1 text-slate-400 hover:text-red-400 rounded"
                    title="Удалить фото"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-slate-700/80 bg-slate-950/50 hover:bg-slate-900/60 hover:border-slate-600 cursor-pointer text-xs text-slate-400 hover:text-slate-200 transition-all">
                  <Upload className="w-3.5 h-3.5 text-slate-400" />
                  <span>Загрузить фото вещи</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUploadSim}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Error / info notice banner */}
          {txNotice && (
            <div className={`p-3 rounded-xl border text-xs flex items-start gap-2 text-left ${
              txNotice.type === 'error'
                ? 'bg-rose-950/40 border-rose-800/60 text-rose-200'
                : 'bg-purple-950/40 border-purple-800/60 text-purple-200'
            }`}>
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{txNotice.text}</span>
            </div>
          )}

          {/* Primary Action Button: «Найти мою вещь» with «Записываем в блокчейн…» state */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isBusy}
              className="w-full group relative overflow-hidden rounded-xl p-[2px] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-[#090d16] transition-all hover:scale-[1.005] active:scale-[0.995]"
            >
              {/* Outer animated gradient glow border */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-500 rounded-xl transition-all duration-300 group-hover:opacity-100 group-hover:brightness-110 shadow-lg shadow-purple-600/30" />
              
              {/* Inner button surface */}
              <div className="relative px-6 py-4 rounded-[10px] bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 flex items-center justify-center gap-3 transition-colors">
                {isRecordingBlockchain ? (
                  <>
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                    <span className="text-base sm:text-lg font-bold tracking-wide text-white drop-shadow-sm">
                      Записываем в блокчейн…
                    </span>
                    <Database className="w-4 h-4 text-purple-200 animate-pulse" />
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 text-white group-hover:rotate-6 transition-transform" />
                    <span className="text-base sm:text-lg font-bold tracking-wide text-white drop-shadow-sm">
                      {isLoading ? 'Нейросеть выполняет поиск...' : 'Найти мою вещь'}
                    </span>
                    <Sparkles className="w-4 h-4 text-purple-200 animate-pulse" />
                  </>
                )}
              </div>
            </button>
            <p className="text-center text-[11px] text-slate-500 mt-2.5">
              💡 При нажатии отправляется Memo-транзакция в Solana Devnet через подключённый Phantom
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
