import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import "../styles/index.css";
import Image from "next/image";
import type { NotificationItem } from "./notify";

type NotificationPanelProps = {
  open?: boolean;
  onClose?: () => void;
  notifications?: NotificationItem[];
  onUpdate?: (id: number, updates: Partial<NotificationItem>) => void;
};

export default function NotificationPanel({
  open = false,
  onClose = () => {},
  notifications = [],
  onUpdate = () => {},
}: NotificationPanelProps) {
  const handleItemClick = (item: NotificationItem) => {
    if (!item.read) {
      onUpdate(item.id, { read: true });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      BackdropProps={{
        invisible: true,
      }}
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
            <Box
              key={item.id}
              className="notification-item"
              onClick={() => handleItemClick(item)}
            >
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
