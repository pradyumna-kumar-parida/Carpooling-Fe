import React, { useEffect, useRef, useState } from "react";

import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";
import ChatToggleButton from "./components/ChatToggleButton";

import { useChat } from "./hooks/useChat";
import "../../styles/track-chat.css";
const ChatPanel = ({ driver }) => {
  const { messages, inputText, setInputText, handleSend, handleKeyDown } =
    useChat();

  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleOpen = () => {
    setIsVisible(true);

    window.requestAnimationFrame(() => {
      setIsOpen(true);
    });
  };

  const handleClose = () => {
    setIsOpen(false);

    setTimeout(() => {
      setIsVisible(false);
    }, 280);
  };

  return (
    <>
      <div className={`chat-panel-shell${isVisible ? " chat-visible" : ""}`}>
        <div
          className={`cp-container${isVisible ? " cp-open" : ""}${
            isOpen ? " cp-open--active" : isVisible ? " cp-open--hidden" : ""
          }`}
        >
          <ChatHeader driver={driver} onClose={handleClose} />

          <ChatMessages
            messages={messages}
            driver={driver}
            messagesEndRef={messagesEndRef}
          />

          <ChatInput
            inputText={inputText}
            setInputText={setInputText}
            handleSend={handleSend}
            handleKeyDown={handleKeyDown}
          />
        </div>

        {isVisible && (
          <div className="chat-panel-overlay" onClick={handleClose} />
        )}
      </div>

      {!isVisible && (
        <ChatToggleButton count={messages.length} onOpen={handleOpen} />
      )}
    </>
  );
};

export default ChatPanel;
