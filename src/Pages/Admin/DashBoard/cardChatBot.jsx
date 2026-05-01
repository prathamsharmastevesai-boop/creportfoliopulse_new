import { useEffect, useRef, useState } from "react";
import { BsChatDots, BsX, BsSend } from "react-icons/bs";
import ReactMarkdown from "react-markdown";
import { chatBotApi } from "../../../Networking/User/APIs/DealTracker/dealTrackerApi";
import { useDispatch } from "react-redux";

export const CardChatBot = ({ category, label, icon }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const chatEndRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userText = input.trim();
    setMessages((prev) => [...prev, { text: userText, sender: "user" }]);
    setInput("");
    setTyping(true);
    try {
      const res = await dispatch(
        chatBotApi({ category, question: userText }),
      ).unwrap();
      setMessages((prev) => [
        ...prev,
        { text: res?.answer || "No response from server", sender: "bot" },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { text: "Something went wrong. Please try again.", sender: "bot" },
      ]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div style={{ position: "absolute", bottom: 12, right: 12, zIndex: 999 }}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="card-chatbot-button shadow"
        title={label}
      >
        {icon ? icon : <BsChatDots size={18} />}
      </button>

      <div
        className={`card-chatbot-container shadow-lg ${open ? "chat-open" : ""}`}
      >
        <div className="card-chatbot-header">
          <span>{label}</span>
          <button
            className="card-chatbot-close-btn"
            onClick={() => setOpen(false)}
          >
            <BsX size={24} />
          </button>
        </div>

        <div className="card-chatbot-body">
          {messages.length === 0 && (
            <div className="card-chatbot-empty">Ask me here...</div>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`d-flex mb-2 ${msg.sender === "user" ? "justify-content-end" : "justify-content-start"}`}
            >
              <div
                className={`card-chatbot-bubble ${msg.sender === "user" ? "user" : "bot"}`}
              >
                {msg.sender === "user" ? (
                  msg.text
                ) : (
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                )}
              </div>
            </div>
          ))}
          {typing && (
            <div className="d-flex justify-content-start mb-2">
              <div className="card-chatbot-typing">Typing...</div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="card-chatbot-footer">
          <input
            className="card-chatbot-input"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button className="card-chatbot-send-btn" onClick={handleSend}>
            <BsSend />
          </button>
        </div>
      </div>
    </div>
  );
};
