"use client";

import { getRole } from "@/lib/cookie";
import { useState } from "react";

const initialUserData = {
  fullname: "",
  email: "",
  phone: "",
  usertype: "",
  password: "",
  confirmPassword: "",
  terms: false,

  completeProfile: "no", // "yes" | "no" — from API

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

export function useProfile(profileData) {
  const [isEditing, setIsEditing] = useState(false);

  const [userData, setUserData] = useState({
    ...initialUserData,
    ...(profileData || {}),
  });

  const [editData, setEditData] = useState({
    ...initialUserData,
    ...(profileData || {}),
  });

  const [filePreview, setFilePreview] = useState({});

const isDriver = getRole()?.toLowerCase() === "driver";

  const handleEditToggle = () => {
    if (isEditing) {
      setEditData({ ...userData });
      setFilePreview({});
    }
    setIsEditing((prev) => !prev);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setUserData({ ...editData });
    setIsEditing(false);
    setFilePreview({});
    alert("Profile updated successfully!");
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
    userData,
    editData,
    filePreview,
    isDriver,
    handleEditToggle,
    handleSave,
    handleInputChange,
    handleFileChange,
  };
}
