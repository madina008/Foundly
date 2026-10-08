import React, { useState } from 'react';
import { X, CheckCircle2, Upload, MapPin, Sparkles, PlusCircle } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import { CategoryType } from '../types';

interface ReportFoundModalProps {
  onClose: () => void;
  onItemAdded?: (title: string) => void;
}

export const ReportFoundModal: React.FC<ReportFoundModalProps> = ({ onClose, onItemAdded }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryType>('electronics');
  const [location, setLocation] = useState('Университет, библиотека');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (onItemAdded && title) {
      onItemAdded(title);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0f1422] border border-slate-700/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-left">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <PlusCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Сообщить о находке</h3>
                <p className="text-xs text-slate-400">Помогите вернуть вещь владельцу быстрее</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Название предмета</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Например: Чехол с очками Ray-Ban"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Категория</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 outline-none focus:border-purple-500"
              >
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Где нашли?</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Корпус, этаж, аудитория"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Краткое описание и приметы</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Цвет, состояние, где оставили на хранение..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 outline-none focus:border-purple-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Зарегистрировать находку в Foundly AI</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Вещь успешно зарегистрирована!</h3>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              AI-модель Foundly уже включила предмет в векторный индекс. Владелец получит совпадение при первом запросе.
            </p>
            <button
              onClick={onClose}
              className="mt-3 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-all"
            >
              Вернуться к главной странице
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
