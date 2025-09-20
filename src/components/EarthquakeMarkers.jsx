// src/components/EarthquakeMarkers.jsx
import React from "react";
import { CircleMarker, Popup } from "react-leaflet";
import { timeStr } from "../utils/timeUtils";
import { magToColor } from "../utils";

export default function EarthquakeMarkers({ quakes, onSelect }) {
  return (
    <>
      {quakes.map((q) => {
        // ADDED: Check if coordinates array exists and has at least two numbers
        if (
          !q.coords ||
          q.coords.length < 2 ||
          typeof q.coords[0] !== "number" ||
          typeof q.coords[1] !== "number"
        ) {
          return null; // Skip if coordinates are invalid
        }

        const [lng, lat] = q.coords;

        return (
          <CircleMarker
            key={q.id}
            center={[lat, lng]} // Changed to access lat and lng from the array
            radius={5 + q.mag * 1.5}
            pathOptions={{
              color: "white",
              fillColor: magToColor(q.mag),
              fillOpacity: 0.8,
              weight: 1,
            }}
            eventHandlers={{
              click: () => onSelect({ lat, lng }),
            }}
          >
            <Popup>
              <div className="text-sm font-sans">
                <div className="text-lg font-bold">
                  M {q.mag?.toFixed(1)} - {q.place}
                </div>
                <div className="mt-1">
                  <span className="font-semibold">Time:</span> {timeStr(q.time)}
                </div>
                <div>
                  <span className="font-semibold">Depth:</span>{" "}
                  {(q.depth ?? 0).toFixed(1)} km
                </div>
                {q.url && (
                  <div className="mt-2">
                    <a
                      href={q.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      More Info
                    </a>
                  </div>
                )}
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </>
  );
}
