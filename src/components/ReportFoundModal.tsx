import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Building2, MapPin, Sparkles, PlusCircle, AlertCircle } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import { CategoryType, FoundItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { KAZAKHSTAN_UNIVERSITIES, University } from '../data/kazakhstanUniversities';
import { UniversitySelectorModal } from './UniversitySelectorModal';

interface ReportFoundModalProps {
  onClose: () => void;
  onItemAdded?: (item: FoundItem) => void;
}

export const ReportFoundModal: React.FC<ReportFoundModalProps> = ({ onClose, onItemAdded }) => {
  const { user, currentUniversity } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryType>('electronics');
  const [location, setLocation] = useState('Университет, библиотека');
  const [description, setDescription] = useState('');
  const [itemType, setItemType] = useState<'found' | 'lost'>('found');
  
  // University prepopulation (requirement 6: automatically prepopulate user's university, permit changing)
  const [selectedUni, setSelectedUni] = useState<University>(
    user
      ? KAZAKHSTAN_UNIVERSITIES.find((u) => u.id === user.universityId) || currentUniversity || KAZAKHSTAN_UNIVERSITIES[0]
      : currentUniversity || KAZAKHSTAN_UNIVERSITIES[0]
  );
  const [customUniName, setCustomUniName] = useState(user?.universityName || '');
  const [showUniCatalog, setShowUniCatalog] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedItem, setSubmittedItem] = useState<FoundItem | null>(null);

  useEffect(() => {
    if (user) {
      const match = KAZAKHSTAN_UNIVERSITIES.find((u) => u.id === user.universityId);
      if (match) setSelectedUni(match);
      setCustomUniName(user.universityName);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setErrorMessage('Пожалуйста, заполните название и описание предмета');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const uniName = selectedUni.id === 'other' && customUniName ? customUniName : selectedUni.shortName;

      const res = await api.createItem({
        title: title.trim(),
        category,
        description: description.trim(),
        location: location.trim() || `${uniName}, Кампус`,
        campusZone: `${uniName}, ${selectedUni.city}`,
        universityId: selectedUni.id,
        universityName: uniName,
        status: itemType === 'found' ? 'Найдена' : 'Ожидает подтверждения',
        statusColor: itemType === 'found' ? 'emerald' : 'amber',
        finderName: user ? `${user.name} ${user.surname}` : 'Студент кампуса',
        finderType: user ? 'Студент' : 'Пользователь',
        storagePlace: itemType === 'found' ? `Стойка охраны / бюро находок (${uniName})` : 'У владельца',
        keywords: [title.toLowerCase(), category, uniName.toLowerCase(), location.toLowerCase()],
        distinctiveFeatures: [description.slice(0, 45)],
      });

      setSubmittedItem(res.item);
      if (onItemAdded) {
        onItemAdded(res.item);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Не удалось сохранить объявление';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
        <div className="bg-[#0f1422] border border-slate-700/80 rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-6 shadow-2xl relative text-left">
          
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {!submittedItem ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Новое объявление</h3>
                  <p className="text-xs text-slate-400">
                    Опубликуйте находку или потерю в университетском сообществе
                  </p>
                </div>
              </div>

              {/* Type toggle */}
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-900 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setItemType('found')}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    itemType === 'found'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Я нашёл вещь
                </button>
                <button
                  type="button"
                  onClick={() => setItemType('lost')}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    itemType === 'lost'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Я потерял вещь
                </button>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* University Selector (Automatic prefill with user's uni, editable!) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-300">
                    Университет <span className="text-purple-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowUniCatalog(true)}
                    className="text-[11px] text-purple-400 hover:text-purple-300 underline"
                  >
                    Сменить ВУЗ
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowUniCatalog(true)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 hover:border-purple-500 text-left flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <Building2 className="w-4 h-4 text-purple-400 shrink-0" />
                    <div className="truncate">
                      <span className="text-xs font-semibold text-white block truncate">
                        {selectedUni.id === 'other' && customUniName ? customUniName : selectedUni.shortName}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {selectedUni.city} {user && user.universityId === selectedUni.id ? '• Ваш университет' : ''}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-purple-300">Изменить →</span>
                </button>
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Название предмета <span className="text-purple-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Например: Чехол с очками Ray-Ban или Пропуск"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-purple-500"
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">Категория</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryType)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 outline-none focus:border-purple-500"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Где {itemType === 'found' ? 'нашли' : 'потеряли'}?
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Корпус, этаж, библиотека, аудитория..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 outline-none focus:border-purple-500"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Краткое описание и приметы <span className="text-purple-400">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Цвет, состояние, особые приметы, где передано на хранение..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 outline-none focus:border-purple-500"
                />
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? 'Сохранение в базу...'
                      : `Опубликовать в ${selectedUni.shortName}`}
                  </span>
                </button>
              </div>
            </form>
          ) : (
            /* Success confirmation */
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">Объявление успешно опубликовано!</h3>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                Запись сохранена на сервере в сообществе{' '}
                <strong className="text-purple-300">{submittedItem.universityName}</strong>. AI-модель Foundly включила предмет в векторный индекс.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-all"
              >
                Вернуться к поиску
              </button>
            </div>
          )}
        </div>
      </div>

      <UniversitySelectorModal
        isOpen={showUniCatalog}
        onClose={() => setShowUniCatalog(false)}
        selectedId={selectedUni.id}
        onSelect={(uni, custom) => {
          setSelectedUni(uni);
          if (custom) setCustomUniName(custom);
        }}
        title="Выберите университет для объявления"
      />
    </>
  );
};
