import { TbSend } from "react-icons/tb";

const ChatInput = ({
  inputText,
  setInputText,
  handleSend,
  handleKeyDown,
}) => {
  return (
    <div className="cp-input-bar">
      <input
        type="text"
        className="cp-input"
        placeholder="Type a message..."
        value={inputText}
        onChange={(e) =>
          setInputText(e.target.value)
        }
        onKeyDown={handleKeyDown}
      />

      <button
        className={`cp-send-btn ${
          inputText.trim() ? "active" : ""
        }`}
        onClick={handleSend}
      >
        <TbSend size={22} />
      </button>
    </div>
  );
};

export default ChatInput;