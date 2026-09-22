import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = "inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950";
  
  const variants = {
    primary: "bg-slate-800 border-slate-700 text-slate-100 hover:bg-slate-700 focus:ring-slate-500 shadow-sm",
    action: "bg-cyan-900 border-cyan-700 text-cyan-100 hover:bg-cyan-800 focus:ring-cyan-500 shadow-sm",
    danger: "bg-rose-900/50 border-rose-800 text-rose-100 hover:bg-rose-900 focus:ring-rose-500",
    ghost: "border-transparent bg-transparent text-slate-400 hover:text-slate-100 hover:bg-slate-800"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
