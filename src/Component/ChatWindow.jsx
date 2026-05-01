import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import ReactMarkdown from "react-markdown";
import {
  AskQuestionBuildingAPI,
  AskQuestionReportAPI,
} from "../Networking/Admin/APIs/GeneralinfoApi";
import {
  get_Chat_History,
  get_Session_List_Specific,
} from "../Networking/User/APIs/Chat/ChatApi";
import TypingIndicator from "./TypingIndicator";
import { AskQuestionAPI } from "../Networking/Admin/APIs/UploadDocApi";
import { BackButton } from "./backButton";
import { AskQuestionDCTAPI } from "../Networking/Admin/APIs/distilledCompTrackerApi";
import "./chatWindow.css";

export const ChatWindow = ({
  category: propCategory,
  heading,
  fileId,
  building_id,
  address,
}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const chatRef = useRef(null);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  const [category] = useState(location.state?.type || propCategory);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [isReplyLoading, setIsReplyLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewPdf, setPreviewPdf] = useState(null);

  const isLoading = isLoadingSession || isLoadingHistory;

  const getContentType = (text) => {
    if (!text || typeof text !== "string") return "text";
    const t = text.trim();
    if (
      t.startsWith("http://") ||
      t.startsWith("https://") ||
      t.startsWith("www.")
    ) {
      try {
        const url = new URL(t.startsWith("www.") ? "https://" + t : t);
        const p = url.pathname.toLowerCase();
        if (p.match(/\.(jpg|jpeg|png|webp|gif|bmp)$/)) return "image";
        if (p.endsWith(".pdf")) return "pdf";
        return "link";
      } catch {
        return "text";
      }
    }
    return "text";
  };

  const isSpecialCategory =
    category === "floor_plan" ||
    category === "building_stack" ||
    category === "LOI";

  useEffect(() => {
    if (isSpecialCategory || category === "DCT") {
      setSessionId(isSpecialCategory ? "building-chat" : "dct-chat");
      setIsLoadingSession(false);
      return;
    }
    if (location.state?.sessionId) {
      setSessionId(location.state.sessionId);
      setIsLoadingSession(false);
      return;
    }
    const fetchLastSession = async () => {
      setIsLoadingSession(true);
      try {
        const res = await dispatch(
          get_Session_List_Specific({ category, buildingId: building_id }),
        ).unwrap();
        const filtered = res.filter((s) => s.category === category);
        if (filtered.length > 0) {
          const latest = filtered.reduce((a, b) =>
            new Date(b.created_at) > new Date(a.created_at) ? b : a,
          );
          setSessionId(latest.session_id);
        } else {
          setSessionId(uuidv4());
          setMessages([]);
        }
      } finally {
        setIsLoadingSession(false);
      }
    };
    fetchLastSession();
  }, [category, dispatch]);

  useEffect(() => {
    if (isSpecialCategory || category === "DCT" || !sessionId) {
      setMessages([]);
      setIsLoadingHistory(false);
      return;
    }
    const fetchHistory = async () => {
      setIsLoadingHistory(true);
      try {
        const res = await dispatch(
          get_Chat_History({ session_id: sessionId, building_id }),
        ).unwrap();
        if (Array.isArray(res) && res.length > 0) {
          setMessages(
            res.flatMap((item) => [
              { sender: "User", message: item.question },
              { sender: "Admin", message: item.answer },
            ]),
          );
        } else {
          setMessages([]);
        }
      } finally {
        setIsLoadingHistory(false);
      }
    };
    fetchHistory();
  }, [sessionId, category, dispatch]);

  const scrollToBottom = () => {
    if (chatRef.current)
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
  };
  useEffect(() => scrollToBottom(), [messages]);

  const startRecording = async () => {
    if (
      !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      toast.error("Speech Recognition not supported.");
      return;
    }
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!recognitionRef.current) {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SR();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = "en-US";
        recognitionRef.current.onresult = (e) =>
          setMessage(e.results[0][0].transcript);
        recognitionRef.current.onerror = () => {
          toast.error("Voice not recognized. Try again.");
          setIsRecording(false);
        };
        recognitionRef.current.onend = () => setIsRecording(false);
      }
      if (!isRecording) {
        recognitionRef.current.start();
        setIsRecording(true);
      } else {
        recognitionRef.current.stop();
        setIsRecording(false);
      }
    } catch {
      toast.error("Microphone not found or access denied.");
    }
  };

  const toggleSpeak = (index, text) => {
    if (speakingIndex === index) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
    } else {
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(text);
      utt.lang = "en-US";
      utt.onend = () => setSpeakingIndex(null);
      setSpeakingIndex(index);
      window.speechSynthesis.speak(utt);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return toast.warning("Please enter a message.");
    const userMessage = { message, sender: "User", timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    scrollToBottom();
    try {
      setIsSending(true);
      setIsReplyLoading(true);
      let response;
      if (isSpecialCategory) {
        response = await dispatch(
          AskQuestionBuildingAPI({
            question: userMessage.message,
            building_id,
            category,
          }),
        ).unwrap();
      } else if (category === "report_generation") {
        response = await dispatch(
          AskQuestionReportAPI({
            session_id: sessionId,
            question: userMessage.message,
            category,
            file_id: fileId,
          }),
        ).unwrap();
      } else if (category === "DCT") {
        response = await dispatch(
          AskQuestionDCTAPI({ question: userMessage.message }),
        ).unwrap();
      } else {
        response = await dispatch(
          AskQuestionAPI({
            session_id: sessionId,
            question: userMessage.message,
            category,
            file_id: fileId,
            building_id,
          }),
        ).unwrap();
      }
      if (response?.answer) {
        setMessages((prev) => [
          ...prev,
          {
            message: response.answer,
            sender: "Admin",
            timestamp: new Date(),
            type: getContentType(response.answer),
          },
        ]);
      } else {
        toast.warning("No response from assistant.");
      }
      scrollToBottom();
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setIsSending(false);
      setIsReplyLoading(false);
    }
  };

  const handleNewSession = () => {
    setSessionId(uuidv4());
    setMessages([]);
    toast.info(`Started a new chat session for "${category}".`);
  };

  const handleNavigation = () => {
    if (category === "floor_plan") {
      navigate("/user-files-media", { state: { buildingId: building_id } });
    } else if (category === "LOI") {
      navigate("/documents/LOI", { state: { buildingId: building_id } });
    } else {
      navigate("/documents-lease", { state: { buildingId: building_id } });
    }
  };

  const fullTitle = [heading, address].filter(Boolean).join(" – ");

  return (
    <>
      <div className="cw-root">
        <div className="cw-header">
          <div className="cw-header__back">
            <BackButton />
          </div>

          <div className="cw-header__title" title={fullTitle}>
            {fullTitle}
          </div>

          <div className="cw-header__actions">
            {!isSpecialCategory && category !== "DCT" && (
              <button
                className="cw-btn"
                onClick={handleNewSession}
                disabled={isLoadingSession}
                title="New Session"
              >
                <i className="bi bi-plus-circle" />
                <span className="cw-btn__label">New Session</span>
              </button>
            )}
            {(category === "LOI" || category === "Lease") && (
              <button
                className="cw-btn"
                onClick={handleNavigation}
                title={
                  category === "LOI"
                    ? "Upload / View LOI"
                    : "Upload / View Lease"
                }
              >
                <i className="bi bi-upload" />
                <span className="cw-btn__label">
                  {category === "LOI"
                    ? "Upload / View LOI"
                    : "Upload / View Lease"}
                </span>
              </button>
            )}
          </div>
        </div>

        <div className="cw-body">
          {isLoading ? (
            <div className="cw-empty">
              <div
                className="spinner-border text-secondary me-2"
                style={{ width: 20, height: 20, borderWidth: 2 }}
              />
              <span>
                {isLoadingSession
                  ? "Loading chat session…"
                  : "Loading chat history…"}
              </span>
            </div>
          ) : (
            <div
              ref={chatRef}
              style={{ height: "100%", overflowY: "auto" }}
              className="hide-scrollbar"
            >
              {messages.length > 0 ? (
                <>
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`cw-bubble-wrap cw-bubble-wrap--${msg.sender === "Admin" ? "admin" : "user"}`}
                    >
                      <div
                        className={`cw-bubble cw-bubble--${msg.sender === "Admin" ? "admin" : "user"}`}
                      >
                        {msg.sender === "Admin" ? (
                          <>
                            {(!msg.type || msg.type === "text") && (
                              <div className="py-1">
                                <ReactMarkdown>{msg.message}</ReactMarkdown>
                              </div>
                            )}
                            {msg.type === "image" && (
                              <img
                                src={msg.message}
                                alt="response"
                                className="img-fluid rounded border"
                                style={{ cursor: "pointer", maxHeight: 280 }}
                                onClick={() => setPreviewImage(msg.message)}
                              />
                            )}
                            {msg.type === "pdf" && (
                              <div
                                style={{ cursor: "pointer" }}
                                onClick={() => setPreviewPdf(msg.message)}
                              >
                                <iframe
                                  src={msg.message}
                                  title="PDF Preview"
                                  style={{
                                    height: "auto",
                                    maxWidth: 380,
                                    width: "100%",
                                    borderRadius: 6,
                                  }}
                                />
                                <div
                                  className="text-center text-primary fw-semibold mt-1"
                                  style={{ fontSize: 12 }}
                                >
                                  Click to view full PDF
                                </div>
                              </div>
                            )}
                            {msg.type === "link" && (
                              <a
                                href={msg.message}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary fw-semibold"
                              >
                                Open File
                              </a>
                            )}
                            <button
                              className={`cw-speak-btn ${speakingIndex === i ? "cw-speak-btn--active" : ""}`}
                              onClick={() => toggleSpeak(i, msg.message)}
                              title={
                                speakingIndex === i ? "Stop" : "Read aloud"
                              }
                            >
                              <i
                                className={`bi ${speakingIndex === i ? "bi-volume-up-fill" : "bi-volume-mute"}`}
                              />
                            </button>
                          </>
                        ) : (
                          msg.message
                        )}
                      </div>
                    </div>
                  ))}
                  {isReplyLoading && <TypingIndicator />}
                </>
              ) : (
                <div className="cw-empty">
                  No messages yet.
                  {!sessionId && " Click 'New Session' to start."}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="cw-input-bar">
          <textarea
            ref={textareaRef}
            rows={1}
            className="cw-textarea"
            placeholder="Ask Now, Let's Work…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={!sessionId || isSending || isLoading}
          />

          {message.length > 0 ? (
            <button
              className="cw-icon-btn cw-icon-btn--send"
              onClick={handleSendMessage}
              disabled={isSending || isLoading || !sessionId}
              title="Send"
            >
              {isSending ? (
                <span
                  className="spinner-border spinner-border-sm"
                  style={{ width: 14, height: 14, borderWidth: 2 }}
                />
              ) : (
                <i className="bi bi-send-fill" />
              )}
            </button>
          ) : (
            <button
              className={`cw-icon-btn ${isRecording ? "cw-icon-btn--mic-on" : "cw-icon-btn--mic"}`}
              onClick={startRecording}
              disabled={isSending || isLoading || !sessionId}
              title={isRecording ? "Stop recording" : "Voice input"}
            >
              <i
                className={`bi ${isRecording ? "bi-mic-mute-fill" : "bi-mic-fill"}`}
              />
            </button>
          )}
        </div>
      </div>

      {previewImage && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.75)", zIndex: 1060 }}
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content border-0 bg-transparent">
              <div className="modal-header border-0">
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setPreviewImage(null)}
                />
              </div>
              <div className="modal-body text-center p-0">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="img-fluid rounded"
                  style={{ maxHeight: "80vh" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {previewPdf && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.82)", zIndex: 1060 }}
          onClick={() => setPreviewPdf(null)}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content border-0 bg-transparent">
              <div className="modal-header border-0 pb-0">
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setPreviewPdf(null)}
                />
              </div>
              <div className="modal-body p-0">
                <iframe
                  src={previewPdf}
                  title="PDF Full View"
                  className="w-100 rounded"
                  style={{ height: "88vh", border: "none" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
