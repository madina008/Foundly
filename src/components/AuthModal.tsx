import React, { useState } from 'react';
import { X, Mail, Lock, User, Building2, Eye, EyeOff, BookOpen, GraduationCap, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { KAZAKHSTAN_UNIVERSITIES, COURSES, University } from '../data/kazakhstanUniversities';
import { UniversitySelectorModal } from './UniversitySelectorModal';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    authModalMode,
    openAuthModal,
    closeAuthModal,
    login,
    register,
  } = useAuth();

  // Mode: 'login' | 'register'
  const isRegister = authModalMode === 'register';

  // Fields
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // University
  const [selectedUni, setSelectedUni] = useState<University>(KAZAKHSTAN_UNIVERSITIES[0]); // Zhubanov by default
  const [customUniName, setCustomUniName] = useState('');
  const [faculty, setFaculty] = useState('');
  const [course, setCourse] = useState('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showUniCatalog, setShowUniCatalog] = useState(false);

  // Reset fields to completely empty cells whenever modal opens or switches mode
  React.useEffect(() => {
    setName('');
    setSurname('');
    setEmail('');
    setPassword('');
    setFaculty('');
    setCourse('');
    setErrorMessage(null);
  }, [authModalOpen, authModalMode]);

  if (!authModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (isRegister) {
        if (!name.trim() || !surname.trim() || !email.trim() || !password.trim()) {
          throw new Error('Пожалуйста, заполните имя, фамилию, email и пароль');
        }
        if (password.length < 6) {
          throw new Error('Пароль должен содержать не менее 6 символов');
        }

        await register({
          name: name.trim(),
          surname: surname.trim(),
          email: email.trim(),
          password: password.trim(),
          universityId: selectedUni.id,
          universityName: selectedUni.id === 'other' && customUniName ? customUniName : selectedUni.shortName,
          faculty: faculty.trim() || undefined,
          course: course || undefined,
        });
      } else {
        if (!email.trim() || !password.trim()) {
          throw new Error('Введите адрес электронной почты и пароль');
        }

        await login({
          email: email.trim(),
          password: password.trim(),
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Произошла ошибка при аутентификации';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
        <div className="bg-[#0e1424] border border-slate-700/80 rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl relative text-left">
          
          {/* Close button */}
          <button
            type="button"
            onClick={closeAuthModal}
            className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header & Mode Switcher */}
          <div className="p-6 pb-4 border-b border-slate-800/80">
            <h3 className="text-xl font-bold text-white">
              {isRegister ? 'Регистрация' : 'Вход в аккаунт'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {isRegister
                ? 'Создайте аккаунт для поиска и возврата вещей в кампусе'
                : 'Войдите, чтобы управлять объявлениями и подтверждать находки'}
            </p>

            {/* Switch tabs */}
            <div className="flex p-1 rounded-xl bg-slate-900 border border-slate-800 mt-4">
              <button
                type="button"
                onClick={() => {
                  openAuthModal('login');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  !isRegister
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Войти
              </button>
              <button
                type="button"
                onClick={() => {
                  openAuthModal('register');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  isRegister
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Регистрация
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-200 flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* REGISTRATION-SPECIFIC FIELDS */}
            {isRegister && (
              <>
                {/* Name & Surname */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      Имя <span className="text-purple-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder=""
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      Фамилия <span className="text-purple-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={surname}
                      onChange={(e) => setSurname(e.target.value)}
                      placeholder=""
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* University Picker */}
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
                      Каталог ВУЗов
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowUniCatalog(true)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 hover:border-purple-500 text-left flex items-center justify-between transition-colors group"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <Building2 className="w-4 h-4 text-purple-400 shrink-0" />
                      <div className="truncate">
                        <span className="text-xs font-semibold text-white block truncate">
                          {selectedUni.id === 'other' && customUniName ? customUniName : selectedUni.shortName}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {selectedUni.city} • {selectedUni.name.split('(')[0]}
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] text-purple-300 font-medium shrink-0 group-hover:translate-x-0.5 transition-transform">
                      Выбрать →
                    </span>
                  </button>
                </div>

                {/* Optional Faculty & Course */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1.5">
                    <label className="flex items-center justify-between text-xs font-semibold text-slate-300">
                      <span>Факультет</span>
                      <span className="text-[10px] text-slate-500 font-normal">Необязательно</span>
                    </label>
                    <div className="relative">
                      <BookOpen className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={faculty}
                        onChange={(e) => setFaculty(e.target.value)}
                        placeholder=""
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="flex items-center justify-between text-xs font-semibold text-slate-300">
                      <span>Курс</span>
                      <span className="text-[10px] text-slate-500 font-normal">Необязательно</span>
                    </label>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <select
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-slate-100 outline-none focus:border-purple-500"
                      >
                        <option value="">Выберите курс</option>
                        {COURSES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* EMAIL (Required for both) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Электронная почта <span className="text-purple-400">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=""
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* PASSWORD (Required for both) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Пароль <span className="text-purple-400">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=""
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30"
              >
                <span>{isSubmitting ? 'Обработка...' : isRegister ? 'Зарегистрироваться' : 'Войти в аккаунт'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* University Selector Sub-modal */}
      <UniversitySelectorModal
        isOpen={showUniCatalog}
        onClose={() => setShowUniCatalog(false)}
        selectedId={selectedUni.id}
        onSelect={(uni, custom) => {
          setSelectedUni(uni);
          if (custom) setCustomUniName(custom);
        }}
      />
    </>
  );
};
