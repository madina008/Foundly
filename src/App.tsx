/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { SearchForm } from './components/SearchForm';
import { ScanProgress } from './components/ScanProgress';
import { MatchResults } from './components/MatchResults';
import { ItemDetailModal } from './components/ItemDetailModal';
import { ReportFoundModal } from './components/ReportFoundModal';
import { matchLostItems } from './utils/matchingEngine';
import { MatchResultItem, SearchQuery } from './types';
import { WalletProvider } from './context/WalletContext';

function MainApp() {
  const [currentQuery, setCurrentQuery] = useState<SearchQuery>({
    description: 'Белые беспроводные наушники',
    category: 'electronics',
    location: 'Университет, библиотека',
  });

  const [isScanning, setIsScanning] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [matchResults, setMatchResults] = useState<MatchResultItem[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<MatchResultItem | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [txSignature, setTxSignature] = useState<string | null>(null);

  // Trigger search with optional blockchain txSignature
  const handleSearch = (query: SearchQuery, signature?: string) => {
    setCurrentQuery(query);
    if (signature) {
      setTxSignature(signature);
    }
    setIsScanning(true);
  };

  // Called after simulated AI scanning finishes (~1.5s)
  const handleScanComplete = () => {
    const results = matchLostItems(currentQuery);
    setMatchResults(results);
    setIsScanning(false);
    setHasSearched(true);
  };

  // Reset or modify search
  const handleResetSearch = () => {
    setHasSearched(false);
    setSelectedMatch(null);
  };

  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col font-sans selection:bg-purple-600/30 selection:text-purple-200">
      
      {/* Background ambient lighting effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[720px] h-[400px] bg-purple-700/10 blur-[130px] rounded-full" />
        <div className="absolute top-1/3 -left-32 w-[450px] h-[450px] bg-indigo-700/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-10 -right-20 w-[400px] h-[400px] bg-cyan-700/5 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <Header
        onOpenReportFound={() => setShowReportModal(true)}
        onResetSearch={handleResetSearch}
      />

      {/* Main Content Area */}
      <main className="flex-1 z-10 relative pb-16">
        
        {/* If user hasn't searched yet, show Hero + Search Form */}
        {!hasSearched && !isScanning && (
          <div className="animate-in fade-in duration-300">
            <HeroSection />
            <SearchForm
              onSearch={handleSearch}
              isLoading={isScanning}
              initialQuery={currentQuery}
            />

            {/* How It Works Micro-Section */}
            <div className="max-w-4xl mx-auto px-4 mt-16 pt-8 border-t border-slate-900">
              <div className="text-center mb-8">
                <span className="text-[11px] font-bold uppercase tracking-widest text-purple-400">
                  Архитектура платформы
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  Как Foundly возвращает вещи
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs mb-3">
                    01
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-1">
                    Единая база кампуса
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Все находки из чатов общежитий, постов охраны и библиотек агрегируются в одном защищённом реестре.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs mb-3">
                    02
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-1">
                    AI-сопоставление
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Векторный поиск сопоставляет описания, форму, цвет, гео-координаты и время потери без ручной модерации.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs mb-3">
                    03
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-1">
                    Защита в Solana Devnet
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Запрос на поиск фиксируется через инструкцию Memo в блокчейне Solana Devnet для подтверждения времени и статуса.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scanning State */}
        {isScanning && (
          <div className="pt-8">
            <ScanProgress
              queryText={currentQuery.description}
              onComplete={handleScanComplete}
            />
          </div>
        )}

        {/* Match Results State */}
        {hasSearched && !isScanning && (
          <div className="pt-4">
            <MatchResults
              results={matchResults}
              query={currentQuery}
              onSelectMatch={(match) => setSelectedMatch(match)}
              onResetSearch={handleResetSearch}
              txSignature={txSignature}
            />
          </div>
        )}
      </main>

      {/* Item Detail Modal */}
      {selectedMatch && (
        <ItemDetailModal
          matchItem={selectedMatch}
          onClose={() => setSelectedMatch(null)}
          onBackToResults={() => setSelectedMatch(null)}
        />
      )}

      {/* Report Found Modal */}
      {showReportModal && (
        <ReportFoundModal
          onClose={() => setShowReportModal(false)}
          onItemAdded={() => {
            setShowReportModal(false);
          }}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#06080e] py-6 px-4 text-xs text-slate-400 z-10 relative">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">Foundly</span>
            <span className="text-slate-600">•</span>
            <span>AI Lost & Found Network</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Прототип для университетов и кампусов</span>
            <span className="text-slate-700">•</span>
            <span className="text-slate-400">8 октября 2026 г.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <WalletProvider>
      <MainApp />
    </WalletProvider>
  );
}
