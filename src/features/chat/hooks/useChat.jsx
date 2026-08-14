import { useEffect, useState } from "react";
import {
  getConversationsApi,
  getMessagessApi,
  sendMessageApi,
} from "@/services/client/chatService";
import { socket } from "@/lib/socket";
import { useSelector } from "react-redux";

export const useChat = (bookingId) => {
  const user = useSelector((state) => state.auth.user);

  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ---- Load conversation + history ----
  useEffect(() => {
    // guards against setState firing after unmount, or after a stale
    // request resolves once bookingId changes (e.g. user switches rides)
    let ignore = false;

    const loadChat = async () => {
      setLoading(true);
      setError(null);
      setConversation(null);
      setMessages([]);

      try {
        // prefer the bookingId passed in explicitly (e.g. from MyRides ->
        // RideCard -> ChatPanel). Fall back to sessionStorage only for
        // pages that don't pass it (e.g. the dedicated track-chat page).
        let resolvedBookingId = bookingId;

        if (!resolvedBookingId) {
          const bookingData = JSON.parse(
            sessionStorage.getItem("bookingData") || "null",
          );
          resolvedBookingId = bookingData?.booking?.booking_id;
        }

        if (!resolvedBookingId) {
          if (!ignore) {
            setError("No booking found for this chat.");
            setLoading(false);
          }
          return;
        }

        const conversationRes = await getConversationsApi(resolvedBookingId);
        if (ignore) return;
        setConversation(conversationRes);

        const messagesRes = await getMessagessApi(conversationRes?.id);
        if (ignore) return;
        setMessages(Array.isArray(messagesRes) ? messagesRes : []);
      } catch (err) {
        console.error(err);
        if (!ignore) {
          setError("Could not load this conversation. Please try again.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadChat();

    return () => {
      ignore = true;
    };
  }, [bookingId]);

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
  }, [conversation?.id, user?.id]);

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
    error,
    messages,
    inputText,
    setInputText,
    handleSend,
    handleKeyDown,
  };
};
