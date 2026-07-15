"use client";

import DocumentCard from "../components/DocumentCard";

const DOCUMENTS = [
  {
    id: "driverLicense",
    title: "Driver License",
    accept: "image/*,.pdf",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect
          x="4"
          y="8"
          width="24"
          height="16"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="12" cy="14" r="2" fill="currentColor" />
        <path
          d="M18 13H24M18 17H24"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "aadhaarCard",
    title: "Aadhaar Card",
    accept: "image/*,.pdf",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect
          x="4"
          y="8"
          width="24"
          height="16"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M10 14H22M10 18H18"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "panCard",
    title: "PAN Card",
    accept: "image/*,.pdf",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect
          x="4"
          y="8"
          width="24"
          height="16"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M8 12H12M8 16H16M8 20H14"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "passportPhoto",
    title: "Passport Photo",
    accept: "image/*",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
        <path
          d="M8 24C8 20 11 18 16 18C21 18 24 20 24 24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "bankAccountDetails",
    title: "Bank Details Document",
    accept: "image/*,.pdf",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path
          d="M4 12L16 4L28 12V26C28 26.5304 27.7893 27.0391 27.4142 27.4142C27.0391 27.7893 26.5304 28 26 28H6C5.46957 28 4.96086 27.7893 4.58579 27.4142C4.21071 27.0391 4 26.5304 4 26V12Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 28V16H20V28"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function DocumentsTab({
  isEditing,
  userData,
  filePreview,
  onFileChange,
}) {
  return (
    <div className="profile-section">
      <h2 className="section-title">Documents & Verification</h2>

      <div className="documents-grid">
        {DOCUMENTS.map((doc) => (
          <DocumentCard
            key={doc.id}
            id={doc.id}
            title={doc.title}
            icon={doc.icon}
            accept={doc.accept}
            isEditing={isEditing}
            uploadedValue={userData[doc.id]}
            filePreview={filePreview}
            onFileChange={onFileChange}
          />
        ))}
      </div>
    </div>
  );
}
