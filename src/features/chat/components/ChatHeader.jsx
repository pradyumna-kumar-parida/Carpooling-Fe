import { BiSolidPhoneCall } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";

const ChatHeader = ({ driver, onClose }) => {
  return (
    <div className="cp-header">
      <img
        src={driver.driver_profile_picture}
        alt={driver.driver_name}
        className="cp-driver-avatar"
        onError={(e) => {
          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
            driver.driver_name
          )}&background=1a56db&color=fff`;
        }}
      />

      <div className="cp-driver-meta">
        <p className="cp-driver-name">
          Chat with {driver.driver_name}
        </p>

        <div className="cp-online-row">
          <span className="cp-online-dot" />
          <span className="cp-online-text">Online</span>
        </div>
      </div>

      <div className="cp-header-actions">
        <a
          href={`tel:${driver.driver_phone}`}
          className="cp-call-btn"
        >
          <BiSolidPhoneCall size={22} />
        </a>

        <button
          className="chat-close-btn"
          onClick={onClose}
        >
          <RxCross2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;