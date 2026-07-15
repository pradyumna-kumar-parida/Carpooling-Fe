"use client";

export default function AddressTab({ isEditing, userData, editData, onChange }) {
  return (
    <div className="profile-section">
      <h2 className="section-title">Address Information</h2>

      <div className="form-grid">
        <div className="form-group full-width">
          <label className="form-label">Street Address</label>
          {isEditing ? (
            <textarea
              name="address"
              value={editData.address}
              onChange={onChange}
              className="form-input form-textarea"
              rows={3}
              required
            />
          ) : (
            <p className="form-value">{userData.address}</p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">City</label>
          {isEditing ? (
            <input
              type="text"
              name="city"
              value={editData.city}
              onChange={onChange}
              className="form-input"
              required
            />
          ) : (
            <p className="form-value">{userData.city}</p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">State</label>
          {isEditing ? (
            <input
              type="text"
              name="state"
              value={editData.state}
              onChange={onChange}
              className="form-input"
              required
            />
          ) : (
            <p className="form-value">{userData.state}</p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Postal Code</label>
          {isEditing ? (
            <input
              type="text"
              name="postalCode"
              value={editData.postalCode}
              onChange={onChange}
              className="form-input"
              required
            />
          ) : (
            <p className="form-value">{userData.postalCode}</p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Country</label>
          {isEditing ? (
            <input
              type="text"
              name="country"
              value={editData.country}
              onChange={onChange}
              className="form-input"
              required
            />
          ) : (
            <p className="form-value">{userData.country}</p>
          )}
        </div>
      </div>
    </div>
  );
}