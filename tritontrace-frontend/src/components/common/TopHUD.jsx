import React, { useEffect, useState } from 'react';
import { Satellite, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useIncident } from '../../context/IncidentContext';
import Button from './Button';

export const TopHUD = () => {
  const { user, logout } = useAuth();
  const { activeIncident } = useIncident();
  const [time, setTime] = useState(new Date().toISOString().substring(11, 19));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toISOString().substring(11, 19));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-6 z-50 shrink-0">
      <div className="flex items-center gap-4">
        <Satellite className="w-5 h-5 text-cyan-500" />
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-widest text-xs text-slate-200">TRITONTRACE</span>
          <span className="text-slate-600">/</span>
          <span className="text-xs font-mono text-slate-400">OPERATIONS</span>
          
          {activeIncident && (
            <>
              <span className="text-slate-600">/</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-cyan-400 tracking-wider">
                {activeIncident}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-xs font-mono text-slate-500">
          {time} UTC
        </div>

        {/* Active Session Info */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{user?.agency}</span>
            <span className="text-xs font-mono text-cyan-400">{user?.role}</span>
          </div>
          <div className="w-8 h-8 rounded bg-slate-800 border border-slate-700 flex items-center justify-center">
            <span className="text-xs font-bold text-slate-300">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
        </div>

        <div className="w-px h-6 bg-slate-800" />

        {/* Logout Action */}
        <Button 
          variant="ghost" 
          onClick={logout}
          className="text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
        >
          <LogOut className="w-3.5 h-3.5" />
          DISCONNECT
        </Button>
      </div>
    </header>
  );
};

