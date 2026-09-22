import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { MapEngine } from '../map/MapEngine';
import { TopHUD } from '../common/TopHUD';
import { NormalUserPortal } from '../normal/NormalUserPortal';
import { InvestigatorPortal } from '../investigator/InvestigatorPortal';
import { CommercialPortal } from '../commercial/CommercialPortal';
import { IncidentProvider } from '../../context/IncidentContext';

export const RoleGuard = () => {
  const { user } = useAuth();

  const renderPortal = () => {
    switch (user?.role) {
      case 'Normal User':
        return <NormalUserPortal />;
      case 'Lead Investigator':
        return <InvestigatorPortal />;
      case 'Commercial Operator':
        return <CommercialPortal />;
      default:
        // Fallback for an unknown role or logged out state
        return (
          <div className="min-h-screen bg-slate-950 font-sans text-slate-200 flex flex-col overflow-hidden">
            <TopHUD />
            <main className="flex-1 relative isolate">
              <MapEngine />
            </main>
          </div>
        );
    }
  };

  return (
    <IncidentProvider>
      {renderPortal()}
    </IncidentProvider>
  );
};
