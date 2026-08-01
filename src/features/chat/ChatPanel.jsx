import React, { useEffect, useRef, useState } from "react";

import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";
import ChatToggleButton from "./components/ChatToggleButton";

import { useChat } from "./hooks/useChat";
import "../../styles/track-chat.css";
import { useSocket } from "@/hooks/useSocket";
const ChatPanel = ({ driver, defaultOpen = false, onClose }) => {
  const {
    conversation,
    loading,
    messages,
    inputText,
    setInputText,
    handleSend,
    handleKeyDown,
  } = useChat();
  useSocket();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isVisible, setIsVisible] = useState(defaultOpen);

  const messagesEndRef = useRef(null);
  console.log("messages", messages);

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

      // notify parent after animation
      onClose?.();
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
          <ChatHeader
            driver={conversation?.userDetails}
            onClose={handleClose}
          />

          <ChatMessages
            messages={messages}
            driver={conversation?.userDetails}
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

      {!defaultOpen && !isVisible && (
        <ChatToggleButton count={messages.length} onOpen={handleOpen} />
      )}
    </>
  );
};

export default ChatPanel;
