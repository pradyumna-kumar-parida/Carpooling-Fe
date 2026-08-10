"use client";

import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import dynamic from "next/dynamic";


const BookingRouteMap = dynamic(() => import("./BookingRouteMap"), {
  ssr: false,
});

export default function BookingRouteModal({
  open,
  onClose,
  ride,
}) {
  if (!ride) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontWeight: 600,
          py: 1.5,
        }}
      >
        Route Preview

        <IconButton
          onClick={onClose}
          aria-label="Close route map"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          p: 0,
          height: {
            xs: "400px",
            sm: "500px",
            md: "600px",
          },
          overflow: "hidden",
        }}
      >
        <BookingRouteMap
          sourceLat={ride.source_lat}
          sourceLng={ride.source_lng}
          destinationLat={ride.destination_lat}
          destinationLng={ride.destination_lng}
          sourceAddress={ride.source_address}
          destinationAddress={ride.destination_address}
        />
      </DialogContent>
    </Dialog>
  );
}