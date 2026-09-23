import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const MapLegend = () => {
  return (
    <div className="w-64 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-4 flex flex-col gap-4 shrink-0">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <ShieldAlert className="w-4 h-4 text-slate-500" />
        <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase">Visual Legend</h3>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-cyan-500/20 border border-cyan-400 rounded-sm" />
          <span className="text-xs font-medium text-slate-300">Detected Oil Spill (SAR)</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex gap-0.5">
            <div className="w-1.5 h-1.5 bg-rose-500/40 rounded-full" />
            <div className="w-1.5 h-1.5 bg-rose-500/60 rounded-full" />
            <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
          </div>
          <span className="text-xs font-medium text-slate-300">Hindcast Trajectory</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-4 border-t-2 border-dashed border-amber-400" />
          <span className="text-xs font-medium text-slate-300">AIS Vessel Route</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full border-[2px] border-rose-500 flex items-center justify-center">
            <div className="w-1 h-1 bg-rose-500 rounded-full" />
          </div>
          <span className="text-xs font-medium text-slate-300">Correlation Point</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-dashed border-amber-500 bg-amber-500/20" />
          <span className="text-xs font-medium text-slate-300">Watch Zone (50km)</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-rose-500 bg-rose-500/20" />
          <span className="text-xs font-medium text-slate-300">Critical Strike Zone (15km)</span>
        </div>
      </div>
    </div>
  );
};
