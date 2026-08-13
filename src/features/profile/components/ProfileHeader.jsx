"use client";

import Image from "next/image";
import { FiPlus } from "react-icons/fi";
import { FaEdit } from "react-icons/fa";
import { MdOutlineSave } from "react-icons/md";
import { useRouter } from "next/navigation";
import { IoStar } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
export default function ProfileHeader({
  isEditing,
  userData,
  editData,
  filePreview,
  isDriver,
  onEditToggle,
  onSave,
  onFileChange,
}) {
  const router = useRouter();

  const showCompleteProfileCard =
    isDriver && String(userData.profileCompleted).toLowerCase() === "true";
console.log("profile data", editData);

  return (
    <div className="profile-header">
      <div className="profile-header-content">
        <div className="profile-avatar-section">
     <div className="profile-avatar-wrapper">
  {isEditing ? (
    <div className="profile-avatar-edit">
      {filePreview?.profilePicture || editData?.profilePicture ? (
        <Image
          src={
            filePreview?.profilePicture || editData?.profilePicture
          }
          alt="Profile"
          className="profile-avatar"
          width={96}
          height={96}
          unoptimized
        />
      ) : (
        <FaUserCircle
          className="profile-default-avatar"
         
        />
      )}

      <label
        htmlFor="profilePicture"
        className="avatar-upload-btn"
      >
        <FiPlus />
      </label>

      <input
        type="file"
        id="profilePicture"
        accept="image/*"
        onChange={(e) => onFileChange(e, "profilePicture")}
        style={{ display: "none" }}
      />
    </div>
  ) : (
    <>
      {userData?.profilePicture ? (
        <Image
          src={userData.profilePicture}
          alt="Profile"
          className="profile-avatar"
          width={96}
          height={96}
          unoptimized
        />
      ) : (
        <FaUserCircle
          className="profile-default-avatar"
          size={96}
        />
      )}
    </>
  )}
</div>

          <div className="profile-info">
            <h1 className="profile-name">
              {userData.fullname || "Not provided"}
            </h1>
            <p className="profile-email">{userData.email || "Not provided"}</p>
            <span className="profile-badge">
              {userData.is_verified === 1 ? "verified":"Not verified"}
            </span>
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

          {showCompleteProfileCard && (
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
                <span className="profile-progress-percentage">65%</span>
              </div>

              <div className="profile-progress-bar">
                <div
                  className="profile-progress-fill"
                  style={{ width: "65%" }}
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

        <div className="profile-actions">
          {!isEditing ? (
            <button type="button" className="btn-edit" onClick={onEditToggle}>
              <FaEdit />
              Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={onEditToggle}
              >
                Cancel
              </button>
              <button type="button" className="btn-save" onClick={onSave}>
                <MdOutlineSave />
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
