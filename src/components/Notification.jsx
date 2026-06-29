import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import "../styles/index.css";
import Image from "next/image";
export default function NotificationPanel({
  open = false,
  onClose = () => {},
  notifications = [],
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      BackdropProps={{ invisible: true }}
      PaperProps={{
        className: "notification-dialog-paper",
      }}
    >
      <DialogTitle className="notification-dialog-title">
        <Box className="notification-title-wrapper">
          <Typography className="notification-title-text">
            Notifications{" "}
            <span className="notification-badge-count">
              ({notifications.length})
            </span>
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent className="notification-dialog-content">
        {notifications.length === 0 ? (
          <Box className="notification-empty-state">
            <Typography>No Notifications</Typography>
          </Box>
        ) : (
          notifications.map((item) => (
            <Box key={item.id} className="notification-item">
              <Box className="notification-item-wrapper">
                <Box className="notification-avatar">
                  <Image
                    src={item.img}
                    alt="img"
                    className="notification-avatar-image"
                  />
                </Box>

                <Box className="notification-content">
                  <Typography className="notification-item-title">
                    {item.title}
                  </Typography>

                  <Typography className="notification-item-body">
                    {item.body}
                  </Typography>

                  <Typography className="notification-item-time">
                    {item.time}
                  </Typography>
                </Box>

                {!item.read && <Box className="notification-unread-dot" />}
              </Box>
            </Box>
          ))
        )}
      </DialogContent>
    </Dialog>
  );
}
