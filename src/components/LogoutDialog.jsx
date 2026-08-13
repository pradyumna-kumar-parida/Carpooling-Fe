"use client";

import {
  Dialog,
  DialogContent,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import { FiAlertTriangle } from "react-icons/fi";

export default function LogoutDialog({
  open,
  onClose,
  onConfirm,
}) {
  const handleLogout = () => {
    // Close modal immediately
    onClose();

    // Perform logout after the modal close state is triggered
    setTimeout(() => {
      onConfirm();
    }, 0);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      className="logout-dialog"
    >
      <DialogContent className="logout-dialog-box"
        sx={{
          textAlign: "center",
          p: 3,
        }}
      >
        <div className="logout-icon">
          <FiAlertTriangle  color="#ff9800" />
        </div>

        <Typography variant="h6" fontWeight={700} mt={2}>
          Logout?
        </Typography>

        <Typography color="text.secondary" mt={1} mb={3} className="logout-confirm">
          Are you sure you want to logout from your account?
        </Typography>

        <Stack direction="row" spacing={2}>
          <Button
            fullWidth
            variant="outlined"
            onClick={onClose}
            className="logout-confirm-btn"
          >
            Stay 
          </Button>

          <Button
            fullWidth
            variant="contained"
            color="error"
            onClick={handleLogout}
            className="logout-confirm-btn"
          >
            Logout
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}