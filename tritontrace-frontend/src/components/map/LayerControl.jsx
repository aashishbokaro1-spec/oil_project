import React from 'react';
import { Layers, Eye, EyeOff } from 'lucide-react';

export const LayerControl = ({ layers, toggleLayer }) => {
  return (
    <div className="w-64 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl flex flex-col overflow-hidden shrink-0">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-950/50">
        <Layers className="w-4 h-4 text-cyan-500" />
        <h3 className="text-xs font-bold tracking-widest text-slate-200 uppercase">Telemetry Layers</h3>
      </div>
      <div className="flex flex-col p-2 space-y-1">
        {layers.map(layer => (
          <button 
            key={layer.id}
            onClick={() => toggleLayer(layer.id)}
            className={`flex items-center justify-between px-3 py-2 rounded-md transition-colors ${
              layer.active ? 'bg-slate-800/50 hover:bg-slate-800' : 'hover:bg-slate-800/30'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${layer.active ? layer.color : 'bg-slate-700'}`} />
              <span className={`text-xs ${layer.active ? 'text-slate-200' : 'text-slate-500'}`}>
                {layer.label}
              </span>
            </div>
            {layer.active ? (
              <Eye className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <EyeOff className="w-3.5 h-3.5 text-slate-600" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
