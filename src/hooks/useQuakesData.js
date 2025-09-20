import { useState, useEffect } from "react";
import { fetchQuakes } from "../api";

export function useQuakesData(feed) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    fetchQuakes(feed)
      .then((r) => {
        if (!mounted) return;
        setData(r);
      })
      .catch((e) => {
        if (mounted) setError(String(e));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => (mounted = false);
  }, [feed]);

  return { data, loading, error };
}
