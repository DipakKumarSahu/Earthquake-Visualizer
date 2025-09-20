import React, { useState, useEffect, useRef } from "react";
import { magToColor, timeStr } from "../utils";
import { debounce } from "lodash";
import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";
// import { magToColor } from "../utils/colorUtils";

export default function Sidebar({
  quakes,
  minMag,
  setMinMag,
  onItemClick,
  favorites,
  toggleFav,
  feed,
  setFeed,
  search,
  setSearch,
  dark,
  setDark,
  showFavorites,
  setShowFavorites,
}) {
  const [localSearch, setLocalSearch] = useState(search);

  // Create a debounced function using a ref to prevent recreation on every render
  const debouncedSetSearch = useRef(
    debounce((value) => {
      setSearch(value);
    }, 300)
  ).current;

  // Sync the local state with the debounced function call
  useEffect(() => {
    debouncedSetSearch(localSearch);
    // Cleanup the debounce function on unmount
    return () => {
      debouncedSetSearch.cancel();
    };
  }, [localSearch, debouncedSetSearch]);

  return (
    <aside className="w-80 border-r border-gray-200 dark:border-gray-700 p-3 overflow-y-auto flex-shrink-0 ">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Filters</h3>
        <button
          onClick={() => setDark(!dark)}
          className="text-sm px-2 py-1 bg-gray-100 rounded dark:bg-gray-800"
        >
          {dark ? "Light" : "Dark"}
        </button>
      </div>

      <div className="mb-3">
        <label className="text-sm block">Time range</label>
        <div className="flex gap-2 mt-2">
          <button
            className={`px-2 py-1 rounded transition-colors ${
              feed === "all_hour"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
            onClick={() => setFeed("all_hour")}
          >
            Last Hour
          </button>
          <button
            className={`px-2 py-1 rounded transition-colors ${
              feed === "all_day"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
            onClick={() => setFeed("all_day")}
          >
            Last 24h
          </button>
          <button
            className={`px-2 py-1 rounded transition-colors ${
              feed === "all_week"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
            onClick={() => setFeed("all_week")}
          >
            Last 7d
          </button>
        </div>
      </div>

      <div className="mb-3">
        <label className="text-sm block">Search place</label>
        <input
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="w-full px-2 py-1 mt-1 border rounded bg-gray-50 dark:bg-gray-800 dark:border-gray-600"
          placeholder="e.g. Alaska"
        />
      </div>

      <div className="mb-3">
        <label className="text-sm block">
          Min magnitude: <strong>{minMag.toFixed(1)}</strong>
        </label>
        <input
          type="range"
          min="0"
          max="7"
          step="0.1"
          value={minMag}
          onChange={(e) => setMinMag(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="mb-2 flex justify-between items-center">
        <div className="font-semibold">Events ({quakes.length})</div>
        <button
          className={`text-sm px-2 py-1 rounded transition-colors ${
            showFavorites
              ? "bg-yellow-400 text-black"
              : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
          onClick={() => setShowFavorites(!showFavorites)}
        >
          {showFavorites ? "Show All" : "Show Favorites"}
        </button>
      </div>

      {quakes.length === 0 && (
        <div className="text-sm text-gray-500">No events match filters.</div>
      )}

      {quakes.map((q) => (
        <div
          key={q.id}
          className="p-2 border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          onClick={() => onItemClick(q.coords)}
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <span
                className="inline-block rounded-full w-2 h-2 mr-2"
                style={{ backgroundColor: magToColor(q.mag) }}
              ></span>
              <div>
                <div className="font-medium">{q.place}</div>
                <div className="text-xs text-gray-500">{timeStr(q.time)}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold">{q.mag?.toFixed(1)}</div>
              <div className="text-xs text-gray-500">
                {(q.depth ?? 0).toFixed(1)} km
              </div>
              <div className="mt-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFav(q.id);
                  }}
                  className="text-sm"
                >
                  {favorites.includes(q.id) ? (
                    <StarIcon className="h-4 w-4 text-yellow-400" />
                  ) : (
                    <StarOutlineIcon className="h-4 w-4 text-gray-400 hover:text-yellow-400 transition-colors" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </aside>
  );
}
