
type LocationValue = {
  name: string;
  fullAddress?: string;
  lat: number | null;
  lng: number | null;
  [key: string]: unknown;
};

type LocationInput = string | LocationValue | null | undefined;

type SuggestionInput = string | Record<string, unknown> | null | undefined;

export const toLocationObj = (val: LocationInput): LocationValue | null => {
  if (!val) return null;
  if (typeof val === "string") {
    return { name: val, fullAddress: val, lat: null, lng: null };
  }
  return val;
};

export const normalizeSuggestion = (item: SuggestionInput): LocationValue => {
  if (typeof item === "string") {
    return { name: item, fullAddress: item, lat: null, lng: null };
  }
  const record = item as Record<string, unknown>;
  const name = (record.name as string) || (record.city as string) || (record.label as string) || "";
  return {
    name,
    fullAddress:
      (record.full_address as string) ||
      (record.address as string) ||
      (record.description as string) ||
      name,
    lat: (record.lat as number | null) ?? (record.latitude as number | null) ?? null,
    lng: (record.lng as number | null) ?? (record.longitude as number | null) ?? null,
  };
};