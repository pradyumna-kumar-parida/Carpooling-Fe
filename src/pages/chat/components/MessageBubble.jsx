const MessageBubble = ({ msg, driver }) => {
  return (
    <div
      className={`cp-msg-row ${
        msg.sender === "passenger"
          ? "cp-msg-right"
          : "cp-msg-left"
      }`}
    >
      {msg.sender === "driver" && (
        <img
          src={driver.driver_profile_picture}
          alt=""
          className="cp-msg-avatar"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
              driver.driver_name
            )}&background=1a56db&color=fff&size=32`;
          }}
        />
      )}

      <div
        className={`cp-bubble ${
          msg.sender === "passenger"
            ? "cp-bubble-passenger"
            : "cp-bubble-driver"
        }`}
      >
        <p className="cp-bubble-text">{msg.text}</p>

        <span className="cp-bubble-time">
          {msg.time}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;