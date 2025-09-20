// src/components/MapView.jsx
import React, { useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import EarthquakeMarkers from "./EarthquakeMarkers";
import Legend from "../Legend";

// Fix for default marker icon missing
delete L.Icon.Default.prototype._get_iconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Define the maximum bounds to prevent map repetition
const southWest = L.latLng(-90, -180);
const northEast = L.latLng(90, 180);
const maxBounds = L.latLngBounds(southWest, northEast);

// Component to handle map center changes
function ChangeView({ coords }) {
  const map = useMap();
  if (coords) {
    map.flyTo(coords, map.getZoom());
  }
  return null;
}

export default function MapView({ quakes, onSelect, selectedCoords }) {
  const [isSatellite, setIsSatellite] = useState(false);

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <MapContainer
        center={[0, 0]}
        zoom={2}
        minZoom={1.5}
        className="h-full w-full"
        maxBounds={maxBounds}
        maxBoundsViscosity={1.0}
      >
        {!isSatellite && (
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        )}
        {isSatellite && (
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
            maxZoom={19} // NEW: Added maxZoom to prevent zooming beyond available satellite data
          />
        )}
        <ChangeView coords={selectedCoords} />
        <EarthquakeMarkers quakes={quakes} onSelect={onSelect} />
        <Legend />
      </MapContainer>
      <button
        onClick={() => setIsSatellite(!isSatellite)}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 1000,
          padding: "8px 12px",
          backgroundColor: "#ffffff4d",
          border: "1px solid #ccc",
          borderRadius: "15px",
          cursor: "pointer",
          color: "#00000091",
          fontWeight: "bold",
        }}
      >
        {isSatellite ? "Show Street Map" : "Show Satellite Map"}
      </button>
    </div>
  );
}
