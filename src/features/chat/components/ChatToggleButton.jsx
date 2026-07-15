import chatIcon from "../../../assets/images/chat-icon.png";

const ChatToggleButton = ({ onOpen, count }) => {
  return (
    <button className="chat-bar-showup" type="button" onClick={onOpen}>
      <img src={chatIcon.src} alt="chat" width="100%" height="100%" />

      {count > 0 && <span className="chat-badge">{count}</span>}
    </button>
  );
};

export default ChatToggleButton;
