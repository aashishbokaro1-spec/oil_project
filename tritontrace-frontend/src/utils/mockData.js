export const mockHistoricalIncidents = [
  {
    id: 'INC-2026-0814',
    timestamp: '2026-08-14T09:22:00Z',
    area: 14.6,
    status: 'ACTIVE',
    lat: 31.75,
    lon: 28.15,
    polygon: [
      [28.1, 31.75],
      [28.3, 31.75],
      [28.25, 31.85],
      [28.1, 31.8],
      [28.1, 31.75]
    ] // Note: Mapbox/Turf format is [Lon, Lat]. Will map to [Lat, Lon] for Leaflet if needed.
  },
  {
    id: 'INC-2026-0722',
    timestamp: '2026-07-22T14:10:00Z',
    area: 2.1,
    status: 'RESOLVED',
    lat: 31.5,
    lon: 28.8,
    polygon: [
      [28.75, 31.45],
      [28.85, 31.45],
      [28.85, 31.55],
      [28.75, 31.55],
      [28.75, 31.45]
    ]
  },
  {
    id: 'INC-2026-0610',
    timestamp: '2026-06-10T07:45:00Z',
    area: 45.2,
    status: 'MONITORING',
    lat: 32.1,
    lon: 27.5,
    polygon: [
      [27.3, 32.0],
      [27.7, 32.0],
      [27.7, 32.2],
      [27.3, 32.2],
      [27.3, 32.0]
    ]
  }
];

export const mockForwardTrack = {
  type: 'FeatureCollection',
  features: [
    { 
      type: 'Feature', 
      geometry: { 
        type: 'Polygon', 
        coordinates: [
          [
            [28.1, 31.75], // start near slick
            [28.3, 31.75],
            [28.5, 31.4],  // widen out southward
            [27.8, 31.4],
            [28.1, 31.75]
          ]
        ] 
      } 
    }
  ]
};
