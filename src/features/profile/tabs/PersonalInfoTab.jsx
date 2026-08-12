"use client";

export default function PersonalInfoTab({
  isEditing,
  userData,
  editData,
  onChange,
}) {
  return (
    <div className="profile-section">
      <h2 className="section-title">Personal Information</h2>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Full Name</label>
          {isEditing ? (
            <input
              type="text"
              name="fullname"
              value={editData.fullname}
              onChange={onChange}
              className="form-input"
              required
            />
          ) : (
            <p className="form-value">{userData.fullname || "Not provided"}</p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Email Address</label>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={editData.email}
              onChange={onChange}
              className="form-input"
              required
            />
          ) : (
            <p className="form-value">{userData.email || "Not provided"}</p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Phone Number</label>
          {isEditing ? (
            <input
              type="tel"
              name="phone"
              value={editData.phone}
              onChange={onChange}
              className="form-input"
              required
            />
          ) : (
            <p className="form-value">{userData.phone || "Not provided"}</p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">User Type</label>
          {isEditing ? (
            <select
              name="usertype"
              value={editData.usertype}
              onChange={onChange}
              className="form-input"
              required
            >
              <option value="">Select user type</option>
              <option value="Driver">Driver</option>
              <option value="Passenger">Passenger</option>
            </select>
          ) : (
            <p className="form-value">{userData.usertype === "2" ? "driver" : "passenger"|| "Not provided"}</p>
          )}
        </div>

        {isEditing && (
          <>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                name="password"
                value={editData.password}
                onChange={onChange}
                className="form-input"
                placeholder="Leave blank to keep current"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={editData.confirmPassword}
                onChange={onChange}
                className="form-input"
                placeholder="Leave blank to keep current"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}