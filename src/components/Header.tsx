import React from 'react';
import { Search, PlusCircle, User, LogIn, UserPlus, Building2 } from 'lucide-react';
import { WalletButton } from './WalletButton';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onOpenReportFound: () => void;
  onResetSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenReportFound, onResetSearch }) => {
  const { user, isAuthenticated, openAuthModal, openProfileModal } = useAuth();

  return (
    <header className="border-b border-slate-800/80 bg-[#090d16]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-3">
        {/* Logo */}
        <button
          onClick={onResetSearch}
          className="flex items-center gap-3 group text-left transition-transform hover:scale-[1.01] shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 p-[1.5px] shadow-lg shadow-purple-500/20">
            <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center group-hover:bg-[#111726] transition-colors">
              <Search className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight text-white group-hover:text-purple-200 transition-colors">
                Foundly
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Поиск потерянных вещей в университетах
            </p>
          </div>
        </button>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick action: Report found item */}
          <button
            onClick={onOpenReportFound}
            className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 transition-all hover:text-white"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>Я нашёл вещь</span>
          </button>

          {/* Active Phantom Wallet Button */}
          <WalletButton />

          {/* AUTHENTICATION CONTROLS: Login / Register OR User Profile */}
          {isAuthenticated && user ? (
            /* Logged in: User Badge with Name & University */
            <button
              type="button"
              onClick={openProfileModal}
              className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-purple-500/40 hover:border-purple-400 text-left transition-all hover:scale-[1.01]"
              title="Открыть мой профиль"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                {user.name.charAt(0)}{user.surname.charAt(0)}
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-bold text-white leading-tight">
                  {user.name} {user.surname.charAt(0)}.
                </div>
                <div className="text-[10px] text-purple-300 leading-tight truncate max-w-[130px]">
                  {user.universityName}
                </div>
              </div>
            </button>
          ) : (
            /* Not logged in: «Войти» и «Регистрация» */
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 transition-all"
              >
                <LogIn className="w-3.5 h-3.5 text-purple-400" />
                <span>Войти</span>
              </button>

              <button
                type="button"
                onClick={() => openAuthModal('register')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 border border-purple-400/30 shadow-md shadow-purple-900/20 transition-all"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Регистрация</span>
                <span className="sm:hidden">Создать</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
