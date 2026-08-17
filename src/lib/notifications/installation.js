"use client";

const INSTALLATION_ID_KEY = "carpooling_notification_installation_id";

export const getInstallationId = () => {
  if (typeof window === "undefined") {
    return null;
  }

  let installationId = localStorage.getItem(INSTALLATION_ID_KEY);

  if (!installationId) {
    installationId = crypto.randomUUID();

    localStorage.setItem(INSTALLATION_ID_KEY, installationId);
  }

  return installationId;
};
