import React, { useMemo, useEffect, useRef } from 'react';
import Map, { Source, Layer } from 'react-map-gl/mapbox';
import { useIncident } from '../../context/IncidentContext';
import { mockHistoricalIncidents, mockForwardTrack } from '../../utils/mockData';
import * as turf from '@turf/turf';

export const MapboxEngine = ({ 
  initialViewState, 
  mapboxAccessToken,
  layers,
  children 
}) => {
  const { 
    interactionMode, 
    activeIncident, 
    drawnPolygon, 
    setPickedCoordinate, 
    addPolygonVertex,
    cursorCoordinate,
    setCursorCoordinate,
    panToCoordinate,
    setPanToCoordinate,
    hindcastData,
    correlationMarker,
    activeAnalysisMode
  } = useIncident();

  const mapRef = useRef();

  useEffect(() => {
    if (panToCoordinate && mapRef.current) {
      mapRef.current.flyTo({ center: [panToCoordinate.lon, panToCoordinate.lat], zoom: 12, duration: 2000 });
      setPanToCoordinate(null);
    }
  }, [panToCoordinate, setPanToCoordinate]);

  const isSarVisible = layers.find(l => l.id === 'sar_slick')?.active;
  const isHindcastVisible = layers.find(l => l.id === 'hindcast')?.active;
  const isAisVisible = layers.find(l => l.id === 'ais_tracks')?.active;

  const mockData = useMemo(() => ({
    sar: {
      type: 'FeatureCollection',
      features: [{ type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[28.1, 31.75], [28.3, 31.75], [28.25, 31.85], [28.1, 31.8], [28.1, 31.75]]] } }]
    },
    ais: {
      type: 'FeatureCollection',
      features: [{ type: 'Feature', geometry: { type: 'LineString', coordinates: [[28.0, 31.6], [28.15, 31.78], [28.3, 31.9]] } }]
    }
  }), []);

  const handleMapClick = (e) => {
    if (interactionMode === 'pick_coordinate') {
      setPickedCoordinate({ lat: e.lngLat.lat, lon: e.lngLat.lng });
    } else if (interactionMode === 'draw_polygon' && !isPolygonClosed) {
      const newPoint = [e.lngLat.lng, e.lngLat.lat];
      
      // Auto-close if clicked near the first vertex
      if (drawnPolygon.length >= 3) {
        const firstPoint = drawnPolygon[0];
        const dist = turf.distance(turf.point(firstPoint), turf.point(newPoint), { units: 'kilometers' });
        
        // 50km tolerance at typical zoom levels, or just rely on manual clearing
        // A better UX for distance is screen pixels, but turf distance is okay for a map.
        // We'll use 50km to be generous at zoom 5.
        if (dist < 50) {
          setIsPolygonClosed(true);
          setCursorCoordinate(null);
          return;
        }
      }
      
      addPolygonVertex(newPoint);
    }
  };

  const handleMouseMove = (e) => {
    if (interactionMode === 'draw_polygon' && !isPolygonClosed) {
      setCursorCoordinate([e.lngLat.lng, e.lngLat.lat]);
    }
  };

  const handleDblClick = (e) => {
    if (interactionMode === 'draw_polygon' && !isPolygonClosed && drawnPolygon.length >= 3) {
      e.preventDefault();
      setIsPolygonClosed(true);
      setCursorCoordinate(null);
    }
  };

  const activeIncidentData = useMemo(() => {
    if (!activeIncident) return null;
    const incident = mockHistoricalIncidents.find(i => i.id === activeIncident);
    if (!incident) return null;
    return {
      type: 'FeatureCollection',
      features: [{ type: 'Feature', geometry: { type: 'Polygon', coordinates: [incident.polygon] } }]
    };
  }, [activeIncident]);

  const previewPolygonData = useMemo(() => {
    // Need at least 3 points to render a polygon fill
    // If not closed, that means 2 fixed vertices + 1 cursor
    if (drawnPolygon.length < 2 && (!cursorCoordinate || drawnPolygon.length < 3 && isPolygonClosed)) return null;
    
    let coords = [...drawnPolygon];
    
    if (!isPolygonClosed && cursorCoordinate) {
      coords.push(cursorCoordinate);
    }
    
    if (coords.length < 3) return null;

    coords.push(coords[0]); // close loop
    
    return {
      type: 'FeatureCollection',
      features: [{ type: 'Feature', geometry: { type: 'Polygon', coordinates: [coords] } }]
    };
  }, [drawnPolygon, cursorCoordinate, isPolygonClosed]);

  const rubberbandData = useMemo(() => {
    if (drawnPolygon.length === 0 || isPolygonClosed || !cursorCoordinate) return null;
    const lastPoint = drawnPolygon[drawnPolygon.length - 1];
    return {
      type: 'FeatureCollection',
      features: [{ type: 'Feature', geometry: { type: 'LineString', coordinates: [lastPoint, cursorCoordinate] } }]
    };
  }, [drawnPolygon, cursorCoordinate, isPolygonClosed]);

  const verticesData = useMemo(() => {
    if (drawnPolygon.length === 0) return null;
    return {
      type: 'FeatureCollection',
      features: drawnPolygon.map(coord => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: coord }
      }))
    };
  }, [drawnPolygon]);

  const dynamicHindcastData = useMemo(() => {
    if (!hindcastData || hindcastData.length === 0) return null;
    return {
      type: 'FeatureCollection',
      features: hindcastData.map(p => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [p.lon, p.lat] },
        properties: { age: p.age }
      }))
    };
  }, [hindcastData]);

  const correlationMarkerData = useMemo(() => {
    if (!correlationMarker) return null;
    return {
      type: 'FeatureCollection',
      features: [{ type: 'Feature', geometry: { type: 'Point', coordinates: correlationMarker } }]
    };
  }, [correlationMarker]);

  return (
    <div className="absolute inset-0 bg-slate-950">
      <Map
        ref={mapRef}
        initialViewState={initialViewState}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={mapboxAccessToken}
        attributionControl={false}
        style={{ width: '100%', height: '100%' }}
        onClick={handleMapClick}
        onMouseMove={handleMouseMove}
        onDblClick={handleDblClick}
        cursor={interactionMode !== 'none' && !isPolygonClosed ? 'crosshair' : 'grab'}
      >
        <Source id="sar-source" type="geojson" data={mockData.sar}>
          <Layer 
            id="sar-layer" 
            type="fill" 
            paint={{ 'fill-color': '#22d3ee', 'fill-opacity': 0.4, 'fill-outline-color': '#0891b2' }}
            layout={{ visibility: isSarVisible ? 'visible' : 'none' }}
          />
        </Source>
        {activeAnalysisMode === 'attribution' && dynamicHindcastData && (
          <Source id="hindcast-source" type="geojson" data={dynamicHindcastData}>
            <Layer 
              id="hindcast-layer" 
              type="circle" 
              paint={{ 'circle-color': '#f43f5e', 'circle-radius': 4 }}
            />
          </Source>
        )}
        {activeAnalysisMode === 'attribution' && (
          <Source id="ais-source" type="geojson" data={mockData.ais}>
            <Layer 
              id="ais-layer" 
              type="line" 
              paint={{ 'line-color': '#f59e0b', 'line-width': 2, 'line-dasharray': [2, 2] }}
            />
          </Source>
        )}
        
        {activeAnalysisMode === 'forward_track' && (
          <Source id="forward-track-source" type="geojson" data={mockForwardTrack}>
            <Layer 
              id="forward-track-layer-fill" 
              type="fill" 
              paint={{ 'fill-color': '#f59e0b', 'fill-opacity': 0.3 }}
            />
            <Layer 
              id="forward-track-layer-line" 
              type="line" 
              paint={{ 'line-color': '#f59e0b', 'line-width': 2, 'line-dasharray': [4, 4] }}
            />
          </Source>
        )}

        {activeAnalysisMode === 'attribution' && correlationMarkerData && (
          <Source id="correlation-marker-source" type="geojson" data={correlationMarkerData}>
            <Layer 
              id="correlation-marker-layer" 
              type="circle" 
              paint={{ 
                'circle-color': 'transparent', 
                'circle-radius': 12, 
                'circle-stroke-width': 2, 
                'circle-stroke-color': '#f43f5e' 
              }}
            />
            <Layer 
              id="correlation-marker-core" 
              type="circle" 
              paint={{ 
                'circle-color': '#f43f5e', 
                'circle-radius': 4 
              }}
            />
          </Source>
        )}

        {activeIncidentData && (
          <Source id="active-incident-source" type="geojson" data={activeIncidentData}>
            <Layer 
              id="active-incident-layer" 
              type="fill" 
              paint={{ 'fill-color': '#f43f5e', 'fill-opacity': 0.5, 'fill-outline-color': '#be123c' }}
            />
          </Source>
        )}

        {previewPolygonData && (
          <Source id="preview-polygon-source" type="geojson" data={previewPolygonData}>
            <Layer 
              id="preview-polygon-layer" 
              type="fill" 
              paint={{ 'fill-color': '#86efac', 'fill-opacity': 0.35, 'fill-outline-color': '#86efac' }}
            />
          </Source>
        )}

        {rubberbandData && (
          <Source id="rubberband-source" type="geojson" data={rubberbandData}>
            <Layer 
              id="rubberband-layer" 
              type="line" 
              paint={{ 'line-color': '#86efac', 'line-width': 2, 'line-dasharray': [2, 2] }}
            />
          </Source>
        )}

        {verticesData && (
          <Source id="vertices-source" type="geojson" data={verticesData}>
            <Layer 
              id="vertices-layer" 
              type="circle" 
              paint={{ 
                'circle-color': '#a3e635', 
                'circle-radius': 5, 
                'circle-stroke-width': 1.5, 
                'circle-stroke-color': '#022c22'
              }}
            />
          </Source>
        )}
        
        {children}
      </Map>
    </div>
  );
};
