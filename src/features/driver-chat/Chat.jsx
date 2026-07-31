"use client";

import { FaCar } from "react-icons/fa";
import { FaRegSmile } from "react-icons/fa";
import { FiPhoneCall } from "react-icons/fi";
import { HiDotsVertical } from "react-icons/hi";
import { useState, useRef, useEffect } from "react";

const CHATS = [
  {
    id: 1,
    name: "Rahul Sharma",
    avatar: "https://i.pravatar.cc/150?img=12",
    online: true,
    pickup: "KIIT Square, BBSR",
    seats: "1 Seat",
    lastMessage: "Near the SBI ATM.",
    time: "10:42 AM",
    unread: 2,
    ride: {
      from: "Bhubaneswar",
      to: "Puri",
      date: "30 Jul 2026",
      time: "6:30 AM",
      vehicle: "White Maruti Swift Dzire",
      bookingId: "#BKG12345",
      status: "Confirmed",
    },
    messages: [
      {
        id: 1,
        from: "them",
        text: "Hello! I will reach the pickup point 10 minutes early. Please be ready.",
        time: "10:45 AM",
      },
      {
        id: 2,
        from: "me",
        text: "Thank you! I will be there on time.",
        time: "10:47 AM",
      },
      {
        id: 3,
        from: "them",
        text: "Great. My car is White Maruti Swift Dzire. See you soon!",
        time: "10:48 AM",
      },
    ],
  },
  {
    id: 2,
    name: "Priya Mishra",
    avatar: "https://i.pravatar.cc/150?img=32",
    online: true,
    pickup: "Patia Square, BBSR",
    seats: "2 Seats",
    lastMessage: "Okay, I will be there.",
    time: "10:30 AM",
    unread: 0,
    ride: {
      from: "Bhubaneswar",
      to: "Cuttack",
      date: "30 Jul 2026",
      time: "8:00 AM",
      vehicle: "Grey Hyundai i20",
      bookingId: "#BKG12346",
      status: "Confirmed",
    },
    messages: [
      { id: 1, from: "them", text: "Okay, I will be there.", time: "10:30 AM" },
    ],
  },
  {
    id: 3,
    name: "Aman Verma",
    avatar: "https://i.pravatar.cc/150?img=51",
    online: false,
    pickup: "Jayadev Vihar, BBSR",
    seats: "1 Seat",
    lastMessage: "Please call me when you reach.",
    time: "Yesterday",
    unread: 0,
    ride: {
      from: "Bhubaneswar",
      to: "Puri",
      date: "29 Jul 2026",
      time: "7:00 AM",
      vehicle: "White Maruti Swift Dzire",
      bookingId: "#BKG12300",
      status: "Completed",
    },
    messages: [
      {
        id: 1,
        from: "them",
        text: "Please call me when you reach.",
        time: "Yesterday",
      },
    ],
  },
];

export default function ChatPage() {
  const [activeId, setActiveId] = useState(CHATS[0].id);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [chats, setChats] = useState(CHATS);

  const messagesContainerRef = useRef(null);
  const activeChat = chats.find((c) => c.id === activeId);
  useEffect(() => {
    const el = messagesContainerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [activeChat?.messages]);
  function openChat(id) {
    setActiveId(id);
    setMobileChatOpen(true);
    setChats((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)),
    );
  }

  function backToList() {
    setMobileChatOpen(false);
  }

  function sendMessage() {
    const text = draft.trim();
    if (!text) return;
    setChats((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? {
              ...c,
              lastMessage: text,
              messages: [
                ...c.messages,
                {
                  id: c.messages.length + 1,
                  from: "me",
                  text,
                  time: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                },
              ],
            }
          : c,
      ),
    );
    setDraft("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div
      className={`chat-page ${mobileChatOpen ? "chat-page--mobile-chat" : ""}`}
    >
      {/* ---------- Sidebar: passenger list ---------- */}
      <aside className="chat-sidebar">
        <div className="chat-sidebar__header">
          <h2 className="chat-sidebar__title">
            Passenger Chats
            <span className="chat-badge">{chats.length}</span>
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
          />
        </div>

        <ul className="chat-list">
          {chats.map((chat) => (
            <li key={chat.id}>
              <button
                type="button"
                className={`chat-list__item ${
                  chat.id === activeId ? "chat-list__item--active" : ""
                }`}
                onClick={() => openChat(chat.id)}
              >
                <span className="chat-avatar">
                  <img src={chat.avatar} alt={chat.name} />
                  <span
                    className={`chat-status-dot ${
                      chat.online ? "chat-status-dot--online" : ""
                    }`}
                  />
                </span>

                <span className="chat-list__body">
                  <span className="chat-list__row">
                    <span className="chat-list__name">{chat.name}</span>
                    <span className="chat-list__time">{chat.time}</span>
                  </span>
                  <span className="chat-list__meta">
                    <span className="chat-list__dot" />
                    Pickup: {chat.pickup}
                  </span>
                  <span className="chat-list__seats">{chat.seats}</span>
                  <span className="chat-list__preview">{chat.lastMessage}</span>
                </span>

                {chat.unread > 0 && (
                  <span className="chat-unread">{chat.unread}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* ---------- Main chat window ---------- */}
      <section className="chat-window">
        {activeChat ? (
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
                <img src={activeChat.avatar} alt={activeChat.name} />
              </span>

              <span className="chat-window__title">
                <span className="chat-window__name">{activeChat.name}</span>
                <span
                  className={`chat-window__presence ${
                    activeChat.online ? "chat-window__presence--online" : ""
                  }`}
                >
                  <span className="chat-window__presence-dot" />
                  {activeChat.online ? "Online" : "Offline"}
                </span>
              </span>

              <div className="chat-window__actions">
                <button type="button" className="chat-btn chat-btn--outline">
                  View Booking
                </button>
                <button
                  type="button"
                  className="chat-icon-btn"
                  aria-label="Call passenger"
                >
                  <FiPhoneCall />
                </button>
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
                  Ride:{" "}
                  <strong>
                    {activeChat.ride.from} → {activeChat.ride.to}
                  </strong>
                </p>
                <p className="ride-card__meta">
                  {activeChat.ride.date} • {activeChat.ride.time}
                  <br className="ride-card__break" />
                  <span className="ride-card__vehicle">
                    {" "}
                    Vehicle: {activeChat.ride.vehicle}
                  </span>
                </p>
              </div>

              <div className="ride-card__status">
                <span
                  className={`chat-tag ${
                    activeChat.ride.status === "Confirmed"
                      ? "chat-tag--success"
                      : "chat-tag--gray"
                  }`}
                >
                  {activeChat.ride.status}
                </span>
                <span className="ride-card__booking-id">
                  {activeChat.ride.bookingId}
                </span>
              </div>
            </div>

            <div className="chat-messages" ref={messagesContainerRef}>
              {activeChat.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`chat-bubble-row ${
                    msg.from === "me" ? "chat-bubble-row--me" : ""
                  }`}
                >
                  {msg.from === "them" && (
                    <span className="chat-avatar chat-avatar--small">
                      <img src={activeChat.avatar} alt={activeChat.name} />
                    </span>
                  )}
                  <div
                    className={`chat-bubble ${
                      msg.from === "me"
                        ? "chat-bubble--me"
                        : "chat-bubble--them"
                    }`}
                  >
                    <p className="chat-bubble__text">{msg.text}</p>
                    <span className="chat-bubble__time">
                      {msg.time}
                      {msg.from === "me" && (
                        <svg
                          viewBox="0 0 24 24"
                          className="chat-bubble__tick"
                          aria-hidden="true"
                        >
                          <path d="M2 12l5 5L20 5" />
                        </svg>
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="chat-composer">
              {/* <button
                type="button"
                className="chat-icon-btn chat-icon-btn--ghost"
                aria-label="Emoji"
              >
                <FaRegSmile size={20} />
              </button> */}
              <input
                type="text"
                className="chat-composer__input"
                placeholder="Type a message..."
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                type="button"
                className="chat-send-btn"
                onClick={sendMessage}
                aria-label="Send message"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22 2L11 13" />
                  <path d="M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </button>
            </div>
          </>
        ) : (
          <div className="chat-empty">
            Select a passenger to start chatting.
          </div>
        )}
      </section>
    </div>
  );
}
