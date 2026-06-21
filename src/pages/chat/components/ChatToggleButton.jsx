import chatIcon from "../../../../assets/Images/chat-icon.png";

const ChatToggleButton = ({
  onOpen,
  count,
}) => {
  return (
    <button
      className="chat-bar-showup"
      type="button"
      onClick={onOpen}
    >
      <img
        src={chatIcon}
        alt="chat"
        width="100%"
        height="100%"
      />

      {count > 0 && (
        <span className="chat-badge">
          {count}
        </span>
      )}
    </button>
  );
};

export default ChatToggleButton;