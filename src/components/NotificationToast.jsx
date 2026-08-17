"use client";

import { toast } from "sonner";

export default function NotificationToast({
  toastId,
  icon,
  title,
  body,
  onView,
}) {
  return (
    <div className="notification-toast">
      <div className="notification-toast__icon">{icon}</div>

      <div className="notification-toast__content">
        <div className="notification-toast__header">
          <h4 className="notification-toast__title">{title}</h4>

          <button
            type="button"
            className="notification-toast__close"
            onClick={() => toast.dismiss(toastId)}
            aria-label="Close notification"
          >
            ×
          </button>
        </div>

        <p className="notification-toast__body">{body}</p>

        <button
          type="button"
          className="notification-toast__action"
          onClick={() => {
            toast.dismiss(toastId);

            if (onView) {
              onView();
            }
          }}
        >
          View notification
        </button>
      </div>
    </div>
  );
}
