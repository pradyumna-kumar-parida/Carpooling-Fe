
import { useRef, useState } from "react";
import { searchLocationsApi } from "../../../services/rideService";
import { normalizeSuggestion } from "../utils/Location";

type LocationSuggestion = {
  name: string;
  fullAddress?: string;
  [key: string]: unknown;
};

export function useDebouncedLocationSearch(delay = 400) {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef<number>(0);

  const search = (input: string) => {
    clearTimeout(debounceRef.current);

    if (!input || input.trim().length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const thisRequestId = ++requestIdRef.current;

    debounceRef.current = setTimeout(async () => {
      try {
        const response = await searchLocationsApi({ keyword: input.trim() });
        if (thisRequestId !== requestIdRef.current) return; // a newer search has since started
        const results = Array.isArray(response.data) ? response.data : [];
        setSuggestions(results.map(normalizeSuggestion) as LocationSuggestion[]);
      } catch (err) {
        console.error("Location search error:", err);
        if (thisRequestId === requestIdRef.current) setSuggestions([]);
      } finally {
        if (thisRequestId === requestIdRef.current) setLoading(false);
      }
    }, delay);
  };

  const clear = () => {
    clearTimeout(debounceRef.current);
    setSuggestions([]);
    setLoading(false);
  };

  return { suggestions, loading, search, clear };
}