import React from 'react';

const MetricReadout = ({ label, value, unit, trend }) => {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1">
        {label}
      </span>
      <div className="flex items-baseline gap-1">
        <span className="font-mono text-lg text-slate-100">{value}</span>
        {unit && <span className="text-xs text-slate-400">{unit}</span>}
        {trend === 'up' && <span className="text-rose-500 ml-1 text-xs">A-</span>}
        {trend === 'down' && <span className="text-emerald-400 ml-1 text-xs">A-</span>}
      </div>
    </div>
  );
};

export default MetricReadout;
