"use client";

import { useState } from "react";

const initialUserData = {
  fullname: "Deepak Kumar",
  email: "deepak.kumar@example.com",
  phone: "+91 9876543210",
  usertype: "Driver",
  password: "********",
  confirmPassword: "********",
  terms: true,
  city: "Mumbai",
  state: "Maharashtra",
  country: "India",
  postalCode: "400001",
  address: "123, Marine Drive, Mumbai",
  bankAccountHolder: "Deepak Kumar",
  bankAccountNumber: "1234567890123456",
  bankIFSC: "SBIN0001234",
  bankBranchName: "Mumbai Main Branch",
  bankBranchCode: "001234",
  driverLicense: null,
  aadhaarCard: null,
  panCard: null,
  passportPhoto: null,
  bankAccountDetails: null,
  profilePicture: "https://i.pravatar.cc/150?img=12",
};

export function useProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(initialUserData);
  const [editData, setEditData] = useState({ ...initialUserData });
  const [filePreview, setFilePreview] = useState({});

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
    handleEditToggle,
    handleSave,
    handleInputChange,
    handleFileChange,
  };
}
