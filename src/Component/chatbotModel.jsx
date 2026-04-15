import { useEffect, useRef, useState } from "react";
import { BsChatDots, BsX, BsSend } from "react-icons/bs";
import ReactMarkdown from "react-markdown";
import { chatBotApi } from "../Networking/User/APIs/DealTracker/dealTrackerApi";
import { useDispatch } from "react-redux";
import { askBuildingStack } from "../Networking/Admin/APIs/buildingStackApi";

export const ChatBotModal = ({ category, buildingId }) => {


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
      let res;

      if (buildingId) {
        res = await dispatch(
          askBuildingStack({
            buildingId,
            question: userText,
          }),
        ).unwrap();
      } else {
        res = await dispatch(
          chatBotApi({
            category,
            question: userText,
          }),
        ).unwrap();
      }

      setMessages((prev) => [
        ...prev,
        {
          text: res?.answer || "No response from server",
          sender: "bot",
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          text: "Something went wrong. Please try again.",
          sender: "bot",
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="chatbot-button shadow">
        <BsChatDots size={22} className="activity-log" />
      </button>

      {open && (
        <div
          className={`chatbot-container shadow-lg ${open ? "chat-open" : "chat-closed"}`}
        >
          <div className="chatbot-header ps-md-2 ps-5">
            <span>Portfolio Pulse Assistant</span>
            <button
              className="chatbot-close-btn"
              onClick={() => setOpen(false)}
            >
              <BsX size={24} className="activity-log" />
            </button>
          </div>

          <div className="chatbot-body">
            {messages.length === 0 && (
              <div className="text-center activity-log mt-5" style={{ opacity: 0.6 }}>
                Ask me here...
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`d-flex mb-2 ${msg.sender === "user"
                  ? "justify-content-end"
                  : "justify-content-start"
                  }`}
              >
                <div
                  className={`chatbot-chat-bubble ${msg.sender === "user"
                    ? "chatbot-user-bubble"
                    : "chatbot-bot-bubble"
                    }`}
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
                <div className="chatbot-chat-bubble bot-bubble">Typing...</div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          <div className="chatbot-footer">
            <input
              className="chatbot-chat-input"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button className="chatbot-send-btn" onClick={handleSend}>
              <BsSend />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
