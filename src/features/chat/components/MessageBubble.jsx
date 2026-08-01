import { IoCheckmarkSharp } from "react-icons/io5";

import { IoCheckmarkDoneSharp } from "react-icons/io5";

const MessageBubble = ({ msg, driver }) => {
  const formatTimeUTC = (time) => {
  return new Date(time).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });
};


  return (
    <div
      className={`cp-msg-row ${
        msg.sender === "passenger" ? "cp-msg-right" : "cp-msg-left"
      }`}
    >
      {msg.sender === "driver" && (
        <img
          src={driver?.profile_picture}
          alt=""
          className="cp-msg-avatar"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
              driver?.name,
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
        <p className="cp-bubble-text">{msg.message}</p>

        <span className="cp-bubble-time">
          {/* {formatTimeUTC(msg.created_at)} */}
          {(msg?.time)}
          {/* <span>
            <IoCheckmarkSharp size={12} />
          </span> */}
          {msg.sender === "passenger" && (
            <span>
              <IoCheckmarkDoneSharp size={12} />
            </span>
          )}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;
