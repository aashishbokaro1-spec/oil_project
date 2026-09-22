import React, { useState } from 'react';
import { User, Shield, Briefcase, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';

const ROLES = [
  {
    id: 'investigator',
    title: 'Lead Investigator',
    description: 'Full telemetry access, correlation tools, and case management.',
    icon: Shield,
    color: 'text-cyan-400',
    border: 'border-cyan-500/30 hover:border-cyan-400',
    bg: 'bg-cyan-500/10'
  },
  {
    id: 'operator',
    title: 'Commercial Operator',
    description: 'Fleet monitoring, automated alerting, and compliance reporting.',
    icon: Briefcase,
    color: 'text-amber-400',
    border: 'border-amber-500/30 hover:border-amber-400',
    bg: 'bg-amber-500/10'
  },
  {
    id: 'user',
    title: 'Normal User',
    description: 'Read-only access to public satellite telemetry and dashboards.',
    icon: User,
    color: 'text-slate-400',
    border: 'border-slate-700 hover:border-slate-500',
    bg: 'bg-slate-800'
  }
];

export const AuthModal = () => {
  const { login, exitGateway } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(null);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agency, setAgency] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setStep(2);
    setError('');
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setError('');
    } else {
      exitGateway(); // Go back to landing page
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Simple non-empty string validation
    if (!email.trim() || !password.trim() || !agency.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);

    // Mock network request
    setTimeout(() => {
      login(selectedRole.title, { email, agency });
    }, 800);
  };

  return (
    <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col relative">
      {/* Header */}
      <div className="flex items-center px-6 py-4 border-b border-slate-800 bg-slate-900/50">
        <button 
          onClick={handleBack}
          className="text-slate-400 hover:text-slate-200 transition-colors p-1 -ml-2 rounded flex items-center justify-center"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 text-center pr-5">
          <h2 className="text-sm font-bold tracking-widest text-slate-200 uppercase">
            {step === 1 ? 'Select Authorization Profile' : 'Authenticate Session'}
          </h2>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {step === 1 && (
          <div className="flex flex-col gap-3">
            {ROLES.map((role) => {
              const Icon = role.icon;
              return (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role)}
                  className={`flex items-start text-left gap-4 p-4 rounded-lg border ${role.border} bg-slate-900/50 hover:bg-slate-800 transition-all group`}
                >
                  <div className={`p-2 rounded-md ${role.bg} ${role.color} shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-200 text-sm">{role.title}</h3>
                    <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                      {role.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {step === 2 && selectedRole && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Summary Chip */}
            <div className="flex items-center gap-3 p-3 rounded bg-slate-950 border border-slate-800">
              <selectedRole.icon className={`w-4 h-4 ${selectedRole.color}`} />
              <span className="text-xs font-mono text-slate-400">
                REQUESTING ACCESS AS <strong className="text-slate-200 font-sans tracking-wide">{selectedRole.title.toUpperCase()}</strong>
              </span>
            </div>

            {error && (
              <div className="px-3 py-2 bg-rose-500/10 border border-rose-500/20 rounded text-rose-400 text-xs font-mono">
                [ERROR] {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 tracking-wider uppercase">Official Email</label>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-700"
                  placeholder="agent@agency.gov"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 tracking-wider uppercase">Agency / IMO Identifier</label>
                <input 
                  type="text"
                  value={agency}
                  onChange={(e) => setAgency(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-700"
                  placeholder="e.g. EMSA-782"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 tracking-wider uppercase">Secure Password</label>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-700"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full mt-2 h-10 flex items-center justify-center bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'ESTABLISH SECURE LINK'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};
