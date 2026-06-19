"use client";

import Image from "next/image";

export default function DocumentCard({
  id,
  title,
  icon,
  accept = "image/*,.pdf",
  isEditing,
  uploadedValue,
  filePreview,
  onFileChange,
}) {
  const preview = filePreview[id];
  const isImage =
    typeof preview === "string" && preview.startsWith("data:image");

  return (
    <div className="document-card">
      <div className="document-icon">{icon}</div>
      <h3 className="document-title">{title}</h3>

      {isEditing ? (
        <div className="file-upload">
          <label htmlFor={id} className="file-upload-label">
            <UploadIcon />
            {preview || uploadedValue ? "Change File" : "Upload File"}
          </label>
          <input
            type="file"
            id={id}
            accept={accept}
            onChange={(e) => onFileChange(e, id)}
            style={{ display: "none" }}
          />
          {preview && (
            <div className="file-preview">
              {isImage ? (
                <Image
                  src={preview}
                  alt="Preview"
                  className="preview-image"
                  width={120}
                  height={80}
                  unoptimized
                />
              ) : (
                <p className="file-name">{preview}</p>
              )}
            </div>
          )}
        </div>
      ) : (
        <p className="document-status">
          {uploadedValue ? (
            <span className="status-uploaded">✓ Uploaded</span>
          ) : (
            <span className="status-pending">Not uploaded</span>
          )}
        </p>
      )}
    </div>
  );
}

function UploadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 4V12M6 8L10 4L14 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 16H16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}