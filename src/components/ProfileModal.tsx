import React, { useState, useEffect } from 'react';
import { X, User, Building2, BookOpen, GraduationCap, Mail, LogOut, Check, AlertCircle, Trash2, Calendar, MapPin, Tag, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { FoundItem } from '../types';
import { KAZAKHSTAN_UNIVERSITIES, COURSES, University } from '../data/kazakhstanUniversities';
import { UniversitySelectorModal } from './UniversitySelectorModal';

interface ProfileModalProps {
  onOpenReportFound: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ onOpenReportFound }) => {
  const {
    user,
    profileModalOpen,
    closeProfileModal,
    updateProfile,
    logout,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'my_items'>('profile');

  // Profile edit fields
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [selectedUni, setSelectedUni] = useState<University>(KAZAKHSTAN_UNIVERSITIES[0]);
  const [customUniName, setCustomUniName] = useState('');
  const [faculty, setFaculty] = useState('');
  const [course, setCourse] = useState('');

  // Status
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showUniSelector, setShowUniSelector] = useState(false);

  // My items
  const [myItems, setMyItems] = useState<FoundItem[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [itemActionSuccess, setItemActionSuccess] = useState<string | null>(null);

  // Sync user state when opened
  useEffect(() => {
    if (user) {
      setName(user.name);
      setSurname(user.surname);
      const uni = KAZAKHSTAN_UNIVERSITIES.find((u) => u.id === user.universityId) || KAZAKHSTAN_UNIVERSITIES[0];
      setSelectedUni(uni);
      setCustomUniName(user.universityName);
      setFaculty(user.faculty || '');
      setCourse(user.course || '');
    }
  }, [user]);

  // Load user's items
  useEffect(() => {
    if (profileModalOpen && user) {
      setIsLoadingItems(true);
      api.getItems({ userId: user.id })
        .then((res) => {
          setMyItems(res.items);
        })
        .catch((err) => {
          console.error('Failed to load user items:', err);
        })
        .finally(() => {
          setIsLoadingItems(false);
        });
    }
  }, [profileModalOpen, user, activeTab]);

  if (!profileModalOpen || !user) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);
    setSaveSuccess(false);

    try {
      await updateProfile({
        name: name.trim(),
        surname: surname.trim(),
        universityId: selectedUni.id,
        universityName: selectedUni.id === 'other' && customUniName ? customUniName : selectedUni.shortName,
        faculty: faculty.trim(),
        course,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ошибка сохранения профиля';
      setErrorMessage(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleMarkReturned = async (itemId: string) => {
    try {
      await api.updateItem(itemId, { status: 'Возвращено владельцу' });
      setItemActionSuccess('Статус обновлён: Возвращено владельцу!');
      // Update local state
      setMyItems((prev) =>
        prev.map((it) => (it.id === itemId ? { ...it, status: 'Возвращено владельцу' } : it))
      );
      setTimeout(() => setItemActionSuccess(null), 2500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Не удалось обновить статус';
      alert(msg);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Вы уверены, что хотите удалить это объявление?')) return;

    try {
      await api.deleteItem(itemId);
      setItemActionSuccess('Объявление удалено');
      setMyItems((prev) => prev.filter((it) => it.id !== itemId));
      setTimeout(() => setItemActionSuccess(null), 2500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ошибка удаления объявления';
      alert(msg);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
        <div className="bg-[#0e1424] border border-slate-700/80 rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl relative text-left overflow-hidden">
          
          {/* Header */}
          <div className="p-6 pb-4 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                {user.name.charAt(0)}{user.surname.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {user.name} {user.surname}
                </h3>
                <p className="text-xs text-purple-300 font-medium">
                  {user.universityName} • {user.universityCity}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeProfileModal}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex px-6 pt-3 border-b border-slate-800/80 bg-slate-950/40 gap-4 shrink-0 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`pb-3 border-b-2 transition-all ${
                activeTab === 'profile'
                  ? 'border-purple-500 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Личные данные студента
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('my_items')}
              className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'my_items'
                  ? 'border-purple-500 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Мои объявления</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-purple-300">
                {myItems.length}
              </span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 overflow-y-auto flex-1">
            
            {/* TAB 1: PROFILE EDIT */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                {saveSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-600/50 text-xs text-emerald-300 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Профиль успешно обновлён!</span>
                  </div>
                )}

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-200 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Email (Readonly) */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-400">
                    Электронная почта
                  </label>
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                    <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="font-mono">{user.email}</span>
                    <span className="ml-auto text-[10px] text-slate-500">Подтверждено</span>
                  </div>
                </div>

                {/* Name & Surname */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      Имя
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      Фамилия
                    </label>
                    <input
                      type="text"
                      required
                      value={surname}
                      onChange={(e) => setSurname(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* University Selector */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-300">
                      Университет
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowUniSelector(true)}
                      className="text-[11px] text-purple-400 hover:text-purple-300 underline"
                    >
                      Сменить ВУЗ
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowUniSelector(true)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 hover:border-purple-500 text-left flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <Building2 className="w-4 h-4 text-purple-400 shrink-0" />
                      <div className="truncate">
                        <span className="text-xs font-semibold text-white block truncate">
                          {selectedUni.id === 'other' && customUniName ? customUniName : selectedUni.shortName}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {selectedUni.city}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-purple-300">Выбрать →</span>
                  </button>
                </div>

                {/* Faculty & Course */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      Факультет / Специальность
                    </label>
                    <div className="relative">
                      <BookOpen className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={faculty}
                        onChange={(e) => setFaculty(e.target.value)}
                        placeholder="Инженерия, IT, Экономика"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      Курс
                    </label>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <select
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 outline-none focus:border-purple-500"
                      >
                        <option value="">Не указан</option>
                        {COURSES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md"
                  >
                    {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
                  </button>

                  <button
                    type="button"
                    onClick={logout}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-950/70 border border-rose-800/40 text-rose-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Выйти из аккаунта</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: MY ITEMS */}
            {activeTab === 'my_items' && (
              <div className="space-y-4">
                {itemActionSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-600/50 text-xs text-emerald-300 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{itemActionSuccess}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Объявления, созданные вашим аккаунтом ({myItems.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      closeProfileModal();
                      onOpenReportFound();
                    }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Подать объявление</span>
                  </button>
                </div>

                {isLoadingItems ? (
                  <div className="py-12 text-center text-xs text-slate-400">
                    Загрузка ваших объявлений...
                  </div>
                ) : myItems.length === 0 ? (
                  <div className="py-12 text-center space-y-3 bg-slate-950/30 rounded-2xl border border-slate-800">
                    <p className="text-xs text-slate-400">
                      Вы ещё не создали ни одного объявления о потерянных или найденных вещах.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        closeProfileModal();
                        onOpenReportFound();
                      }}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
                    >
                      Создать первое объявление
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-white">{item.title}</h4>
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-950 text-purple-300 border border-purple-800">
                                {item.category}
                              </span>
                            </div>
                            <p className="text-xs text-slate-300 line-clamp-1">
                              {item.description}
                            </p>
                          </div>

                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                              item.status === 'Возвращено владельцу'
                                ? 'bg-purple-950 text-purple-300 border border-purple-800'
                                : item.status === 'Найдена'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : 'bg-amber-950 text-amber-300 border border-amber-800'
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-indigo-400" />
                            <span>{item.location} ({item.universityName || 'Кампус'})</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-cyan-400" />
                            <span>{item.date}</span>
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                          {item.status !== 'Возвращено владельцу' && (
                            <button
                              type="button"
                              onClick={() => handleMarkReturned(item.id)}
                              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Отметить «Возвращено владельцу»</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDeleteItem(item.id)}
                            className="ml-auto text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 p-1 hover:bg-rose-950/30 rounded"
                            title="Удалить объявление"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Удалить</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <UniversitySelectorModal
        isOpen={showUniSelector}
        onClose={() => setShowUniSelector(false)}
        selectedId={selectedUni.id}
        onSelect={(uni, custom) => {
          setSelectedUni(uni);
          if (custom) setCustomUniName(custom);
        }}
      />
    </>
  );
};
