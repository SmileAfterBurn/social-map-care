import React from 'react';
import { Map, List, Search, Filter } from 'lucide-react';

interface MobileToolbarProps {
  activeTab: 'map' | 'list';
  onTabChange: (tab: 'map' | 'list') => void;
  onSearch: (term: string) => void;
  onFilterClick: () => void;
  searchTerm: string;
}

export const MobileToolbar: React.FC<MobileToolbarProps> = ({ activeTab, onTabChange, onSearch, onFilterClick, searchTerm }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 py-2 z-30 sm:hidden">
      <div className="flex items-center gap-2">
        <button onClick={() => onTabChange('map')} className={`p-2 rounded-full transition-colors ${activeTab === 'map' ? 'bg-teal-100 text-teal-600' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
          <Map size={24} />
        </button>
        <button onClick={() => onTabChange('list')} className={`p-2 rounded-full transition-colors ${activeTab === 'list' ? 'bg-teal-100 text-teal-600' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
          <List size={24} />
        </button>
      </div>
      <div id="mobile-toolbar-search" className="flex-1 mx-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Пошук за назвою або адресою..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-800 border-transparent rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
      </div>
      <button id="mobile-toolbar-filter" onClick={onFilterClick} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
        <Filter size={24} />
      </button>
    </div>
  );
};