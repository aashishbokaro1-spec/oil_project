import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null if unauthenticated, { role, agency } if logged in
  const [gatewayActive, setGatewayActive] = useState(false);

  const enterGateway = () => {
    setGatewayActive(true);
  };

  const exitGateway = () => {
    setGatewayActive(false);
  };

  const login = (role, credentials) => {
    // In Phase 2, this is a mock client-side login.
    setUser({
      role,
      agency: credentials.agency,
      email: credentials.email,
    });
  };

  const logout = () => {
    setUser(null);
    setGatewayActive(false); // Return to public landing page on logout
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        gatewayActive,
        enterGateway,
        exitGateway,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
