import React from 'react';
import { AuthModal } from './AuthModal';

export const GatewayView = () => {
  return (
    <div className="relative min-h-screen w-full bg-slate-950 overflow-hidden flex items-center justify-center isolate">
      
      {/* 1. Tactical Grid Pattern */}
      <div className="absolute inset-0 opacity-40 bg-[image:linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      {/* 2. Glowing Orb / Radial Gradient */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[800px] h-[800px] bg-cyan-900/30 rounded-full blur-[100px]" />
      </div>

      {/* 3. Dark Overlay & Heavy Blur */}
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-lg z-10" />

      {/* 4. Auth Modal (Centered with High Z-Index) */}
      <div className="relative z-20 w-full px-4 flex justify-center">
        <AuthModal />
      </div>
    </div>
  );
};
