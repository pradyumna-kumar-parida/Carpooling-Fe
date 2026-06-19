"use client";

export default function BankingTab({ isEditing, userData, editData, onChange }) {
  const fields = [
    { name: "bankAccountHolder", label: "Account Holder Name" },
    { name: "bankAccountNumber", label: "Account Number" },
    { name: "bankIFSC", label: "IFSC Code" },
    { name: "bankBranchName", label: "Branch Name" },
    { name: "bankBranchCode", label: "Branch Code" },
  ];

  return (
    <div className="profile-section">
      <h2 className="section-title">Banking Information</h2>

      <div className="form-grid">
        {fields.map(({ name, label }) => (
          <div className="form-group" key={name}>
            <label className="form-label">{label}</label>
            {isEditing ? (
              <input
                type="text"
                name={name}
                value={editData[name]}
                onChange={onChange}
                className="form-input"
              />
            ) : (
              <p className="form-value">{userData[name] || "Not provided"}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}