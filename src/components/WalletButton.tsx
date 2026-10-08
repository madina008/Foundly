import React, { useState } from 'react';
import { Wallet, ExternalLink, Copy, Check, LogOut, RefreshCw, AlertTriangle, X } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

export const WalletButton: React.FC = () => {
  const {
    walletAddress,
    balance,
    isLoading,
    isRefreshingBalance,
    errorMessage,
    setErrorMessage,
    connectWallet,
    disconnectWallet,
    refreshBalance,
  } = useWallet();

  const [copied, setCopied] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const copyToClipboard = () => {
    if (!walletAddress) return;
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openInNewTab = () => {
    window.open(window.location.href, '_blank');
  };

  // Format address: First 4 and last 4 characters
  const formattedAddress = walletAddress
    ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
    : '';

  return (
    <div className="relative">
      {/* CONNECTED STATE */}
      {walletAddress ? (
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-medium bg-[#111728] border border-purple-500/50 hover:border-purple-400 text-slate-100 shadow-lg shadow-purple-950/20 transition-all hover:scale-[1.01]"
          >
            {/* Solana Devnet dot */}
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

            {/* Address: first 4 and last 4 characters */}
            <span className="font-mono font-semibold text-purple-200">
              {formattedAddress}
            </span>

            {/* Divider */}
            <span className="text-slate-600">|</span>

            {/* Balance in SOL (devnet) */}
            <span className="font-mono text-emerald-300 font-semibold flex items-center gap-1">
              {balance !== null ? `${balance} SOL` : '... SOL'}
            </span>

            <span className="hidden md:inline text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
              Devnet
            </span>
          </button>

          {/* Account Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-72 p-4 rounded-2xl bg-[#0f1424] border border-slate-700 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 text-left">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Phantom Wallet</div>
                    <div className="text-[10px] text-emerald-400 font-medium">Сеть: Solana Devnet</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDropdown(false)}
                  className="p-1 text-slate-400 hover:text-white rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Full Address */}
              <div className="my-3 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-semibold mb-1">
                  Адрес кошелька
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono text-purple-200 truncate">
                    {walletAddress}
                  </span>
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="p-1 text-slate-400 hover:text-white rounded"
                    title="Скопировать адрес"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Balance Card */}
              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 flex items-center justify-between mb-3">
                <div>
                  <div className="text-[10px] text-purple-300 uppercase font-semibold">
                    Баланс в Devnet
                  </div>
                  <div className="text-sm font-bold text-white font-mono mt-0.5">
                    {balance !== null ? `${balance} SOL` : 'Загрузка...'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={refreshBalance}
                  disabled={isRefreshingBalance}
                  className="p-1.5 text-purple-300 hover:text-white rounded-lg bg-purple-900/40 hover:bg-purple-900/60 transition-colors"
                  title="Обновить баланс"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingBalance ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* Disconnect button */}
              <button
                type="button"
                onClick={async () => {
                  await disconnectWallet();
                  setShowDropdown(false);
                }}
                className="w-full py-2 px-3 rounded-xl text-xs font-medium text-rose-300 bg-rose-950/30 hover:bg-rose-950/60 border border-rose-800/40 flex items-center justify-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Отключить кошелёк</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* DISCONNECTED STATE: Button «Подключить кошелёк» */
        <button
          type="button"
          onClick={() => connectWallet()}
          disabled={isLoading}
          className="group relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 border border-purple-400/30 shadow-md shadow-purple-900/30 hover:shadow-purple-700/40 transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          <Wallet className="w-4 h-4 text-purple-200 group-hover:rotate-6 transition-transform" />
          <span>{isLoading ? 'Подключение...' : 'Подключить кошелёк'}</span>
        </button>
      )}

      {/* ERROR MODAL: «Откройте приложение в отдельной вкладке с установленным Phantom» */}
      {errorMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0f1422] border border-amber-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-left">
            <button
              onClick={() => setErrorMessage(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4 text-amber-400">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-white mb-2">
              Phantom Wallet не обнаружен
            </h3>

            {/* Exact required text */}
            <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/40 text-sm font-medium text-amber-200 leading-relaxed mb-4">
              {errorMessage}
            </div>

            <p className="text-xs text-slate-400 mb-5 leading-relaxed">
              Расширения браузера (включая Phantom) часто блокируются внутри встроенных фреймов предварительного просмотра. Чтобы подключить кошелёк, откройте страницу напрямую в новой вкладке браузера.
            </p>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={openInNewTab}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Открыть в новой вкладке</span>
              </button>

              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="py-2.5 px-4 rounded-xl text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
