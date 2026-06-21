import { useState } from "react";
import { INITIAL_MESSAGES } from "../constants/chatConstants";

const getNow = () =>
  new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

export const useChat = () => {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");

  const handleSend = () => {
    const text = inputText.trim();

    if (!text) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "passenger",
        text,
        time: getNow(),
      },
    ]);

    setInputText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return {
    messages,
    inputText,
    setInputText,
    handleSend,
    handleKeyDown,
  };
};