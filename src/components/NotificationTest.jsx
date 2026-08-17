"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getRole } from "@/lib/cookie";

export default function NotificationToast({
  toastId,
  icon,
  iconColor,
  iconBg,
  title,
  body,
  onView,
}) {
  const [role, setRole] = useState(null);

  const router = useRouter();
  
  useEffect(() => {
    const storedRole = getRole();
    setRole(storedRole);
  }, []);

  return (
    <div className="notification-toast">
      <div
        className="notification-toast__icon"
        style={{
          color: iconColor || "#2563eb",
          backgroundColor: iconBg || "#eff6ff",
        }}
      >
        {icon}
      </div>

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
