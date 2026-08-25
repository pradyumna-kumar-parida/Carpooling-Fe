"use client";

import Image from "next/image";
import { useState } from "react";
import { FiEye, FiX } from "react-icons/fi";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

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
  const [previewOpen, setPreviewOpen] = useState(false);

  const preview = filePreview?.[id];

  const imageSrc = (() => {
    // Newly selected image
    if (typeof preview === "string" && preview.startsWith("data:image")) {
      return preview;
    }

    // Existing uploaded image
    if (typeof uploadedValue === "string") {
      const lower = uploadedValue.toLowerCase();

      if (
        lower.startsWith("data:image") ||
        lower.includes(".png") ||
        lower.includes(".jpg") ||
        lower.includes(".jpeg") ||
        lower.includes(".gif") ||
        lower.includes(".webp") ||
        lower.includes(".svg")
      ) {
        return uploadedValue;
      }
    }

    return null;
  })();

  const isImage = Boolean(imageSrc);

  const handleOpenPreview = () => {
    if (!imageSrc) return;
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
  };

  return (
    <>
      <div className="document-card">
        {/* Header */}
        <div className="document-card-header">
          <div className="document-icon">{icon}</div>

          {/* Preview button */}
          {isImage && (
            <button
              type="button"
              className="document-preview-button"
              onClick={handleOpenPreview}
              aria-label={`Preview ${title}`}
              title={`Preview ${title}`}
            >
              <FiEye size={13} />
            </button>
          )}
        </div>

        <h3 className="document-title">{title}</h3>

        {/* Edit mode */}
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
              <span className="status-uploaded">
                <IoMdCheckmarkCircleOutline />
                Uploaded
              </span>
            ) : (
              <span className="status-pending">Not uploaded</span>
            )}
          </p>
        )}
      </div>

      {/* Preview Modal */}
      {previewOpen && imageSrc && (
        <div
          className="document-preview-modal"
          role="dialog"
          aria-modal="true"
          onClick={handleClosePreview}
        >
          <div
            className="document-preview-panel"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              className="document-preview-close"
              onClick={handleClosePreview}
              aria-label="Close preview"
            >
              <FiX size={22} />
            </button>

            {/* Image */}
            <div className="document-preview-content">
              <img
                src={imageSrc}
                alt={`${title} preview`}
                className="document-preview-image"
              />
            </div>

            <div className="document-preview-title">{title}</div>
          </div>
        </div>
      )}
    </>
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
