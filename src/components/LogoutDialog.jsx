"use client";

import {
  Dialog,
  DialogContent,
  Typography,
  Button,
  Stack,
} from "@mui/material";

import { FiAlertTriangle } from "react-icons/fi";

export default function LogoutDialog({ open, onClose, onConfirm }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth className="logout-dialog">
      <DialogContent
        sx={{
          textAlign: "center",
          p: 4,
        }}
      >
        <div className="logout-icon">
          <FiAlertTriangle size={30} color="#ff9800" />
        </div>

        <Typography variant="h6" fontWeight={700} mt={2}>
          Logout?
        </Typography>

        <Typography color="text.secondary" mt={1} mb={3}>
          Are you sure you want to logout from your account?
        </Typography>

        <Stack direction="row" spacing={2}>
          <Button fullWidth variant="outlined" onClick={onClose}>
            Stay Logged In
          </Button>

          <Button
            fullWidth
            variant="contained"
            color="error"
            onClick={onConfirm}
          >
            Logout
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
