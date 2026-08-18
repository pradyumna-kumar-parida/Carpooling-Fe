"use client";

import { useState, useMemo } from "react";
import { FiUser } from "react-icons/fi";
import { PiBankBold } from "react-icons/pi";
import { IoDocuments } from "react-icons/io5";
import { RiUserLocationFill } from "react-icons/ri";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

import { useProfile } from "../hooks/UseProfile";
import ProfileHeader from "./ProfileHeader";
import PersonalInfoTab from "../tabs/PersonalInfoTab";
import AddressTab from "../tabs/AddressTab";
import BankingTab from "../tabs/BankingTab";
import DocumentsTab from "../tabs/DocumentsTab";

const ALL_TABS = [
  { id: "personal", label: "Personal Info", icon: <FiUser /> },
  { id: "address", label: "Address", icon: <RiUserLocationFill /> },
  { id: "banking", label: "Banking", icon: <PiBankBold /> },
  { id: "documents", label: "Documents", icon: <IoDocuments /> },
];

export default function ProfilePage({ profileData }) {
  const {
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
  } = useProfile(profileData);

  // Passengers only get the Personal Info tab — no address/banking/documents.
  const TABS = useMemo(
    () => (isDriver ? ALL_TABS : ALL_TABS.filter((t) => t.id === "personal")),
    [isDriver],
  );

  const [activeTab, setActiveTab] = useState("personal");

  return (
    <div className="profile-page">
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={closeToast}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ zIndex: 9999 }}
      >
        <Alert
          severity={toast.type}
          variant="filled"
          onClose={closeToast}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>

      <div className="container">
        <ProfileHeader
          isEditing={isEditing}
          saving={saving}
          userData={userData}
          editData={editData}
          filePreview={filePreview}
          isDriver={isDriver}
          onEditToggle={handleEditToggle}
          onSave={handleSave}
          onFileChange={handleFileChange}
        />

        {TABS.length > 1 && (
          <div className="profile-tabs">
            <div className="tabs-wrapper">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="tab-icon">{tab.icon}</span>
                  <span className="tab-label">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="profile-content">
          <form onSubmit={handleSave}>
            {activeTab === "personal" && (
              <PersonalInfoTab
                isEditing={isEditing}
                userData={userData}
                editData={editData}
                onChange={handleInputChange}
              />
            )}

            {isDriver && activeTab === "address" && (
              <AddressTab
                isEditing={isEditing}
                userData={userData}
                editData={editData}
                onChange={handleInputChange}
              />
            )}

            {isDriver && activeTab === "banking" && (
              <BankingTab
                isEditing={isEditing}
                userData={userData}
                editData={editData}
                onChange={handleInputChange}
              />
            )}

            {isDriver && activeTab === "documents" && (
              <DocumentsTab
                isEditing={isEditing}
                userData={userData}
                filePreview={filePreview}
                onFileChange={handleFileChange}
              />
            )}
          </form>
        </div>
      </div>
    </div>
  );
}