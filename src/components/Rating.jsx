"use client";

import React, { useState } from "react";
import {
  Box,
  Modal,
  Typography,
  Button,
  TextField,
  Rating,
} from "@mui/material";
import "../styles/find-ride.css";

export default function RatingModal() {
  const [open, setOpen] = useState(true);
  const [rating, setRating] = useState(null);
  const [feedback, setFeedback] = useState("");

  const handleClose = () => setOpen(false);

  const handleSubmit = () => {
    const payload = {
      rating,
      feedback,
    };

    console.log("Rating Submitted:", payload);

    // API Call Here

    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="rating-modal-title"
    >
      <Box className="rating-modal-box">
        {/* Header */}
        <Typography
          id="rating-modal-title"
          variant="h5"
          className="rating-modal-title"
        >
          Rate Your Driver
        </Typography>

        <Typography variant="body2" className="rating-modal-subtitle">
          Your ride has been completed successfully. Please rate your experience
          with the driver.
        </Typography>

        {/* Rating */}
        <Typography variant="subtitle1" className="rating-modal-label">
          How was your ride experience?
        </Typography>
        <Rating
          name="ride-rating"
          size="large"
          value={rating}
          onChange={(event, newValue) => {
            setRating(newValue);
          }}
          className="rating-modal-stars"
        />

        {/* Feedback */}
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Share your feedback (optional)"
          placeholder="Tell us about your trip experience, driver behavior, punctuality, vehicle cleanliness, etc."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="rating-modal-feedback"
        />

        {/* Buttons */}
        <Box className="rating-modal-buttons">
          <Button variant="outlined" onClick={handleClose}>
            Skip
          </Button>

          <Button variant="contained" onClick={handleSubmit}>
            Submit Rating
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
