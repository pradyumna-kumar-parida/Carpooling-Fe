type Tab = {
  id: string;
  label: string;
};

const TABS: Tab[] = [
  { id: "email", label: "Email & Password" },
  { id: "mobile", label: "Mobile OTP" },
];

type Props = {
  activeTab: string;
  onSwitch: (tab: string) => void;
};

export default function LoginTabToggle({ activeTab, onSwitch }: Props) {
  return (
    <div className="tabs-grp">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onSwitch(tab.id)}
          className={`login-tab ${
            activeTab === tab.id ? "login-tab--active" : ""
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}