import React from 'react';
import { X, Terminal, Gauge, Cpu } from 'lucide-react';

interface CodeFixModalProps {
  logs: string[];
  onClose: () => void;
}

export const CodeFixModal: React.FC<CodeFixModalProps> = ({ logs, onClose }) => {
  return (
    <div className="absolute bottom-6 left-6 z-[4000] w-80 bg-slate-900/95 backdrop-blur-xl border border-indigo-500/40 rounded-3xl p-5 shadow-2xl animate-in slide-in-from-left-4 duration-500">
      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse ring-4 ring-indigo-500/20"></div>
          <span className="text-[11px] font-black uppercase tracking-widest text-indigo-300">System Intelligence</span>
        </div>
        <button onClick={onClose} className="p-1 text-slate-500 hover:text-white transition-colors">
          <X size={14} />
        </button>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar font-mono text-[9px] leading-relaxed">
        {logs.length > 0 ? (
          logs.map((log, i) => (
            <div key={i} className={`${i === 0 ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}>
              <span className="opacity-30 mr-2">{'>'}</span>
              {log}
            </div>
          ))
        ) : (
          <div className="text-slate-600 italic flex items-center gap-2">
            <Cpu size={10} /> Ініціалізація трасування...
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[8px] font-bold text-slate-500 uppercase tracking-tight">
          <Terminal size={10} /> Active Session: UA-440
        </div>
        <Gauge size={12} className="text-indigo-500/50" />
      </div>
    </div>
  );
};
