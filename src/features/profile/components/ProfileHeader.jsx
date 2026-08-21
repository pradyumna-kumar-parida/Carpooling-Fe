"use client";

import Image from "next/image";
import { FiPlus, FiX } from "react-icons/fi";
import { FaEdit, FaUserCircle } from "react-icons/fa";
import { MdOutlineSave } from "react-icons/md";
import { useRouter } from "next/navigation";
import { IoStar } from "react-icons/io5";
import { useEffect, useState } from "react";
import { getRole } from "@/lib/cookie";
import { uploadProfileApi } from "@/services/client/authService";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { MdVerified } from "react-icons/md";
export default function ProfileHeader({
  isEditing,
  saving,
  userData,
  editData,
  filePreview,
  isDriver,
  onEditToggle,
  onSave,
  onFileChange,
}) {
  const router = useRouter();

  const [role, setRole] = useState(null);
  useEffect(() => {
    const storedRole = getRole();
    setRole(storedRole);
  }, []);

  // ── Quick profile-picture upload (independent of the "Edit" form) ──────
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarAlert, setAvatarAlert] = useState({
    open: false,
    type: "info",
    message: "",
  });
  console.log("userdata allllll", userData);

  const showAvatarAlert = (type, message) =>
    setAvatarAlert({ open: true, type, message });

  //   const handleAvatarSelect = (e) => {
  //     const file = e.target.files?.[0];
  //     e.target.value = ""; // allow re-selecting the same file again later
  //     console.log("files is",file);

  //     if (!file) return;

  //     setAvatarFile(file);
  // console.log("avta5r file is ",avatarFile);

  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setAvatarPreview(reader.result);
  //       setAvatarModalOpen(true);
  //     };
  //     reader.readAsDataURL(file);
  //   };

  const handleAvatarSelect = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";

    console.log("Selected file:", file);

    if (!file) return;

    setAvatarFile(file);

    console.log("File that will be uploaded:", file);

    const reader = new FileReader();

    reader.onloadend = () => {
      setAvatarPreview(reader.result);
      setAvatarModalOpen(true);
    };

    reader.readAsDataURL(file);
  };

  const closeAvatarModal = () => {
    if (avatarUploading) return;
    setAvatarModalOpen(false);
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const handleAvatarSave = async () => {
    if (!avatarFile) return;

    setAvatarUploading(true);

    try {
      const formData = new FormData();
      formData.append("profile_picture", avatarFile);

      const response = await uploadProfileApi(formData);

      console.log("PROFILE IMAGE RESPONSE:", response);
      console.log("PROFILE IMAGE RESPONSE DATA:", response?.data);

      if (response?.data?.status === "success") {
        sessionStorage.setItem("profilePhotoadded", "true");

        console.log(
          "profilePhotoadded:",
          sessionStorage.getItem("profilePhotoadded"),
        );

        showAvatarAlert(
          "success",
          response?.data?.message || "Profile picture uploaded successfully!",
        );

        setAvatarModalOpen(false);
        setAvatarFile(null);
        setAvatarPreview(null);

        // Refresh the complete page so the latest profile picture
        // is fetched from the server.
        window.location.reload();
      }
    } catch (err) {
      console.error("Profile image upload error:", err);

      showAvatarAlert(
        "error",
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Failed to upload profile picture.",
      );
    } finally {
      setAvatarUploading(false);
    }
  };

  const hasProfilePicture = Boolean(userData?.profilePicture);

  return (
    <div className="profile-header">
      <Snackbar
        open={avatarAlert.open}
        autoHideDuration={4000}
        onClose={() => setAvatarAlert((a) => ({ ...a, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ zIndex: 9999 }}
      >
        <Alert
          severity={avatarAlert.type}
          variant="filled"
          onClose={() => setAvatarAlert((a) => ({ ...a, open: false }))}
          sx={{ width: "100%" }}
        >
          {avatarAlert.message}
        </Alert>
      </Snackbar>

      <div className="profile-header-content">
        <div className="profile-avatar-section">
          <div className="profile-avatar-wrapper">
            <div className={isEditing ? "profile-avatar-edit" : ""}>
              {hasProfilePicture ? (
                <Image
                  src={userData.profilePicture}
                  alt="Profile"
                  className="profile-avatar"
                  width={96}
                  height={96}
                  unoptimized
                />
              ) : (
                <FaUserCircle className="profile-default-avatar" size={96} />
              )}

              {!hasProfilePicture && (
                <>
                  <label htmlFor="profilePicture" className="avatar-upload-btn">
                    <FiPlus />
                  </label>

                  <input
                    type="file"
                    id="profilePicture"
                    accept="image/*"
                    onChange={handleAvatarSelect}
                    style={{ display: "none" }}
                  />
                </>
              )}
            </div>
          </div>

          <div className="profile-info">
            <h1 className="profile-name">
              {userData.fullname}
              {userData.userverified && (
                <MdVerified className="verify-driver" />
              )}
            </h1>
            <p className="profile-email">{userData.email || "Not provided"}</p>
            {role === "driver" && !userData.userverified ? (
              <span className="profile-badge">Not Verified</span>
            ) : (
              ""
            )}

            <p className="profile-rate">
              <span>
                <IoStar color="#e4ce0d" />
                <IoStar color="#e4ce0d" />
                <IoStar color="#e4ce0d" />
                <IoStar color="#e4ce0d" />
              </span>
              4.8 rating{" "}
            </p>
          </div>
          {role === "driver" && !userData?.profileCompleted && (
            <div className="profile-progress-card">
              <div className="profile-progress-top">
                <div>
                  <h4 className="profile-progress-title">
                    Complete your profile
                  </h4>
                  <p className="profile-progress-text">
                    Complete your profile to build trust and get more ride
                    bookings.
                  </p>
                </div>
                <span className="profile-progress-percentage">25%</span>
              </div>

              <div className="profile-progress-bar">
                <div
                  className="profile-progress-fill"
                  style={{ width: "25%" }}
                ></div>
              </div>

              <div className="profile-progress-footer">
                <span className="profile-progress-info">
                  8 of 12 profile sections completed
                </span>
                <button
                  type="button"
                  className="profile-progress-btn"
                  onClick={() => router.push("/driver/complete-profile")}
                >
                  Complete Profile
                </button>
              </div>
            </div>
          )}
        </div>
        {role === "driver" && !userData?.profileCompleted && (
          <div className="profile-progress-card1">
            <div className="profile-progress-top">
              <div>
                <h4 className="profile-progress-title">
                  Complete your profile
                </h4>
                <p className="profile-progress-text">
                  Complete your profile to build trust and get more ride
                  bookings.
                </p>
              </div>

              <span className="profile-progress-percentage">25%</span>
            </div>

            <div className="profile-progress-bar">
              <div
                className="profile-progress-fill"
                style={{ width: "25%" }}
              ></div>
            </div>

            <div className="profile-progress-footer">
              <span className="profile-progress-info">
                8 of 12 profile sections completed
              </span>

              <button
                className="profile-progress-btn"
                onClick={() => router.push("/driver/complete-profile")}
              >
                Complete
              </button>
            </div>
          </div>
        )}
        <div className="profile-actions">
          {!isEditing ? (
            <button type="button" className="btn-edit" onClick={onEditToggle}>
              <FaEdit />
              Edit
            </button>
          ) : (
            <div className="edit-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={onEditToggle}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-save"
                onClick={onSave}
                disabled={saving}
              >
                <MdOutlineSave />
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Avatar preview modal (reuses the same modal styles as DocumentCard) */}
      {avatarModalOpen && (
        <div
          className="document-preview-modal"
          role="dialog"
          aria-modal="true"
          onClick={closeAvatarModal}
        >
          <div
            className="document-preview-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="document-preview-close"
              onClick={closeAvatarModal}
              aria-label="Close preview"
              disabled={avatarUploading}
            >
              <FiX size={22} />
            </button>

            <div className="document-preview-content">
              <img
                src={avatarPreview}
                alt="Selected profile"
                className="document-preview-image"
              />
            </div>

            <div className="document-preview-title">Update Profile Picture</div>

            <div
              className="edit-actions"
              style={{ justifyContent: "center", marginTop: 16 }}
            >
              <button
                type="button"
                className="btn-cancel"
                onClick={closeAvatarModal}
                disabled={avatarUploading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-save"
                onClick={handleAvatarSave}
                disabled={avatarUploading}
              >
                <MdOutlineSave />
                {avatarUploading ? "Uploading..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
