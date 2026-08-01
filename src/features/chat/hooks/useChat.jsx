import { useEffect, useState, useRef } from "react";
import {
  getConversationsApi,
  getMessagessApi,
  sendMessageApi,
} from "@/services/client/chatService";
import { socket } from "@/lib/socket";
import { useSelector } from "react-redux";
export const useChat = () => {
  const user = useSelector((state) => state.auth.user);

  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);

  // ---- Load conversation + history ----
  useEffect(() => {
    const loadChat = async () => {
      try {
        const bookingData = JSON.parse(sessionStorage.getItem("bookingData"));
        const bookingId = bookingData?.booking?.booking_id;

        if (!bookingId) return;

        const conversation = await getConversationsApi(bookingId);
        setConversation(conversation);

        const messages = await getMessagessApi(conversation.id);
        setMessages(messages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadChat();
  }, []);

  // ---- Debug: log every socket event (remove once confirmed working) ----
  useEffect(() => {
    const logAny = (event, ...args) =>
      console.log("📡 [chat] socket event:", event, args);
    socket.onAny(logAny);
    return () => socket.offAny(logAny);
  }, []);

  // ---- Join / leave conversation room, rejoin on reconnect ----
  useEffect(() => {
    if (!conversation?.id) return;

    const joinConversation = () => {
      socket.emit("join_conversation", {
        conversationId: conversation.id,
        userId: user?.id,
      });
      console.log("Joined conversation:", conversation.id);
    };

    if (socket.connected) {
      joinConversation();
    }

    socket.on("connect", joinConversation);

    return () => {
      socket.emit("leave_conversation", conversation.id);
      socket.off("connect", joinConversation);
    };
  }, [conversation?.id]);

  // ---- Listen for incoming messages ----
  useEffect(() => {
    if (!conversation?.id) return;

    const handleMessageReceived = (message) => {
      console.log("📩 New Message:", message);

      if (message.conversation_id !== conversation.id) return;

      setMessages((prev) => {
        // avoid duplicates if server also echoes back to sender
        if (prev.some((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });
    };

    socket.on("message_received", handleMessageReceived);

    return () => {
      socket.off("message_received", handleMessageReceived);
    };
  }, [conversation?.id]);

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || !conversation?.id) return;

    try {
      const payload = {
        conversation_id: conversation.id,
        message: text,
      };

      const { data } = await sendMessageApi(payload);
      const newMessage = data.data;

      setMessages((prev) => {
        if (prev.some((m) => m.id === newMessage.id)) return prev;
        return [...prev, newMessage];
      });

      setInputText("");
    } catch (error) {
      console.error("Send Message Error:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return {
    conversation,
    loading,
    messages,
    inputText,
    setInputText,
    handleSend,
    handleKeyDown,
  };
};
