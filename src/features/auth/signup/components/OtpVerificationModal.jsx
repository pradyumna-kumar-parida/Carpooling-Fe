// src/pages/Auth/signup/components/OtpVerificationModal.jsx

import {
  Dialog, DialogContent, Typography,
  TextField, Button, Alert, Stack,
} from "@mui/material";

export default function OtpVerificationModal({
  open, onClose,
  phone,
  otp, setOtp,
  isVerified,
  onVerify,
}) {
  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ style: { borderRadius: 12, padding: 8, minWidth: 360 } }}
    >
      <DialogContent>
        <Typography variant="h6" fontWeight={700} mb={1}>
          Verify Phone Number
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          An OTP has been sent to <strong>+91 {phone}</strong>
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Enter OTP"
            variant="outlined"
            fullWidth
            value={otp}
            onChange={handleOtpChange}
            inputProps={{ maxLength: 6, inputMode: "numeric" }}
            placeholder="6-digit OTP"
            disabled={isVerified}
          />

          {isVerified ? (
            <Alert severity="success">Phone verified successfully! ✓</Alert>
          ) : (
            <Button
              variant="contained"
              fullWidth
              onClick={onVerify}
              disabled={otp.length !== 6}
              sx={{
                backgroundColor: "#0033a1",
                "&:hover": { backgroundColor: "#002280" },
                borderRadius: 2, py: 1.2, fontWeight: 700,
              }}
            >
              Verify OTP
            </Button>
          )}

          <Button
            variant="text"
            size="small"
            onClick={onClose}
            sx={{ color: "text.secondary" }}
          >
            Cancel
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}