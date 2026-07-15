import MessageBubble from "./MessageBubble";

const ChatMessages = ({
  messages,
  driver,
  messagesEndRef,
}) => {
  return (
    <div className="cp-messages">
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          msg={msg}
          driver={driver}
        />
      ))}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;