import React, { useState, useEffect, useRef } from "react";
import MapView from "./components/MapView";
import Sidebar from "./components/Sidebar";
import { useQuakesData } from "./hooks/useQuakesData";
import { useDebounce } from "./hooks/useDebounce";

export default function App() {
  const [minMag, setMinMag] = useState(0);
  const [feed, setFeed] = useState("all_day");
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("fav") || "[]");
    } catch (e) {
      return [];
    }
  });
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [dark, setDark] = useState(false);
  const [mapLayer, setMapLayer] = useState("OpenStreetMap"); // Centralized map state

  const { data, loading, error } = useQuakesData(feed);
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const toggleFav = (id) => {
    setFavorites((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [id, ...prev];
      try {
        localStorage.setItem("fav", JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const filtered = data.filter(
    (d) =>
      (typeof d.mag === "number" ? d.mag >= minMag : false) &&
      (!debouncedSearch ||
        (d.place || "").toLowerCase().includes(debouncedSearch.toLowerCase()))
  );

  const quakesToShow = showFavorites
    ? filtered.filter((q) => favorites.includes(q.id))
    : filtered;

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h1 className="text-xl font-bold">Earthquake Visualizer</h1>
          <div className="text-sm text-gray-500">The Dance of our Nature</div>
        </div>
        <div className="text-sm">
          {loading ? (
            "Loading..."
          ) : error ? (
            <span className="text-red-400">{error}</span>
          ) : (
            <span>{data.length} events</span>
          )}
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        <Sidebar
          quakes={quakesToShow}
          minMag={minMag}
          setMinMag={setMinMag}
          onItemClick={(c) => setSelectedCoords(c)}
          favorites={favorites}
          toggleFav={toggleFav}
          feed={feed}
          setFeed={setFeed}
          search={search}
          setSearch={setSearch}
          dark={dark}
          setDark={setDark}
          showFavorites={showFavorites}
          setShowFavorites={setShowFavorites}
          mapLayer={mapLayer}
          setMapLayer={setMapLayer}
        />
        <main className="flex-1 min-h-0">
          <MapView
            quakes={quakesToShow}
            onSelect={(c) => setSelectedCoords(c)}
            selectedCoords={selectedCoords}
            mapLayer={mapLayer}
          />
        </main>
      </div>

      <footer className="p-2 text-xs text-gray-500 border-t border-gray-200 dark:border-gray-800">
        If it happens, move away from heavy objects and protect your head.
      </footer>
    </div>
  );
}
