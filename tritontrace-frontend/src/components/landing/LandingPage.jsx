import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Satellite, ChevronRight, ChevronDown, Crosshair } from 'lucide-react';
import { LiquidMetalButton } from '../common/LiquidMetalButton';
import Button from '../common/Button';
import MetricReadout from '../common/MetricReadout';

const MiniOperationalMap = () => (
  <div className="relative w-full h-[400px] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center isolate">
    {/* Subtle grid */}
    <div 
      className="absolute inset-0 opacity-20 pointer-events-none" 
      style={{ backgroundImage: 'linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
    />
    
    <svg viewBox="0 0 400 300" className="w-full h-full opacity-80 mix-blend-screen">
      {/* Coastline / landmass abstraction (Mediterranean feel) */}
      <path 
        d="M 0 50 Q 50 80 100 60 T 200 100 T 300 80 T 400 120 L 400 0 L 0 0 Z" 
        className="fill-slate-900/80 stroke-slate-800 stroke-1" 
      />
      <path 
        d="M 0 250 Q 80 220 150 260 T 250 280 T 400 240 L 400 300 L 0 300 Z" 
        className="fill-slate-900/80 stroke-slate-800 stroke-1" 
      />

      {/* SAR Slick Polygon */}
      <polygon 
        points="180,140 195,135 220,145 210,160 185,155" 
        className="fill-cyan-500/20 stroke-cyan-400 stroke-1 animate-pulse" 
      />
      
      {/* AIS Vessel Tracks */}
      <path 
        d="M 120 180 L 150 160 L 175 145" 
        className="fill-none stroke-slate-500 stroke-1"
        strokeDasharray="4 4"
      />
      <path 
        d="M 280 110 L 250 125 L 225 140" 
        className="fill-none stroke-slate-500 stroke-1"
        strokeDasharray="4 4"
      />
      <path 
        d="M 200 220 L 205 180 L 210 150" 
        className="fill-none stroke-amber-500/50 stroke-1"
        strokeDasharray="2 2"
      />

      {/* Correlation / Origin Marker */}
      <circle cx="202" cy="148" r="4" className="fill-rose-500" />
      <circle cx="202" cy="148" r="12" className="fill-none stroke-rose-500/50 stroke-1 animate-ping" />
      
      {/* Vessel markers */}
      <polygon points="120,180 116,186 124,186" className="fill-slate-400" transform="rotate(30 120 180)" />
      <polygon points="280,110 276,104 284,104" className="fill-slate-400" transform="rotate(-30 280 110)" />
      <polygon points="200,220 196,228 204,228" className="fill-amber-400" transform="rotate(10 200 220)" />
      
      {/* Scanning Radar Line (subtle) */}
      <line x1="202" y1="148" x2="350" y2="0" className="stroke-cyan-500/20 stroke-1">
        <animateTransform attributeName="transform" type="rotate" from="0 202 148" to="360 202 148" dur="10s" repeatCount="indefinite" />
      </line>
    </svg>

    <div className="absolute top-4 right-4 flex items-center gap-2">
      <div className="px-2 py-1 bg-slate-900/80 border border-slate-700 rounded text-[10px] font-mono text-cyan-400 flex items-center gap-1 shadow-sm">
        <Crosshair className="w-3 h-3" />
        TARGET LOCK
      </div>
    </div>
  </div>
);

const LandingPage = () => {
  const { enterGateway } = useAuth();
  
  return (
    <div className="min-h-screen font-sans flex flex-col bg-white overflow-x-hidden">
      {/* Public Navigation - Light Theme */}
      <nav className="h-20 border-b border-slate-200 bg-white/90 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Satellite className="w-6 h-6 text-slate-900" />
          <span className="font-bold tracking-widest text-xl text-slate-900">TRITONTRACE</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
          <button className="hover:text-slate-900 transition-colors">Methodology</button>
          <button className="hover:text-slate-900 transition-colors">Coverage</button>
          <button className="hover:text-slate-900 transition-colors">Documentation</button>
        </div>
      </nav>

      {/* Hero Section - Stark White, Spacious */}
      <section className="relative w-full px-8 py-32 flex flex-col items-center text-center bg-white">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-xs font-mono font-medium shadow-sm uppercase tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            MARITIME FORENSIC INTELLIGENCE
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-[1.1] text-slate-900 uppercase">
            TRACKING MARINE OIL <br />
            <span className="text-slate-400">POLLUTION FROM ORBIT</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-500 leading-relaxed max-w-3xl mx-auto font-light">
            Advanced synthetic aperture radar (SAR) detection, Lagrangian hindcasting, and AIS correlation for rapid attribution of maritime anomalies.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <LiquidMetalButton label="ENTER OPERATIONS CONSOLE" onClick={enterGateway} />
          </div>
        </div>
        
        {/* Scroll Cue linking to dark section */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <ChevronDown className="w-6 h-6 text-slate-300 animate-bounce" />
        </div>
      </section>

      {/* Dark Section - Workflow & Telemetry */}
      <section className="w-full bg-slate-950 py-24 border-t border-slate-900 relative">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Workflow Explanation */}
          <div className="lg:col-span-5 space-y-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white mb-4">
                Global Monitoring Pipeline
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                TritonTrace fuses multi-modal satellite data to identify unauthorized discharge events and confidently attribute them to specific vessels within hours.
              </p>
            </div>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center font-mono text-cyan-400 text-sm border border-slate-800 shrink-0">1</div>
                <div>
                  <h3 className="font-semibold text-slate-100 text-lg">SAR DETECTION</h3>
                  <p className="text-slate-500 mt-1 leading-relaxed">Automated satellite identification of geometric anomalies matching known pollution signatures.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center font-mono text-cyan-400 text-sm border border-slate-800 shrink-0">2</div>
                <div>
                  <h3 className="font-semibold text-slate-100 text-lg">LAGRANGIAN HINDCAST</h3>
                  <p className="text-slate-500 mt-1 leading-relaxed">Simulated environmental drift modeling to estimate the original source location and time.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center font-mono text-cyan-400 text-sm border border-slate-800 shrink-0">3</div>
                <div>
                  <h3 className="font-semibold text-slate-100 text-lg">AIS CORRELATION</h3>
                  <p className="text-slate-500 mt-1 leading-relaxed">Cross-referencing historical vessel telemetry to assign analytical classification confidence.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Operational Map & Stats */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <MiniOperationalMap />
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 flex flex-col justify-between hover:bg-slate-900 transition-colors">
                <MetricReadout label="AREA SEGMENTED" value="1.4M" unit="km²" />
                <span className="text-[10px] text-slate-500 font-mono mt-3">LAST 24 HOURS</span>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 flex flex-col justify-between hover:bg-slate-900 transition-colors">
                <MetricReadout label="HINDCAST HORIZON" value="72" unit="hrs" />
                <span className="text-[10px] text-slate-500 font-mono mt-3">MODEL: ERA5</span>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 flex flex-col justify-between hover:bg-slate-900 transition-colors">
                <MetricReadout label="CLASSIFICATION CONFIDENCE" value="94.2" unit="%" />
                <span className="text-[10px] text-slate-500 font-mono mt-3">AI CERTAINTY</span>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 flex flex-col justify-between hover:bg-slate-900 transition-colors">
                <MetricReadout label="VESSELS CORRELATED" value="14,204" />
                <span className="text-[10px] text-slate-500 font-mono mt-3">AIS DB MATCH</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Light Gray Section - Data Strip */}
      <section className="w-full bg-slate-50 border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-8">
            <h3 className="font-mono text-xs text-slate-400 tracking-[0.2em] uppercase">Primary Data Integrations</h3>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-20 grayscale opacity-70">
            <div className="font-serif italic text-2xl font-bold text-slate-500">Sentinel-1</div>
            <div className="font-sans font-black tracking-tighter text-3xl text-slate-500">NOAA</div>
            <div className="font-mono font-bold text-lg text-slate-500 tracking-wider">Marine Cadastre AIS</div>
            <div className="font-sans font-bold text-2xl text-slate-500 tracking-tighter">MAPBOX</div>
            <div className="font-serif font-bold text-2xl text-slate-500 tracking-tight">Copernicus</div>
          </div>
        </div>
      </section>

      {/* Global Footer - White */}
      <footer className="w-full bg-white py-12">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Satellite className="w-5 h-5 text-slate-900" />
            <span className="font-bold tracking-widest text-sm text-slate-900">TRITONTRACE</span>
            <span className="text-slate-400 text-sm ml-4 border-l border-slate-200 pl-4">© 2026 All Rights Reserved.</span>
          </div>
          <div className="flex items-center gap-8 text-sm font-medium text-slate-500">
            <button className="hover:text-slate-900 transition-colors">Privacy Policy</button>
            <button className="hover:text-slate-900 transition-colors">Terms of Service</button>
            <button className="hover:text-slate-900 transition-colors">System Status</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
