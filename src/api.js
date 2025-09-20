// fetch quakes from USGS summary feeds (no auth)
export async function fetchQuakes(feed = "all_day", minMagnitude = 0) {
  let url = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${feed}.geojson`;

  if (minMagnitude > 0) {
    url = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${feed}_min_magnitude_${minMagnitude}.geojson`;
  }

  // Note: To truly filter by magnitude on the server, a more advanced 'query' endpoint would be needed.
  // This version uses the available summary feeds with magnitude filters for simplicity.

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch error ${res.status}`);
  const json = await res.json();
  const features = json.features || [];
  return features.map((f) => {
    const p = f.properties || {};
    const g = f.geometry || {};
    const coords = g.coordinates || [0, 0, 0]; // [lng, lat, depth]
    return {
      id: f.id,
      mag: p.mag,
      place: p.place,
      time: p.time,
      url: p.url,
      coords: [coords[1], coords[0]],
      depth: coords[2] ?? null,
    };
  });
}
