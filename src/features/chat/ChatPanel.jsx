import React, { useEffect, useRef, useState } from "react";

import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";
import ChatToggleButton from "./components/ChatToggleButton";

import { useChat } from "./hooks/useChat";
import "../../styles/track-chat.css";
import { useSocket } from "@/hooks/useSocket";

const ChatPanel = ({
  driver,
  bookingId,
  bookingCode,
  defaultOpen = false,
  onClose,
}) => {
  const {
    conversation,
    loading,
    error,
    messages,
    inputText,
    setInputText,
    handleSend,
    handleKeyDown,
  } = useChat(bookingId);
  useSocket();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isVisible, setIsVisible] = useState(defaultOpen);

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

      // notify parent after animation
      onClose?.();
    }, 280);
  };

  const fallbackDriver = driver?.driver // shape used by MyRides (ride.driver.*)
    ? {
        name: driver.driver.name,
        phone: driver.driver.phone,
        profile_picture: driver.driver.avatar,
      }
    : driver?.userDetails // shape used by Confirmation (bookingRideDetails.userDetails.*)
      ? {
          name: driver.userDetails.name,
          phone: driver.userDetails.phone,
          profile_picture: driver.userDetails.profile_picture,
        }
      : null;

  const headerDriver = conversation?.userDetails || fallbackDriver;

  // only show the full-panel spinner on first load — once we have a
  // conversation, later refreshes (e.g. re-renders) shouldn't blank the panel
  const showFullLoading = loading && !conversation;

  return (
    <>
      <div className={`chat-panel-shell${isVisible ? " chat-visible" : ""}`}>
        <div
          className={`cp-container${isVisible ? " cp-open" : ""}${
            isOpen ? " cp-open--active" : isVisible ? " cp-open--hidden" : ""
          }`}
        >
          <ChatHeader driver={headerDriver} onClose={handleClose} />

          {showFullLoading && (
            <div className="cp-loading">
              <div className="cp-spinner" aria-hidden="true" />
              <p>Loading conversation...</p>
            </div>
          )}

          {!showFullLoading && error && (
            <div className="cp-error-state">
              <p>{error}</p>
            </div>
          )}

          {!showFullLoading && !error && (
            <>
              <ChatMessages
                messages={messages}
                driver={headerDriver}
                messagesEndRef={messagesEndRef}
              />

              <ChatInput
                inputText={inputText}
                setInputText={setInputText}
                handleSend={handleSend}
                handleKeyDown={handleKeyDown}
              />
            </>
          )}
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
