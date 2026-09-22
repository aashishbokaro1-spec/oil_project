import React from 'react';

const StatusBadge = ({ status = 'normal', label }) => {
  const styles = {
    normal: "bg-emerald-900/30 text-emerald-400 border-emerald-800/50",
    warning: "bg-amber-900/30 text-amber-400 border-amber-800/50",
    danger: "bg-rose-900/30 text-rose-500 border-rose-800/50",
    active: "bg-cyan-900/30 text-cyan-400 border-cyan-800/50",
    neutral: "bg-slate-800 text-slate-300 border-slate-700"
  };

  const activeStyle = styles[status] || styles.neutral;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono border ${activeStyle}`}>
      {label}
    </span>
  );
};

export default StatusBadge;
