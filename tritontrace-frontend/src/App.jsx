import React from 'react';
import LandingPage from './components/landing/LandingPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GatewayView } from './components/auth/GatewayView';
import { RoleGuard } from './components/workspace/RoleGuard';

const AppContent = () => {
  const { user, gatewayActive } = useAuth();

  if (user) {
    return <RoleGuard />;
  }

  if (gatewayActive) {
    return <GatewayView />;
  }

  return <LandingPage />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
