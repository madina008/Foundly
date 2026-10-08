import React, { useState } from 'react';
import { X, MapPin, Calendar, User, CheckCircle2, MessageSquare, Building2, Send, Sparkles } from 'lucide-react';
import { MatchResultItem } from '../types';

interface ItemDetailModalProps {
  matchItem: MatchResultItem;
  onClose: () => void;
  onBackToResults: () => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  matchItem,
  onClose,
  onBackToResults,
}) => {
  const { item, similarityScore, matchReasons } = matchItem;

  // View state: 'details' | 'contact_form' | 'contact_success'
  const [viewState, setViewState] = useState<'details' | 'contact_form' | 'contact_success'>('details');
  const [verificationNote, setVerificationNote] = useState('');
  const [handoffMethod, setHandoffMethod] = useState<'desk' | 'chat'>('desk');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendClaim = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setViewState('contact_success');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0e1424] border border-slate-700/80 rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative text-left">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900/80 border border-slate-700/60 hover:bg-slate-800 transition-colors"
          title="Закрыть"
        >
          <X className="w-5 h-5" />
        </button>

        {/* DETAILS VIEW */}
        {viewState === 'details' && (
          <div>
            {/* Top Image Banner */}
            <div className="relative h-60 w-full overflow-hidden rounded-t-2xl bg-slate-900">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e1424] via-[#0e1424]/30 to-transparent" />
              
              <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
                <div>
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-purple-900/90 text-purple-200 border border-purple-500/40">
                    Категория: {item.category}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-1.5 drop-shadow-md">
                    {item.title}
                  </h2>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-purple-500/60 text-purple-200 text-xs font-bold shrink-0">
                  {similarityScore}% сходство
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Meta Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                  <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Место обнаружения</span>
                    <span className="text-slate-200 font-medium">{item.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                  <Calendar className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Дата и время</span>
                    <span className="text-slate-200 font-medium">{item.date}, {item.time}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                  <User className="w-4 h-4 text-purple-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Кто нашёл</span>
                    <span className="text-slate-200 font-medium">{item.finderName} ({item.finderType})</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                  <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Где хранится сейчас</span>
                    <span className="text-slate-200 font-medium">{item.storagePlace}</span>
                  </div>
                </div>
              </div>

              {/* Description & Distinctive Features */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Описание нашедшего:
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/80">
                  {item.description}
                </p>
              </div>

              {/* Distinctive Features */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Особые приметы предмета:
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {item.distinctiveFeatures.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* AI Matching Analysis Metrics */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/40 to-indigo-950/40 border border-purple-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Оценка совпадения Foundly AI
                    </span>
                  </div>
                  <span className="text-xs text-purple-300 font-bold">
                    {similarityScore}%
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Визуальное</span>
                    <span className="text-xs font-bold text-emerald-400">{matchReasons.visual}%</span>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Семантика</span>
                    <span className="text-xs font-bold text-purple-400">{matchReasons.semantic}%</span>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Локация</span>
                    <span className="text-xs font-bold text-cyan-400">{matchReasons.location}%</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 italic">
                  *Тестовые коэффициенты подобраны демонстрационным алгоритмом.
                </p>
              </div>

              {/* Modal Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setViewState('contact_form')}
                  className="flex-1 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Связаться с нашедшим</span>
                </button>

                <button
                  type="button"
                  onClick={onBackToResults}
                  className="py-3 px-4 rounded-xl text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  Вернуться к списку
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CONTACT FORM VIEW */}
        {viewState === 'contact_form' && (
          <form onSubmit={handleSendClaim} className="p-6 space-y-5">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                Шаг 2 из 2
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                Подтверждение владения и связь
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Для безопасного возврата вещи «{item.title}»
              </p>
            </div>

            {/* Prompt for distinct proof */}
            <div className="space-y-2">
              <label htmlFor="proof" className="block text-xs font-semibold text-slate-200">
                Опишите скрытые приметы вещи, чтобы нашедший убедился, что это вы:
              </label>
              <textarea
                id="proof"
                rows={3}
                value={verificationNote}
                onChange={(e) => setVerificationNote(e.target.value)}
                placeholder="Например: Внутри кейса небольшая черная точка, правый наушник разряжен быстрее, в телефоне отображается имя «AirPods - Alexey»..."
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 focus:border-purple-500 text-sm text-slate-100 placeholder-slate-500 outline-none"
              />
              <p className="text-[11px] text-slate-400">
                🔒 Эта информация передается для верификации и помогает защитить вещь от ложных претендентов.
              </p>
            </div>

            {/* Preferred Handoff Method */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-200">
                Способ получения вещи:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setHandoffMethod('desk')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    handoffMethod === 'desk'
                      ? 'bg-purple-950/40 border-purple-500 text-purple-200'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold text-xs text-white">
                    <Building2 className="w-4 h-4 text-purple-400" />
                    <span>Бюро находок кампуса</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {item.storagePlace}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setHandoffMethod('chat')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    handoffMethod === 'chat'
                      ? 'bg-purple-950/40 border-purple-500 text-purple-200'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold text-xs text-white">
                    <MessageSquare className="w-4 h-4 text-cyan-400" />
                    <span>Анонимный чат Foundly</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    С нашедшим ({item.finderName})
                  </p>
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-3 flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Отправка...' : 'Отправить запрос на возврат'}</span>
              </button>

              <button
                type="button"
                onClick={() => setViewState('details')}
                className="py-3 px-4 rounded-xl text-sm font-medium text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
              >
                Назад
              </button>
            </div>
          </form>
        )}

        {/* CONTACT SUCCESS DEMO CONFIRMATION VIEW */}
        {viewState === 'contact_success' && (
          <div className="p-8 text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">
                Запрос на возврат отправлен!
              </h3>
              <p className="text-sm text-slate-300 mt-2 max-w-md mx-auto">
                Нашедший ({item.finderName}) получил уведомление в кампус-системе.
              </p>
            </div>

            {/* Action Card with Pickup Info */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="text-slate-400 font-semibold uppercase text-[10px]">
                Пункт выдачи:
              </div>
              <p className="text-white font-medium flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-400" />
                {item.storagePlace}
              </p>
              <div className="text-slate-400 text-[11px] pt-1 border-t border-slate-800">
                Предъявите студенческий билет или документ, подтверждающий личность, для сверки.
              </div>
            </div>

            {/* Disclaimer for demo mode */}
            <div className="p-3 rounded-lg bg-purple-950/30 border border-purple-800/40 text-[11px] text-purple-300/90 max-w-md mx-auto">
              ℹ️ <strong>Демонстрационный режим:</strong> Это рабочий прототип MVP. Реальные push-уведомления и SMS не отправляются, чтобы не спамить тестовыми данными.
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold bg-purple-600 hover:bg-purple-500 text-white transition-all"
              >
                Завершить
              </button>

              <button
                type="button"
                onClick={onBackToResults}
                className="py-2.5 px-4 rounded-xl text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                Вернуться к поиску
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
