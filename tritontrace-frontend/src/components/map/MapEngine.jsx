import React, { useState, useEffect } from 'react';
import { MapboxEngine } from './MapboxEngine';
import { LeafletEngine } from './LeafletEngine';
import { LayerControl } from './LayerControl';
import { MapLegend } from './MapLegend';

// Simple Error Boundary to catch Mapbox crashes (e.g. bad token format triggering a WebGL error)
class MapErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("MapEngine caught an error, falling back to Leaflet:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const INITIAL_LAYERS = [
  { id: 'sar_slick', label: 'SAR Slick Polygons', active: true, color: 'bg-cyan-400' },
  { id: 'hindcast', label: 'Hindcast Particles', active: true, color: 'bg-rose-500' },
  { id: 'ais_tracks', label: 'AIS Vessel Tracks', active: false, color: 'bg-amber-400' },
];

export const MapEngine = () => {
  const [layers, setLayers] = useState(INITIAL_LAYERS);

  const toggleLayer = (id) => {
    setLayers(layers.map(layer => 
      layer.id === id ? { ...layer, active: !layer.active } : layer
    ));
  };

  const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  
  // AOI config from PRD
  const initialViewState = {
    latitude: parseFloat(import.meta.env.VITE_DEFAULT_LAT) || 31.5000,
    longitude: parseFloat(import.meta.env.VITE_DEFAULT_LON) || 28.5000,
    zoom: parseFloat(import.meta.env.VITE_DEFAULT_ZOOM) || 5.2
  };

  const useFallback = !token || token.trim() === '';

  const MapComponent = () => {
    if (useFallback) {
      return (
        <div className="w-full h-full relative">
          {/* Debug badge to prove fallback is active */}
          <div className="absolute top-4 left-4 z-[999] px-2 py-1 bg-amber-500/20 border border-amber-500/50 text-amber-500 text-[10px] font-mono rounded pointer-events-none">
            [SYS] LEAFLET FALLBACK ACTIVE
          </div>
          <LeafletEngine initialViewState={initialViewState} layers={layers} />
        </div>
      );
    }

    return (
      <MapErrorBoundary 
        fallback={
          <div className="w-full h-full relative">
            <div className="absolute top-4 left-4 z-[999] px-2 py-1 bg-amber-500/20 border border-amber-500/50 text-amber-500 text-[10px] font-mono rounded pointer-events-none">
              [SYS] MAPBOX ERROR - LEAFLET FALLBACK
            </div>
            <LeafletEngine initialViewState={initialViewState} layers={layers} />
          </div>
        }
      >
        <MapboxEngine 
          initialViewState={initialViewState} 
          mapboxAccessToken={token}
          layers={layers}
        />
      </MapErrorBoundary>
    );
  };

  return (
    <div className="absolute inset-0 isolate">
      <MapComponent />
      
      {/* Shared Floating Map UI */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-3">
        <LayerControl layers={layers} toggleLayer={toggleLayer} />
        <MapLegend />
      </div>
    </div>
  );
};
