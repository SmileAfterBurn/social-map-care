import React from 'react';
import { X, LayoutGrid } from 'lucide-react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  selectedCategories: string[];
  onToggleCategory: (category: string) => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, categories, selectedCategories, onToggleCategory }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-end sm:items-center">
      <div className="bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-2xl shadow-xl w-full max-w-lg p-6 animate-in-bottom-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Фільтри</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
            <X size={24} />
          </button>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Категорії</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => onToggleCategory(category)}
                className={`px-4 py-2 text-sm font-medium rounded-full border transition-colors flex items-center gap-2 ${
                  selectedCategories.includes(category)
                    ? 'bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/50 dark:text-teal-300 dark:border-teal-800'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700'
                }`}>
                <LayoutGrid size={14} />
                {category}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-8 text-center">
            <button onClick={onClose} className="w-full max-w-xs py-3 bg-teal-600 text-white rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-teal-700 transition-all active:scale-95">
              Застосувати
            </button>
          </div>
      </div>
    </div>
  );
};