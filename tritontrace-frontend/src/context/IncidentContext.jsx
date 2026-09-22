import React, { createContext, useContext, useState } from 'react';

const IncidentContext = createContext();

export const IncidentProvider = ({ children }) => {
  const [activeIncident, setActiveIncident] = useState(null);
  
  // interactionMode: 'none' | 'pick_coordinate' | 'draw_polygon'
  const [interactionMode, setInteractionMode] = useState('none');
  
  const [pickedCoordinate, setPickedCoordinate] = useState(null);
  const [drawnPolygon, setDrawnPolygon] = useState([]); // array of [lon, lat]
  const [cursorCoordinate, setCursorCoordinate] = useState(null); // [lon, lat]
  const [isPolygonClosed, setIsPolygonClosed] = useState(false);
  const [panToCoordinate, setPanToCoordinate] = useState(null); // {lat, lon}
  
  // Phase 5 Additions
  const baseHindcastParticles = [
    { lon: 28.2, lat: 31.8, age: 0 },
    { lon: 28.22, lat: 31.82, age: 0 },
    { lon: 28.25, lat: 31.85, age: 0 }
  ];
  
  const [hindcastData, setHindcastData] = useState(baseHindcastParticles);
  const [correlationMarker, setCorrelationMarker] = useState(null); // [lon, lat]
  
  const updateHindcastTimeline = (offsetHours) => {
    // Simulate reverse drift: shift particles southwest slightly based on offset
    // offsetHours is negative (e.g. -24 to 0)
    const driftFactorX = 0.005; // lon drift per hour
    const driftFactorY = 0.003; // lat drift per hour
    
    setHindcastData(baseHindcastParticles.map(p => ({
      lon: p.lon + (offsetHours * driftFactorX),
      lat: p.lat + (offsetHours * driftFactorY),
      age: offsetHours
    })));
  };
  
  // Custom setter for drawn polygon to easily add vertices
  const addPolygonVertex = (coord) => {
    setDrawnPolygon(prev => [...prev, coord]);
  };

  const clearPolygon = () => {
    setDrawnPolygon([]);
    setCursorCoordinate(null);
    setIsPolygonClosed(false);
  };

  const [activeAnalysisMode, setActiveAnalysisMode] = useState('none'); // 'none' | 'attribution' | 'forward_track'

  const value = {
    activeIncident,
    setActiveIncident,
    interactionMode,
    setInteractionMode,
    pickedCoordinate,
    setPickedCoordinate,
    drawnPolygon,
    setDrawnPolygon,
    addPolygonVertex,
    clearPolygon,
    cursorCoordinate,
    setCursorCoordinate,
    isPolygonClosed,
    setIsPolygonClosed,
    panToCoordinate,
    setPanToCoordinate,
    hindcastData,
    updateHindcastTimeline,
    correlationMarker,
    setCorrelationMarker,
    activeAnalysisMode,
    setActiveAnalysisMode
  };

  return (
    <IncidentContext.Provider value={value}>
      {children}
    </IncidentContext.Provider>
  );
};

export const useIncident = () => {
  const context = useContext(IncidentContext);
  if (context === undefined) {
    throw new Error('useIncident must be used within an IncidentProvider');
  }
  return context;
};
