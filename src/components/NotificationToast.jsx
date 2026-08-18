"use client";

import { useEffect, useState } from "react";
import { getRole } from "@/lib/cookie";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function NotificationToast({
  toastId,
  icon: Icon,
  title,
  body,
  onView,
}) {
  const [role, setRole] = useState(null);
  const router = useRouter();
  useEffect(() => {
    setRole(getRole());
  }, []);
  console.log("role", role);

  const handleTransfer = () => {
    if (role === "driver") {
      router.push("/driver/notification");
    }
    router.push("/passenger/notification");
  };
  return (
    <div className="notification-toast">
      <div className="notification-toast__icon">
        {Icon && <Icon size={21} />}
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
          onClick={handleTransfer}
        >
          View notification
        </button>
      </div>
    </div>
  );
}
