// src/pages/Auth/login/components/LoginTabToggle.jsx

const TABS = [
  { id: "email", label: "Email & Password" },
  { id: "mobile", label: "Mobile OTP" },
];

export default function LoginTabToggle({ activeTab, onSwitch }) {
  return (
    <div className="tabs-grp">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onSwitch(tab.id)}
          className={`login-tab ${activeTab === tab.id ? "login-tab--active" : ""}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
