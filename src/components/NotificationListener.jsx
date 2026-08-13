"use client";

import { useCallback, useState } from "react";
import { Snackbar, Alert } from "@mui/material";
import { useUserNotification } from "@/hooks/useUserNotification";

export default function NotificationListener() {
  const [notification, setNotification] = useState(null);

  const handleNotification = useCallback((data) => {
    setNotification(data);
  }, []);

  useUserNotification(handleNotification);

  const handleClose = () => {
    setNotification(null);
  };

  return (
    <Snackbar
      open={!!notification}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <Alert
        onClose={handleClose}
        severity="info"
        variant="filled"
        className="global-notification"
      >
        <strong>{notification?.title}</strong>

        <div>{notification?.message}</div>
      </Alert>
    </Snackbar>
  );
}
