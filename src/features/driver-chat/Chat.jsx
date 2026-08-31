"use client";

import { FaCar } from "react-icons/fa";
import { FiPhoneCall } from "react-icons/fi";
import { HiDotsVertical } from "react-icons/hi";
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { socket } from "@/lib/socket";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import {
  getConversationsApi,
  getMessagessApi,
  sendMessageApi,
} from "@/services/client/chatService";
import { useSocket } from "@/hooks/useSocket";

// ---- small formatting helpers (API gives raw values, UI wants readable ones) ----
const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

const formatRideDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDepartureTime = (timeStr) => {
  if (!timeStr) return "";
  const [hourStr, minuteStr] = timeStr.split(":");
  const hour = parseInt(hourStr, 10);
  if (Number.isNaN(hour)) return "";
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${minuteStr} ${suffix}`;
};

const getStatusTagClass = (status) => {
  if (!status) return "chat-tag--gray";
  const normalized = status.toLowerCase();
  return ["scheduled", "confirmed", "ongoing"].includes(normalized)
    ? "chat-tag--success"
    : "chat-tag--gray";
};

// small helper: treat ids as strings when comparing, since one side
// (socket payload) and the other (REST payload) don't always agree
// on number vs string
const sameId = (a, b) =>
  a !== undefined &&
  a !== null &&
  b !== undefined &&
  b !== null &&
  String(a) === String(b);

// ---- BUGFIX: single source of truth for merging an optimistic bubble with
// the "real" message, whichever channel (socket vs REST response) resolves
// first.
//
// Why this needs to check BOTH keys at once: if the socket payload doesn't
// echo back `clientTempId` (or names it differently), the socket handler
// can't find the optimistic bubble by temp id, so it appends a fresh row
// under the real id. When the REST response comes back afterwards, it DOES
// still know the local clientTempId, finds the original optimistic bubble,
// and replaces *that* one too -- leaving two permanent rows for the same
// message instead of one. Deduping by clientTempId OR real id separately
// isn't enough; both channels have to collapse into a single slot however
// they arrived.
const reconcileMessage = (prevMessages, incoming, clientTempId) => {
  const list = Array.isArray(prevMessages) ? prevMessages : [];
  if (!incoming) return list;

  const normalized = clientTempId
    ? { ...incoming, _clientTempId: clientTempId }
    : incoming;

  const tempIndex = clientTempId
    ? list.findIndex((m) => m._clientTempId === clientTempId)
    : -1;

  const idIndex = normalized?.id
    ? list.findIndex((m) => sameId(m.id, normalized.id))
    : -1;

  // Genuinely new message -> nothing to merge with, just append.
  if (tempIndex === -1 && idIndex === -1) {
    return [...list, normalized];
  }

  // Merge into a single slot (prefer the temp slot if both exist), and
  // drop any OTHER row that refers to the same clientTempId or same real
  // id -- this is what collapses a stray duplicate back down to one.
  const targetIndex = tempIndex !== -1 ? tempIndex : idIndex;

  return list
    .map((m, i) => (i === targetIndex ? normalized : m))
    .filter((m, i) => {
      if (i === targetIndex) return true;
      const sameTemp = clientTempId && m._clientTempId === clientTempId;
      const sameReal = normalized?.id && sameId(m.id, normalized.id);
      return !(sameTemp || sameReal);
    });
};

// ---- Optional feature: quick-reply suggestions shown above the composer
// before the driver has sent their first message in a conversation, similar
// to the "ready to pickup" prompts on Ola/Rapido. Purely client-side; taps
// send the text through the normal sendMessage pipeline.
const QUICK_REPLIES = [
  "I'm on my way",
  "Ready to pickup",
  "Where are you?",
  "I've arrived at the pickup point",
  "Please be on time",
];

export default function ChatPage({ chatList }) {
  useSocket();
  const user = useSelector((state) => state.auth.user); // logged-in driver

  const [activeId, setActiveId] = useState(null);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [draft, setDraft] = useState("");
  // guard against chatList being undefined/null on first render
  const [chats, setChats] = useState(Array.isArray(chatList) ? chatList : []);

  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [conversationLoading, setConversationLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(null);

  // ---- CHANGE 1: live sidebar search (debounced client-side filter) ----
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim().toLowerCase());
    }, 150);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const messagesContainerRef = useRef(null);
  const tempIdRef = useRef(0);
  // Tracks the clientTempId of whatever message is currently being sent.
  // The socket payload doesn't reliably echo `clientTempId` back, so
  // whichever channel (socket vs REST) resolves FIRST needs another way to
  // find the right optimistic bubble immediately -- otherwise it appends a
  // stray row and only the second channel cleans it up a moment later,
  // which is the visible flicker. Since sending is disabled while a send is
  // in flight, there's only ever one pending id to track at a time.
  const pendingSendRef = useRef(null);

  // keep local chats list in sync if the parent re-fetches chatList later
  useEffect(() => {
    if (Array.isArray(chatList)) setChats(chatList);
  }, [chatList]);

  const activeChat = (chats || []).find((c) => c.id === activeId);

  useEffect(() => {
    const el = messagesContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // ---- Open a chat: load conversation + messages, join socket room ----
  const openChat = async (chat) => {
    setActiveId(chat?.id);
    setMobileChatOpen(true);
    setConversationLoading(true);
    setMessages([]);
    setConversation(null);
    setSendError(null);

    // clear unread badge for this chat locally
    setChats((prev) =>
      (prev || []).map((c) => (c.id === chat.id ? { ...c, unread: 0 } : c)),
    );

    try {
      // 1. Conversation API -> conversation + userDetails + rideDetails
      const conversationRes = await getConversationsApi(chat?.booking_id);

      // 2. Messages API -> message list
      const messagesRes = await getMessagessApi(conversationRes?.id);

      // set both together so header/ride-card and messages appear at the
      // same time instead of the header popping in first
      setConversation(conversationRes || null);
      setMessages(Array.isArray(messagesRes) ? messagesRes : []);

      // 3. Join socket room
      if (conversationRes?.id) {
        socket.emit("join_conversation", {
          conversationId: conversationRes.id,
          userId: user?.id,
        });
      }
    } catch (err) {
      console.error("Open chat error:", err);
    } finally {
      setConversationLoading(false);
    }
  };

  // ---- Rejoin room on socket reconnect ----
  useEffect(() => {
    if (!conversation?.id) return;

    const joinConversation = () => {
      socket.emit("join_conversation", {
        conversationId: conversation.id,
        userId: user?.id,
      });
    };

    if (socket.connected) joinConversation();
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
      if (!message || !sameId(message.conversation_id, conversation.id)) return;

      const isOwnMessage =
        message.sender === "driver" || sameId(message.sender_id, user?.id);

      // Prefer clientTempId if the payload actually has it; otherwise, if
      // this is our own message and we have a send in flight, fall back to
      // the id we're tracking locally. This is what lets the socket event
      // match the optimistic bubble on the very first try instead of
      // appending a stray row that only gets cleaned up once the REST
      // response comes back (the flicker).
      const effectiveTempId =
        message.clientTempId ||
        (isOwnMessage ? pendingSendRef.current : undefined);

      setMessages((prev) => reconcileMessage(prev, message, effectiveTempId));

      if (
        isOwnMessage &&
        effectiveTempId &&
        pendingSendRef.current === effectiveTempId
      ) {
        pendingSendRef.current = null;
      }

      // keep sidebar preview in sync for this conversation's chat entry
      setChats((prev) =>
        (prev || []).map((c) =>
          c.booking_id === conversation.booking_id
            ? {
                ...c,
                last_message: message.message,
                last_message_at: message.updated_at,
              }
            : c,
        ),
      );
    };

    socket.on("message_received", handleMessageReceived);
    return () => socket.off("message_received", handleMessageReceived);
  }, [conversation?.id, conversation?.booking_id]);

  const formatChatListTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();

    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

    return date.toLocaleDateString("en-GB");
  };

  function backToList() {
    setMobileChatOpen(false);
  }

  // ---- Send message: optimistic update + API + socket ----
  // `overrideText` lets quick-reply chips (CHANGE 2) send a fixed string
  // without touching whatever the driver has typed in the input box.
  const sendMessage = async (overrideText) => {
    const text = (overrideText ?? draft).trim();
    if (!text || !conversation?.id || sending) return;

    setSendError(null);
    tempIdRef.current += 1;
    const clientTempId = `temp-${Date.now()}-${tempIdRef.current}`;
    pendingSendRef.current = clientTempId;

    const optimisticMessage = {
      id: clientTempId,
      _clientTempId: clientTempId,
      conversation_id: conversation.id,
      sender_id: user?.id,
      sender: "driver",
      sender_name: user?.name,
      profile_picture: user?.profile_picture,
      message: text,
      is_read: 0,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      pending: true,
    };

    setMessages((prev) => [
      ...(Array.isArray(prev) ? prev : []),
      optimisticMessage,
    ]);
    // only clear the typed draft if this send came from the input box
    if (overrideText === undefined) setDraft("");
    setSending(true);

    try {
      const payload = {
        conversation_id: conversation.id,
        message: text,
        clientTempId,
      };

      const { data } = await sendMessageApi(payload);
      const newMessage = data?.data;

      // BUGFIX: same shared reconcile helper as the socket handler above.
      setMessages((prev) =>
        reconcileMessage(
          prev,
          newMessage || { ...optimisticMessage, pending: false },
          clientTempId,
        ),
      );

      setChats((prev) =>
        (prev || []).map((c) =>
          c.booking_id === conversation.booking_id
            ? {
                ...c,
                last_message: text,
                last_message_at: newMessage?.updated_at,
              }
            : c,
        ),
      );
    } catch (error) {
      console.error("Send Message Error:", error);
      setSendError("Message failed to send. Please try again.");
      setMessages((prev) =>
        (Array.isArray(prev) ? prev : []).filter(
          (m) => m._clientTempId !== clientTempId,
        ),
      );
      setDraft(text); // give the text back so the user doesn't lose it
    } finally {
      setSending(false);
      if (pendingSendRef.current === clientTempId) {
        pendingSendRef.current = null;
      }
    }
  };

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  }

  const vehicle = conversation?.rideDetails?.vehicle_details;
  const vehicleLabel = vehicle
    ? `${vehicle.color ? vehicle.color + " " : ""}${vehicle.brand ?? ""} ${vehicle.model ?? ""}`.trim()
    : "";

  const safeMessages = Array.isArray(messages) ? messages : [];
  const safeChats = Array.isArray(chats) ? chats : [];

  // CHANGE 1: filtered view of the sidebar list, driven by the debounced
  // search term. Matches passenger name, last message preview, or booking id.
  const filteredChats = !debouncedSearch
    ? safeChats
    : safeChats.filter((c) => {
        const haystack = `${c?.user_name ?? ""} ${c?.last_message ?? ""} ${
          c?.booking_id ?? ""
        }`.toLowerCase();
        return haystack.includes(debouncedSearch);
      });

  // CHANGE 2: only show quick-reply suggestions until the driver has sent
  // their first message in this conversation.
  const driverHasSentMessage = safeMessages.some(
    (m) => m?.sender === "driver" || sameId(m?.sender_id, user?.id),
  );

  // true only while we have nothing to show yet for the selected chat
  const showFullPanelLoading = conversationLoading && !conversation;
  console.log("user details", conversation);

  return (
    <div
      className={`chat-page ${mobileChatOpen ? "chat-page--mobile-chat" : ""}`}
    >
      {/* ---------- Sidebar: passenger list (already API-integrated) ---------- */}
      <aside className="chat-sidebar">
        <div className="chat-sidebar__header">
          <h2 className="chat-sidebar__title">
            Passenger Chats
            {/* <span className="chat-badge">{safeChats.length}</span> */}
          </h2>
        </div>

        <div className="chat-search">
          <svg
            viewBox="0 0 24 24"
            className="chat-search__icon"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search passenger..."
            className="chat-search__input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <ul className="chat-list">
          {filteredChats.length > 0 ? (
            filteredChats.map((chat, index) => (
              <li key={chat?.id ?? chat?.booking_id ?? index}>
                <button
                  type="button"
                  className={`chat-list__item ${
                    chat.id === activeId ? "chat-list__item--active" : ""
                  }`}
                  onClick={() => openChat(chat)}
                >
                  <span className="chat-avatar">
                    {chat?.profile_picture ? (
                      <img src={chat.profile_picture} alt={chat?.user_name} />
                    ) : (
                      <div className="profile-placeholder-list">
                        {chat?.user_name
                          ?.split(" ")[0]
                          ?.charAt(0)
                          ?.toUpperCase()}
                      </div>
                    )}
                  </span>

                  <span className="chat-list__body">
                    <span className="chat-list__row">
                      <span className="chat-list__name">{chat?.user_name}</span>

                      <span className="chat-list__time">
                        {formatChatListTime(chat?.last_message_at)}
                      </span>
                    </span>

                    <span className="chat-list__preview">
                      {chat?.last_message}
                    </span>
                  </span>

                  {chat?.unread > 0 && (
                    <span className="chat-unread">{chat?.unread}</span>
                  )}
                </button>
              </li>
            ))
          ) : safeChats.length > 0 ? (
            // there ARE chats, just none match the search term
            <li className="chat-empty-state">
              <div className="chat-empty-icon">🔍</div>
              <h3>No matches found</h3>
              <p>Try a different name or keyword.</p>
            </li>
          ) : (
            <li className="chat-empty-state">
              <div className="chat-empty-icon">
                {/* use your existing chat/inbox icon here */}
                💬
              </div>

              <h3>No passenger chats yet</h3>

              <p>
                When a passenger books a ride or starts a conversation, their
                chat will appear here.
              </p>
            </li>
          )}
        </ul>
      </aside>

      {/* ---------- Main chat window ---------- */}
      <section className="chat-window">
        {!activeChat && (
          <div className="chat-empty">
            Select a passenger to start chatting.
          </div>
        )}

        {activeChat && showFullPanelLoading && (
          <div className="chat-window__full-loading">
            <div className="chat-spinner" aria-hidden="true" />
            <p>Loading conversation...</p>
          </div>
        )}

        {activeChat && !showFullPanelLoading && (
          <>
            <header className="chat-window__header">
              <button
                type="button"
                className="chat-back-btn"
                onClick={backToList}
                aria-label="Back to chat list"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              <span className="chat-avatar chat-avatar--header">
                {conversation?.userDetails?.profile_picture ? (
                  <img
                    src={conversation.userDetails.profile_picture}
                    alt={conversation?.userDetails?.name}
                  />
                ) : (
                  <div className="profile-placeholder">
                    {conversation?.userDetails?.name
                      ?.split(" ")[0]
                      ?.charAt(0)
                      ?.toUpperCase()}
                  </div>
                )}
              </span>

              <span className="chat-window__title">
                <span className="chat-window__name">
                  {conversation?.userDetails?.name}
                </span>
                {/* online/offline presence isn't returned by the conversation API */}
                {/* <span className={`chat-window__presence ${activeChat.online ? "chat-window__presence--online" : ""}`}>
                  <span className="chat-window__presence-dot" />
                  {activeChat.online ? "Online" : "Offline"}
                </span> */}
              </span>

              <div className="chat-window__actions">
                <button type="button" className="chat-btn chat-btn--outline">
                  View Booking
                </button>
                {conversation?.userDetails?.phone ? (
                  <a
                    href={`tel:${conversation.userDetails.phone}`}
                    className="chat-icon-btn"
                    aria-label="Call passenger"
                  >
                    <FiPhoneCall />
                  </a>
                ) : (
                  <button
                    type="button"
                    className="chat-icon-btn"
                    aria-label="Call passenger"
                    disabled
                  >
                    <FiPhoneCall />
                  </button>
                )}
                <button
                  type="button"
                  className="chat-icon-btn"
                  aria-label="More options"
                >
                  <HiDotsVertical />
                </button>
              </div>
            </header>

            <div className="ride-card">
              <div className="ride-card__icon">
                <div className="icon">
                  <FaCar />
                </div>
              </div>

              <div className="ride-card__details">
                <p className="ride-card__route">
                  {" "}
                  <strong>
                    {conversation?.rideDetails?.source_address} →{" "}
                    {conversation?.rideDetails?.destination_address}
                  </strong>
                </p>
                <p className="ride-card__meta">
                  {formatRideDate(conversation?.rideDetails?.ride_date)} •{" "}
                  {formatDepartureTime(
                    conversation?.rideDetails?.departure_time,
                  )}
                  <br className="ride-card__break" />
                  <span className="ride-card__vehicle">• {vehicleLabel}</span>
                </p>
              </div>

              <div className="ride-card__status">
                <span
                  className={`chat-tag ${getStatusTagClass(
                    conversation?.rideDetails?.status,
                  )}`}
                >
                  {capitalize(conversation?.rideDetails?.status)}
                </span>
                <span className="ride-card__booking-id">
                  #{conversation?.booking_id}
                </span>
              </div>
            </div>

            <div className="chat-messages" ref={messagesContainerRef}>
              {safeMessages.length === 0 && (
                <p className="chat-list__preview-load">No messages yet.</p>
              )}

              {safeMessages.map((msg, index) => {
                const isMe =
                  msg?.sender === "driver" || sameId(msg?.sender_id, user?.id);

                return (
                  <div
                    key={msg?.id ?? msg?._clientTempId ?? index}
                    className={`chat-bubble-row ${
                      isMe ? "chat-bubble-row--me" : ""
                    }`}
                  >
                    {/* {!isMe && (
                      <span className="chat-avatar chat-avatar--small">
                        <img
                          src={
                            msg?.profile_picture ||
                            conversation?.userDetails?.profile_picture
                          }
                          alt={msg?.sender_name}
                        />
                      </span>
                    )} */}
                    <div
                      className={`chat-bubble ${
                        isMe ? "chat-bubble--me" : "chat-bubble--them"
                      } ${msg?.pending ? "chat-bubble--pending" : ""}`}
                    >
                      <p className="chat-bubble__text">{msg?.message}</p>
                      <span className="chat-bubble__time">
                        {msg?.time}
                        {isMe && <IoCheckmarkDoneSharp />}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {sendError && <p className="chat-error">{sendError}</p>}

            {/* ---- CHANGE 2: quick-reply suggestions (optional, dismissed
                 automatically once the driver has sent their first message) ---- */}
            {!driverHasSentMessage && (
              <div className="chat-suggestions">
                {QUICK_REPLIES.map((reply) => (
                  <button
                    key={reply}
                    type="button"
                    className="chat-suggestion-chip"
                    onClick={() => sendMessage(reply)}
                    disabled={sending}
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}

            <div className="chat-composer">
              {/* emoji picker not wired up yet
              <button type="button" className="chat-icon-btn chat-icon-btn--ghost" aria-label="Emoji">
                <FaRegSmile size={20} />
              </button> */}
              <input
                type="text"
                className="chat-composer__input"
                placeholder="Type a message..."
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={sending}
              />
              <button
                type="button"
                className="chat-send-btn"
                onClick={() => sendMessage()}
                aria-label="Send message"
                disabled={sending}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22 2L11 13" />
                  <path d="M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
