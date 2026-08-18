"use client";

import { getRole } from "@/lib/cookie";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UpdateProfilepApi } from "@/services/client/authService";

const initialUserData = {
  fullname: "",
  email: "",
  phone: "",
  usertype: "",
  password: "",
  confirmPassword: "",
  terms: false,

  city: "",
  state: "",
  country: "",
  postalCode: "",
  address: "",

  bankAccountHolder: "",
  bankAccountNumber: "",
  bankIFSC: "",
  bankBranchName: "",
  bankBranchCode: "",

  driverLicense: null,
  aadhaarCard: null,
  panCard: null,
  bankAccountDetails: null,

  profilePicture: "",
};

function computeIsDriver(usertype) {
  return String(usertype || "").toLowerCase() === "driver";
}

// Maps local field names -> the backend keys expected by /update-user-details.
// Profile picture is intentionally NOT sent here — it has its own dedicated
// upload flow (uploadProfileApi) triggered from the "+" icon on the avatar.
function buildUpdatePayload(editData) {
  const payload = new FormData();

  payload.append("name", editData.fullname ?? "");
  payload.append("email", editData.email ?? "");
  payload.append("phone", editData.phone ?? "");

  payload.append("city", editData.city ?? "");
  payload.append("state", editData.state ?? "");
  payload.append("country", editData.country ?? "");
  payload.append("postal_code", editData.postalCode ?? "");
  payload.append("address", editData.address ?? "");

  payload.append("bank_account_holder", editData.bankAccountHolder ?? "");
  payload.append("bank_account_number", editData.bankAccountNumber ?? "");
  payload.append("bank_account_ifsc", editData.bankIFSC ?? "");
  payload.append("bank_branch_name", editData.bankBranchName ?? "");

  // Only send document files that were actually (re)selected this session —
  // existing values are strings/URLs, not File objects.
  if (editData.driverLicense instanceof File) {
    payload.append("driver_license", editData.driverLicense);
  }
  if (editData.aadhaarCard instanceof File) {
    payload.append("adhhar_card", editData.aadhaarCard);
  }
  if (editData.panCard instanceof File) {
    payload.append("pan_card", editData.panCard);
  }
  if (editData.bankAccountDetails instanceof File) {
    payload.append("bank_account", editData.bankAccountDetails);
  }

  return payload;
}

export function useProfile(profileData) {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [userData, setUserData] = useState({
    ...initialUserData,
    ...(profileData || {}),
  });

  const [editData, setEditData] = useState({
    ...initialUserData,
    ...(profileData || {}),
  });

  const [filePreview, setFilePreview] = useState({});

  const [toast, setToast] = useState({
    open: false,
    type: "success",
    message: "",
  });

  const showToast = (type, message) => setToast({ open: true, type, message });
  const closeToast = () => setToast((t) => ({ ...t, open: false }));

  const isDriver = getRole()?.toLowerCase() === "driver";

  const handleEditToggle = () => {
    if (isEditing) {
      setEditData({ ...userData });
      setFilePreview({});
    }
    setIsEditing((prev) => !prev);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (saving) return;

    setSaving(true);
    try {
      const payload = buildUpdatePayload(editData);
      const response = await UpdateProfilepApi(payload);

      setUserData({ ...editData });
      setIsEditing(false);
      setFilePreview({});

      showToast(
        "success",
        response?.data?.message || "Profile updated successfully!",
      );

      // Refresh so the page pulls the latest saved data from the server.
      router.refresh();
    } catch (err) {
      showToast(
        "error",
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Failed to update profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setEditData((prev) => ({ ...prev, [fieldName]: file }));

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview((prev) => ({ ...prev, [fieldName]: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview((prev) => ({ ...prev, [fieldName]: file.name }));
    }
  };

  return {
    isEditing,
    saving,
    userData,
    editData,
    filePreview,
    isDriver,
    toast,
    closeToast,
    handleEditToggle,
    handleSave,
    handleInputChange,
    handleFileChange,
  };
}
