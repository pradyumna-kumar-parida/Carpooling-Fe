"use client";

import DocumentCard from "../components/DocumentCard";
import { FaRegAddressCard } from "react-icons/fa6";
import { GrDocumentImage } from "react-icons/gr";
import { BsBank } from "react-icons/bs";
import { HiOutlineCreditCard } from "react-icons/hi2";

const DOCUMENTS = [
  {
    id: "driverLicense",
    title: "Driver License",
    accept: "image/*,.pdf",
    icon: <GrDocumentImage className="svg"/>

  },
  {
    id: "aadhaarCard",
    title: "Aadhaar Card",
    accept: "image/*,.pdf",
    icon: <FaRegAddressCard  className="svg" />,
  },
  {
    id: "panCard",
    title: "PAN Card",
    accept: "image/*,.pdf",
    icon:<HiOutlineCreditCard className="svg"/>

  },

  {
    id: "bankAccountDetails",
    title: "Bank Details Document",
    accept: "image/*,.pdf",
    icon: <BsBank  className="svg"/>

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
