"use client";

import Image from "next/image";
import { FiUser, FiPlus } from "react-icons/fi";
import { FaEdit } from "react-icons/fa";
import { MdOutlineSave } from "react-icons/md";

export default function ProfileHeader({
  isEditing,
  userData,
  editData,
  filePreview,
  onEditToggle,
  onSave,
  onFileChange,
}) {
  return (
    <div className="profile-header">
      <div className="profile-header-content">
        <div className="profile-avatar-section">
          <div className="profile-avatar-wrapper">
            {isEditing ? (
              <div className="profile-avatar-edit">
                <Image
                  src={
                    filePreview.profilePicture ||
                    editData.profilePicture ||
                    "https://via.placeholder.com/150"
                  }
                  alt="Profile"
                  className="profile-avatar"
                  width={96}
                  height={96}
                  unoptimized
                />
                <label htmlFor="profilePicture" className="avatar-upload-btn">
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
              <Image
                src={
                  userData.profilePicture || "https://via.placeholder.com/150"
                }
                alt="Profile"
                className="profile-avatar"
                width={96}
                height={96}
                unoptimized
              />
            )}
          </div>

          <div className="profile-info">
            <h1 className="profile-name">{userData.fullname}</h1>
            <p className="profile-email">{userData.email}</p>
            <span className="profile-badge">{userData.usertype}</span>
          </div>
          <div className="profile-progress-card">
            <div className="profile-progress-top">
              <div>
                <h4 className="profile-progress-title">Complete your profile</h4>
                <p className="profile-progress-text">
                  Complete your profile to build trust and get more ride bookings.
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

              <button className="profile-progress-btn">
                Complete Profile
              </button>
            </div>
          </div>
        </div>

        <div className="profile-actions">
          {!isEditing ? (
            <button className="btn-edit" onClick={onEditToggle}>
              <FaEdit />
              Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button className="btn-cancel" onClick={onEditToggle}>
                Cancel
              </button>
              <button className="btn-save" onClick={onSave}>
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
