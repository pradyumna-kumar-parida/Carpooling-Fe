
export const toLocationObj = (val) => {
  if (!val) return null;
  if (typeof val === "string") {
    return { name: val, fullAddress: val, lat: null, lng: null };
  }
  return val;
};

export const normalizeSuggestion = (item) => {
  if (typeof item === "string") {
    return { name: item, fullAddress: item, lat: null, lng: null };
  }
  const name = item.name || item.city || item.label || "";
  return {
    name,
    fullAddress: item.full_address || item.address || item.description || name,
    lat: item.lat ?? item.latitude ?? null,
    lng: item.lng ?? item.longitude ?? null,
  };
};