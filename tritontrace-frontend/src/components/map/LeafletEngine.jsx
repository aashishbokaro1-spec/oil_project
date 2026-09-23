import React, { useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, ZoomControl, Polygon, CircleMarker, Polyline, useMapEvents, useMap, GeoJSON } from 'react-leaflet';
import * as turf from '@turf/turf';
import { useIncident } from '../../context/IncidentContext';
import { mockHistoricalIncidents, mockForwardTrack } from '../../utils/mockData';
import geofencesData from '../../utils/regional_alert_geofences.json';

const MapInteractionHandler = () => {
  const { 
    interactionMode, 
    setPickedCoordinate, 
    addPolygonVertex,
    drawnPolygon,
    isPolygonClosed,
    setIsPolygonClosed,
    setCursorCoordinate
  } = useIncident();
  
  useMapEvents({
    click(e) {
      if (interactionMode === 'pick_coordinate') {
        setPickedCoordinate({ lat: e.latlng.lat, lon: e.latlng.lng });
      } else if (interactionMode === 'draw_polygon' && !isPolygonClosed) {
        const newPoint = [e.latlng.lng, e.latlng.lat]; // [lon, lat]
        
        if (drawnPolygon.length >= 3) {
          const firstPoint = drawnPolygon[0];
          const dist = turf.distance(turf.point(firstPoint), turf.point(newPoint), { units: 'kilometers' });
          if (dist < 50) {
            setIsPolygonClosed(true);
            setCursorCoordinate(null);
            return;
          }
        }
        
        addPolygonVertex(newPoint); 
      }
    },
    mousemove(e) {
      if (interactionMode === 'draw_polygon' && !isPolygonClosed) {
        setCursorCoordinate([e.latlng.lng, e.latlng.lat]);
      }
    },
    dblclick(e) {
      if (interactionMode === 'draw_polygon' && !isPolygonClosed && drawnPolygon.length >= 3) {
        setIsPolygonClosed(true);
        setCursorCoordinate(null);
      }
    }
  });

  return null;
};

const PanToHandler = () => {
  const map = useMap();
  const { panToCoordinate, setPanToCoordinate } = useIncident();

  useEffect(() => {
    if (panToCoordinate) {
      map.flyTo([panToCoordinate.lat, panToCoordinate.lon], 12, {
        animate: true,
        duration: 2
      });
      setPanToCoordinate(null);
    }
  }, [panToCoordinate, map, setPanToCoordinate]);

  return null;
};

export const LeafletEngine = ({ 
  initialViewState,
  layers,
  children 
}) => {
  const { interactionMode, activeIncident, drawnPolygon, cursorCoordinate, isPolygonClosed, hindcastData, correlationMarker, activeAnalysisMode } = useIncident();
  const position = [initialViewState.latitude, initialViewState.longitude];

  const isSarVisible = layers.find(l => l.id === 'sar_slick')?.active;
  const isHindcastVisible = layers.find(l => l.id === 'hindcast')?.active;
  const isAisVisible = layers.find(l => l.id === 'ais_tracks')?.active;
  const isGeofencesVisible = layers.find(l => l.id === 'geofences')?.active;

  // Leaflet uses [Lat, Lon] format
  const sarPositions = [[31.75, 28.1], [31.75, 28.3], [31.85, 28.25], [31.8, 28.1], [31.75, 28.1]];
  const aisPositions = [[31.6, 28.0], [31.78, 28.15], [31.9, 28.3]];

  const activeIncidentPositions = useMemo(() => {
    if (!activeIncident) return null;
    const incident = mockHistoricalIncidents.find(i => i.id === activeIncident);
    if (!incident) return null;
    // Map from [lon, lat] to [lat, lon]
    return incident.polygon.map(coord => [coord[1], coord[0]]);
  }, [activeIncident]);

  const drawnPositions = useMemo(() => {
    if (drawnPolygon.length < 3) return null;
    return drawnPolygon.map(coord => [coord[1], coord[0]]); // [lat, lon]
  }, [drawnPolygon]);

  const previewPositions = useMemo(() => {
    if (drawnPolygon.length < 2 && (!cursorCoordinate || drawnPolygon.length < 3 && isPolygonClosed)) return null;
    let coords = [...drawnPolygon];
    if (!isPolygonClosed && cursorCoordinate) {
      coords.push(cursorCoordinate);
    }
    if (coords.length < 3) return null;
    
    // Map to [lat, lon]
    return coords.map(coord => [coord[1], coord[0]]);
  }, [drawnPolygon, cursorCoordinate, isPolygonClosed]);

  const rubberbandPositions = useMemo(() => {
    if (drawnPolygon.length === 0 || isPolygonClosed || !cursorCoordinate) return null;
    const lastPoint = drawnPolygon[drawnPolygon.length - 1];
    return [[lastPoint[1], lastPoint[0]], [cursorCoordinate[1], cursorCoordinate[0]]]; // [lat, lon]
  }, [drawnPolygon, cursorCoordinate, isPolygonClosed]);

  const vertexPositions = useMemo(() => {
    if (drawnPolygon.length === 0) return null;
    return drawnPolygon.map(coord => [coord[1], coord[0]]);
  }, [drawnPolygon]);

  const dynamicHindcastPositions = useMemo(() => {
    if (!hindcastData || hindcastData.length === 0) return [];
    return hindcastData.map(p => [p.lat, p.lon]);
  }, [hindcastData]);

  const correlationMarkerPosition = useMemo(() => {
    if (!correlationMarker) return null;
    return [correlationMarker[1], correlationMarker[0]];
  }, [correlationMarker]);

  const forwardTrackPositions = useMemo(() => {
    return mockForwardTrack.features[0].geometry.coordinates[0].map(coord => [coord[1], coord[0]]);
  }, []);

  return (
    <div className={`w-full h-full bg-slate-950 isolate ${interactionMode !== 'none' && !isPolygonClosed ? 'cursor-crosshair' : 'cursor-grab'}`}>
      <MapContainer 
        center={position}
        zoom={initialViewState.zoom}
        zoomControl={false}
        style={{ width: '100%', height: '100%', background: '#020617' }} // slate-950
      >
        <MapInteractionHandler />
        <PanToHandler />
        
        <TileLayer
          attribution="Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
        />
        {/* We place our custom zoom control here if we want native behavior, but we will likely manage this globally later. */}
        <ZoomControl position="bottomright" />
        
        {isSarVisible && (
          <Polygon positions={sarPositions} pathOptions={{ color: '#0891b2', fillColor: '#22d3ee', fillOpacity: 0.4 }} />
        )}

        {isGeofencesVisible && (
          <GeoJSON 
            data={geofencesData} 
            key={`geofences-${isGeofencesVisible}`} 
            style={(feature) => {
              const isCritical = feature.properties.zone_level === 'Critical Strike Zone';
              return {
                color: isCritical ? '#EF4444' : '#F59E0B',
                fillColor: isCritical ? '#EF4444' : '#F59E0B',
                weight: isCritical ? 2 : 1.5,
                dashArray: isCritical ? null : '4, 4',
                fillOpacity: 0.22,
                opacity: 0.85
              };
            }}
            onEachFeature={(feature, layer) => {
              const p = feature.properties;
              const badgeColor = p.zone_level === 'Critical Strike Zone' ? 'text-rose-400 border-rose-500/40 bg-rose-950/40' : 'text-amber-400 border-amber-500/40 bg-amber-950/40';
              layer.bindTooltip(`
                <div class="bg-slate-900 border border-slate-700 text-slate-100 p-2 rounded shadow-xl font-mono text-xs">
                  <div class="font-bold text-sm text-slate-100 mb-1">${p.name}</div>
                  <div class="inline-block px-1.5 py-0.5 rounded border text-[10px] mb-1.5 ${badgeColor}">${p.zone_level}</div>
                  <div class="text-slate-400">Type: <span class="text-slate-200">${p.type} (${p.radius_km} km)</span></div>
                  <div class="text-slate-400 mt-1">Penalty Factor: <span class="text-amber-300 font-bold">${p.liability_multiplier}x</span></div>
                </div>
              `, { sticky: true, className: 'tactical-leaflet-tooltip' });
            }}
          />
        )}
        
        {activeAnalysisMode === 'attribution' && dynamicHindcastPositions.map((pos, i) => (
          <CircleMarker key={`hindcast-${i}`} center={pos} radius={4} pathOptions={{ color: '#f43f5e', fillColor: '#f43f5e', fillOpacity: 1 }} />
        ))}

        {activeAnalysisMode === 'attribution' && (
          <Polyline positions={aisPositions} pathOptions={{ color: '#f59e0b', weight: 2, dashArray: '5, 5' }} />
        )}

        {activeAnalysisMode === 'forward_track' && (
          <Polygon positions={forwardTrackPositions} pathOptions={{ color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.3, weight: 2, dashArray: '4, 4' }} />
        )}

        {activeAnalysisMode === 'attribution' && correlationMarkerPosition && (
          <>
            <CircleMarker 
              center={correlationMarkerPosition} 
              radius={12} 
              pathOptions={{ color: '#f43f5e', weight: 2, fillColor: 'transparent' }} 
            />
            <CircleMarker 
              center={correlationMarkerPosition} 
              radius={4} 
              pathOptions={{ color: '#f43f5e', fillColor: '#f43f5e', fillOpacity: 1, weight: 0 }} 
            />
          </>
        )}

        {activeIncidentPositions && (
          <Polygon positions={activeIncidentPositions} pathOptions={{ color: '#be123c', fillColor: '#f43f5e', fillOpacity: 0.5 }} />
        )}

        {previewPositions && (
          <Polygon positions={previewPositions} pathOptions={{ color: '#86efac', fillColor: '#86efac', fillOpacity: 0.35 }} />
        )}

        {drawnPositions && !previewPositions && (
          <Polygon positions={drawnPositions} pathOptions={{ color: '#059669', fillColor: '#10b981', fillOpacity: 0.4 }} />
        )}

        {rubberbandPositions && (
          <Polyline positions={rubberbandPositions} pathOptions={{ color: '#86efac', weight: 2, dashArray: '4, 4' }} />
        )}

        {vertexPositions && vertexPositions.map((pos, i) => (
          <CircleMarker 
            key={`vertex-${i}`} 
            center={pos} 
            radius={5} 
            pathOptions={{ color: '#022c22', weight: 1.5, fillColor: '#a3e635', fillOpacity: 1 }} 
          />
        ))}

        {children}
      </MapContainer>
    </div>
  );
};
