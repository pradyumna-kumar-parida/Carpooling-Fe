"use client";
import { vehicleDetailUpdateApi } from "@/services/client/vehicleService";
// src/pages/Vehicle/vehicle-details/hooks/useVehicleDetails.js

import { useState, useEffect } from "react";


export function useVehicleDetails(vehiclesFetch) {
  const vehicleList = vehiclesFetch
  const [selected, setSelected] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "success",
  });

  // ── Auto-select first vehicle when list loads ─────────────────────────
  useEffect(() => {
    if (vehicleList?.length > 0 && !selected) {
      setSelected(vehicleList[0]);
    }
  }, [vehicleList]);

  // ── Toast ─────────────────────────────────────────────────────────────
  const showToast = (message, type = "success") =>
    setToast({ open: true, message, type });
  const closeToast = () => setToast((p) => ({ ...p, open: false }));

  // ── Edit handlers ─────────────────────────────────────────────────────
  const handleEditOpen = () => {
    setEditData({ ...selected });
    setEditOpen(true);
  };
  const handleEditClose = () => {
    setEditOpen(false);
    setEditData({});
  };
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((p) => ({ ...p, [name]: value }));
  };

  // ── Submit update ─────────────────────────────────────────────────────
  const handleEditSubmit = async () => {
    setEditLoading(true);
    try {
      const payload = new FormData();
      payload.append("vehicle_id", editData.id || "");
      payload.append("brand", editData.brand || "");
      payload.append("model", editData.model || "");
      payload.append("color", editData.color || "");
      payload.append("manufacture_year", editData.manufacture_year || "");
      payload.append("registration_number", editData.registration_number || "");
      payload.append("fuel_type", editData.fuel_type || "");
      payload.append("seats", String(editData.seats || ""));
      payload.append("rc_number", editData.rc_number || "");
      payload.append("rc_expiry_date", editData.rc_expiry_date || "");
      payload.append("insurance_provider", editData.insurance_provider || "");
      payload.append("policy_number", editData.policy_number || "");
      payload.append("insurance_expiry", editData.insurance_expiry || "");

      const response = await vehicleDetailUpdateApi(payload);

      if (
        response.data?.status === "success" ||
        [200, 201].includes(response.status)
      ) {
        // ── Update selected in local context list ──────────────────────
        setSelected((prev) => ({ ...prev, ...editData }));
        showToast("Vehicle updated successfully!");
        handleEditClose();
      } else {
        showToast(response.data?.message || "Update failed.", "error");
      }
    } catch (err) {
      showToast(
        err?.response?.data?.message || "Something went wrong.",
        "error",
      );
    } finally {
      setEditLoading(false);
    }
  };

  return {
    vehicles: vehicleList, // ← directly from context
    selected,
    setSelected,
    editOpen,
    editData,
    editLoading,
    handleEditOpen,
    handleEditClose,
    handleEditChange,
    handleEditSubmit,
    toast,
    closeToast,
  };
}
