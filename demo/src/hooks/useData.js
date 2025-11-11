import { useState, useEffect } from 'react';

export function useData() {
  const [events, setEvents] = useState(null);
  const [surfaces, setSurfaces] = useState(null);
  const [simulatedEvents, setSimulatedEvents] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL;
    Promise.all([
      fetch(`${baseUrl}data/foundation_space_events.json`).then(r => {
        if (!r.ok) throw new Error('Failed to load events');
        return r.json();
      }),
      fetch(`${baseUrl}data/foundation_space_surfaces.json`).then(r => {
        if (!r.ok) throw new Error('Failed to load surfaces');
        return r.json();
      }),
      fetch(`${baseUrl}data/foundation_space_simulated.json`).then(r => {
        if (!r.ok) throw new Error('Failed to load simulated events');
        return r.json();
      })
    ])
      .then(([eventsData, surfacesData, simulatedData]) => {
        // Combine SM and anomaly events into single array
        const allEvents = [
          ...eventsData.sm_events.map(e => ({ ...e, is_solar: false, cluster_id: -1 })),
          ...eventsData.anomaly_events
        ];
        console.log('Data loaded:', {
          totalEvents: allEvents.length,
          smEvents: eventsData.sm_events.length,
          anomalyEvents: eventsData.anomaly_events.length,
          simulatedEvents: simulatedData.simulated_solar_events.length,
          rotationAngle: simulatedData.rotation_angle_degrees,
          surfaceKeys: Object.keys(surfacesData),
          hasSMSurface: !!surfacesData.sm_surface,
          smSurfaceVertices: surfacesData.sm_surface?.vertices?.length,
          smSurfaceFaces: surfacesData.sm_surface?.faces?.length
        });
        setEvents(allEvents);
        setSurfaces(surfacesData);
        setSimulatedEvents(simulatedData.simulated_solar_events);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading data:', err);
        setError(err);
        setLoading(false);
      });
  }, []);

  return { events, surfaces, simulatedEvents, loading, error };
}

