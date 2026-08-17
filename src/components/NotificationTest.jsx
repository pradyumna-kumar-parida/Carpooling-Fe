"use client";

import React, { useState } from "react";

import { registerBrowserForNotifications } from "@/lib/notifications/register";

export default function NotificationTest() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleEnableNotifications = async () => {
    try {
      setLoading(true);
      setResult(null);

      const response = await registerBrowserForNotifications();

      console.log("Notification registration:", response);

      setResult(response);
    } catch (error) {
      console.error(error);

      setResult({
        success: false,
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={handleEnableNotifications}
        disabled={loading}
        className="rounded-lg bg-blue-600 px-5 py-3 text-white disabled:opacity-50"
      >
        {loading ? "Setting up..." : "Enable Notifications"}
      </button>

      {result && (
        <pre className="max-w-3xl overflow-auto rounded-lg bg-gray-100 p-4 text-sm">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
