import React, { useEffect, useRef } from 'react';
import { Organization, UserSession } from '../types';
import { MapPin, Phone, ChevronRight, Clock, Sparkles, Lock, ShieldCheck, Map as MapIcon, Zap, ExternalLink } from 'lucide-react';

interface TableViewProps {
  organizations: Organization[];
  selectedOrgId: string | null;
  onSelectOrg: (id: string) => void;
  onShowOnMap?: (id: string) => void;
  onVerifyOrgAI?: (org: Organization) => void;
  onVerifyBulkAI?: (orgs: Organization[]) => void;
  user: UserSession;
}

export const TableView: React.FC<TableViewProps> = ({ 
  organizations, 
  selectedOrgId, 
  onSelectOrg,
  onShowOnMap,
  onVerifyOrgAI,
  onVerifyBulkAI,
  user
}) => {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const canVerify = user.role === 'Admin' || user.role === 'Manager';

  useEffect(() => {
    if (selectedOrgId && tableContainerRef.current) {
      const selectedRow = tableContainerRef.current.querySelector(`[data-id="${selectedOrgId}"]`);
      if (selectedRow) {
        selectedRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [selectedOrgId]);

  const handleVerifyAll = () => {
    if (user.role !== 'Admin' || !onVerifyBulkAI) return;
    if (confirm(`Запустити групову AI-перевірку для ${organizations.length} організацій? Це дозволить проаналізувати весь список одночасно.`)) {
      onVerifyBulkAI(organizations);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = listRef.current?.children[index + 1] as HTMLElement;
      next?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = listRef.current?.children[index - 1] as HTMLElement;
      prev?.focus();
    }
  };

  return (
    <div 
      className="h-full flex flex-col bg-white dark:bg-slate-950 overflow-hidden transition-colors duration-300" 
      ref={tableContainerRef}
      role="region"
      aria-label="Реєстр доступних організацій"
    >
      {/* Optimized Admin Toolbar */}
      {user.role === 'Admin' && organizations.length > 0 && (
        <div className="shrink-0 p-3 md:p-4 bg-indigo-50/50 dark:bg-indigo-900/10 border-b border-indigo-100 dark:border-indigo-900/30 flex items-center justify-between animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-indigo-600 dark:text-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-700 dark:text-indigo-300">Адмін-панель</span>
          </div>
          <button 
            onClick={handleVerifyAll}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
          >
            <Sparkles size={12} /> Bulk Check ({organizations.length})
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-32 md:pb-6" tabIndex={-1}>
        <ul 
          ref={listRef}
          className="divide-y divide-slate-100 dark:divide-slate-800/50" 
          role="list"
        >
          {organizations.map((org, index) => {
            const isSelected = selectedOrgId === org.id;
            const cleanPhone = org.phone ? org.phone.replace(/[^\d+]/g, '') : '';

            return (
              <li
                key={org.id}
                data-id={org.id}
                role="listitem"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectOrg(org.id);
                  }
                  handleKeyDown(e, index);
                }}
                onClick={() => onSelectOrg(org.id)}
                className={`cursor-pointer transition-all duration-300 group relative p-3.5 md:p-5 outline-none border-l-4 ${
                  isSelected 
                    ? 'bg-teal-50/60 dark:bg-teal-900/20 border-teal-600 dark:border-teal-500 shadow-sm z-10' 
                    : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-900/40'
                }`}
                aria-selected={isSelected}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                         <h3 className={`font-black text-xs md:text-sm lg:text-base leading-tight uppercase tracking-tight truncate transition-colors ${
                           isSelected 
                             ? 'text-teal-900 dark:text-teal-400' 
                             : 'text-slate-800 dark:text-slate-100'
                         }`}>
                           {org.name}
                         </h3>
                         {org.status === 'Active' && (
                           <ShieldCheck size={14} className={`${isSelected ? 'text-teal-500' : 'text-slate-400 dark:text-slate-600'} shrink-0`} />
                         )}
                      </div>
                      
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded transition-colors shrink-0 ${
                          isSelected 
                            ? 'bg-teal-600 text-white shadow-sm' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                        }`}>
                          {org.category.split('/')[0]}
                        </span>
                        <div className={`flex items-center gap-1 text-[10px] md:text-xs truncate transition-colors ${
                          isSelected ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400 dark:text-slate-500'
                        }`}>
                          <MapPin size={12} className="shrink-0 opacity-70" />
                          <span className="truncate">{org.address}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 md:w-5 md:h-5 shrink-0 transition-all duration-300 mt-1 ${
                      isSelected 
                        ? 'text-teal-600 dark:text-teal-400 rotate-90 scale-110' 
                        : 'text-slate-300 dark:text-slate-700 group-hover:translate-x-1'
                    }`} aria-hidden="true" />
                  </div>

                  {/* Collapsible Action Area */}
                  <div className={`grid transition-all duration-300 ease-in-out ${isSelected ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 overflow-hidden'}`}>
                    <div className="overflow-hidden">
                      <div className="flex flex-col sm:flex-row gap-2 mt-3">
                        {org.phone && (
                          <a
                            href={`tel:${cleanPhone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 text-white rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-teal-600/20 active:scale-95 flex-1"
                          >
                            <Phone size={14} /> Подзвонити
                          </a>
                        )}

                        <button
                          onClick={(e) => { e.stopPropagation(); onShowOnMap?.(org.id); }}
                          className="flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-900 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all hover:bg-teal-50 dark:hover:bg-teal-900/30 active:scale-95 flex-1"
                        >
                          <MapIcon size={14} /> Показати на мапі
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <div className="space-y-1">
                           {org.workingHours && (
                            <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">
                               <Clock size={12} className="text-teal-500" />
                               {org.workingHours}
                            </div>
                           )}
                           {org.email && (
                             <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 dark:text-slate-500 lowercase tracking-tight">
                               <ExternalLink size={12} className="text-indigo-400" />
                               {org.email}
                             </div>
                           )}
                        </div>
                        
                        <button
                          disabled={!canVerify}
                          onClick={(e) => { e.stopPropagation(); onVerifyOrgAI?.(org); }}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                              canVerify 
                                ? 'text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30' 
                                : 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                          }`}
                        >
                          {canVerify ? <Sparkles size={12} /> : <Lock size={10} />}
                          AI Перевірка
                        </button>
                      </div>
                      
                      {org.services && (
                        <div className="mt-3 p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800">
                           <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed italic">
                             {org.services}
                           </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
          
          {organizations.length === 0 && (
            <div className="py-24 text-center flex flex-col items-center gap-6 px-6">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center shadow-inner border border-slate-100 dark:border-slate-800">
                <MapPin className="w-10 h-10 text-slate-200 dark:text-slate-700" />
              </div>
              <div className="space-y-2">
                <p className="font-black text-slate-800 dark:text-white uppercase tracking-tight text-base">Реєстр порожній</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest max-w-[200px] mx-auto leading-relaxed">Змініть фільтри для пошуку організацій</p>
              </div>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};