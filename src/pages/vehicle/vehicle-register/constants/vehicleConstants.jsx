// src/pages/Vehicle/vehicle-registration/constants/vehicleConstants.js

export const STEPS = [
  "Basic Information",
  "Registration & Documents",
  "Insurance Details",
  "Vehicle Features & Photos",
];

export const CAR_BRANDS = [
  "Maruti Suzuki","Hyundai","Tata","Honda","Toyota",
  "Mahindra","Kia","MG","Others",
];

export const COLORS = [
  "White","Black","Silver","Red","Blue",
  "Grey","Green","Yellow","Orange","Others",
];

export const FUEL_TYPES = ["Petrol","Diesel","CNG","Electric (EV)","Hybrid"];

export const SEAT_OPTIONS = ["2","3","4","5","6","7","8"];

export const CURRENT_YEAR = new Date().getFullYear();

export const MANUFACTURE_YEARS = Array.from(
  { length: 15 },
  (_, i) => CURRENT_YEAR - i,
);

export const PHOTO_FIELDS = [
  { key: "frontPhoto",       label: "Front View"    },
  { key: "backPhoto",        label: "Back View"     },
  { key: "sidePhoto",        label: "Side View"     },
  { key: "numberPlatePhoto", label: "Number Plate"  },
];

export const INITIAL_VEHICLE_DATA = {
  brand: "", model: "", color: "", registrationNumber: "",
  rcNumber: "", rcExpiryDate: "", rcDocument: null,
  insuranceProvider: "", policyNumber: "",
  insuranceExpiryDate: "", manufacturyDate: "", insuranceDocument: null,
  numberOfSeats: "", fuelType: "",
  frontPhoto: null, backPhoto: null, sidePhoto: null, numberPlatePhoto: null,
};