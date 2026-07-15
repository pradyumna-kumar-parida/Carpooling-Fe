import { Dialog, DialogContent } from "@mui/material";
import { metersToKm } from "../utils/bookingHelpers";

export default function PriceModal({
  open,
  onClose,
  ride,
  pricePerSeat,
  noOfSIt,
}) {
  if (!ride) return null;

  const rows = [
    ["Price per seat", `₹${pricePerSeat}`],
    ["Selected seats", noOfSIt ?? "--"],
    ["Distance", metersToKm(ride.distance_meters)],
  ];

  const total = (
    pricePerSeat * noOfSIt
  ).toFixed(2);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        className: "ride-price-modal",
      }}
    >
      <DialogContent className="ride-price-content">
        <h2 className="ride-price-title">
          Price details
        </h2>

        <div className="ride-price-list">
          {rows.map(([label, value]) => (
            <div
              key={label}
              className="ride-price-row"
            >
              <span>{label}</span>
              <span>{value}</span>
            </div>
          ))}
        </div>

        <div className="ride-price-divider" />

        <div className="ride-price-total">
          <span>Total price</span>

          <span className="ride-price-amount">
            ₹{total}
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}