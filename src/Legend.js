import React, { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { magToColor } from "./utils";
// import { magToColor } from "utils"; // Make sure to import your color utility function

export default function Legend() {
  const map = useMap();

  useEffect(() => {
    const legend = L.control({ position: "bottomright" });

    legend.onAdd = () => {
      const div = L.DomUtil.create(
        "div",
        "info legend bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg border border-gray-300 dark:border-gray-600 font-sans text-sm text-gray-900 dark:text-gray-100"
      );
      const magnitudes = [0, 2, 3, 4, 5, 6];
      let labels = [];

      for (let i = 0; i < magnitudes.length; i++) {
        // Here we build the inner HTML for each item
        labels.push(`
          <div class="flex items-center mb-1">
            <span style="background:${magToColor(
              magnitudes[i] + 1
            )}" class="w-4 h-4 block mr-2 opacity-75 rounded-full ring-2 ring-gray-400 dark:ring-gray-300"></span>
            ${magnitudes[i]}${
          magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] : "+"
        }
          </div>
        `);
      }

      div.innerHTML = `
        <div class="text-lg font-bold mb-2">Magnitude</div>
        ${labels.join("")}
      `;
      return div;
    };

    legend.addTo(map);

    // Cleanup function
    return () => {
      legend.remove();
    };
  }, [map]);

  return null;
}
