import React from 'react';
import { Search, PlusCircle } from 'lucide-react';
import { WalletButton } from './WalletButton';

interface HeaderProps {
  onOpenReportFound: () => void;
  onResetSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenReportFound, onResetSearch }) => {
  return (
    <header className="border-b border-slate-800/80 bg-[#090d16]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={onResetSearch}
          className="flex items-center gap-3 group text-left transition-transform hover:scale-[1.01]"
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
              <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-800/60">
                AI Campus
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Поиск потерянных и найденных вещей
            </p>
          </div>
        </button>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick action: Report found item */}
          <button
            onClick={onOpenReportFound}
            className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 transition-all hover:text-white"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>Я нашёл вещь</span>
          </button>

          {/* Active Phantom Wallet Button */}
          <WalletButton />
        </div>
      </div>
    </header>
  );
};

