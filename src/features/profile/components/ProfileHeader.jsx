"use client";

import Image from "next/image";
import { FiPlus } from "react-icons/fi";
import { FaEdit } from "react-icons/fa";
import { MdOutlineSave } from "react-icons/md";
import { useRouter } from "next/navigation";
import { IoStar } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { useEffect, useState } from "react";
import { getRole } from "@/lib/cookie";
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

  console.log("userdata", editData);
  const [role, setRole] = useState(null);
  useEffect(() => {
    const storedRole = getRole();
    setRole(storedRole);
  }, []);
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
                  <FaUserCircle className="profile-default-avatar" />
                )}

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
                  <FaUserCircle className="profile-default-avatar" size={96} />
                )}
                {!editData?.profilePicture && (
                    <>
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
                    </>
                  )}
              </>
            )}
          </div>

          <div className="profile-info">
            <h1 className="profile-name">
              {userData.fullname || "Not provided"}
            </h1>
            <p className="profile-email">{userData.email || "Not provided"}</p>
            {role === "driver" ? (
              <span className="profile-badge">verified</span>
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
              >
                Cancel
              </button>
              <button type="button" className="btn-save" onClick={onSave}>
                <MdOutlineSave />
                Save
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
