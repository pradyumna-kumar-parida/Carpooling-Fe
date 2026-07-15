// src/pages/Rides/find-ride/constants/filterOptions.js

export const SORT_OPTIONS = [
  { id: "earliest", label: "Earliest departure" },
  { id: "lowest",   label: "Lowest price"       },
  { id: "shortest", label: "Shortest ride"       },
];

export const DEPART_SLOTS = [
  { id: "before6", label: "Before 6:00 am"   },
  { id: "6to12",   label: "6:00 am - 12:00 pm"  },
  { id: "12to18",  label: "12:01 pm - 6:00 pm"  },
  { id: "after18", label: "After 6:00 pm"    },
];

export const AMENITIES = [
  { id: "max_two_in_back", label: "Max. 2 in the back" },
  { id: "instant_booking", label: "Instant Booking"    },
  { id: "smoking_allowed", label: "Smoking allowed"    },
  { id: "pet_allowed",     label: "Pets allowed"       },
];

export const SLOT_MAP = {
  before6: "Before 6:00 am",
  "6to12": "6:00 am - 12:00 pm",
  "12to18": "12:01 pm - 6:00 pm",
  after18: "After 6:00 pm",
};

export const DEFAULT_AMENITY_CHECKS = {
  max_two_in_back: false,
  instant_booking: false,
  smoking_allowed: false,
  pet_allowed:     false,
};