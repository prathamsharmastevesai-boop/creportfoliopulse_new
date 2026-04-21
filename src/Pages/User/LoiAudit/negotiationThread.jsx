import {
  AlertTriangle,
  BarChart3,
  DollarSign,
  Download,
  MessageSquare,
  Send,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { SectionLabel } from "./loiAudit";
import {
  downloadDocV2Api,
  fetchThreadApi,
  sendMessageApi,
} from "../../../Networking/User/APIs/LoiAudit/loiAuditApi";

export const NegotiationThread = ({ dealId, currentVersion }) => {
  const dispatch = useDispatch();
  const [reply, setReply] = useState("");
  const [messages, setMessages] = useState([]);
  const [terms, setTerms] = useState([]);
  const [loadingThread, setLoadingThread] = useState(true);
  const [sending, setSending] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [docInfo, setDocInfo] = useState({
    available: false,
    url: null,
    filename: null,
    message: null,
  });

  const [loadingDoc, setLoadingDoc] = useState(true);
  const msgBoxRef = useRef(null);

  const fetchThread = async () => {
    try {
      setLoadingThread(true);
      const data = await dispatch(fetchThreadApi(dealId)).unwrap();
      setMessages(data.messages ?? data ?? []);
      setTerms(data.latest_counter ?? {});
    } catch (err) {
      console.error("Failed to fetch thread:", err);
    } finally {
      setLoadingThread(false);
    }
  };

  const fetchDocAvailability = async () => {
    try {
      setLoadingDoc(true);

      const blob = await dispatch(
        downloadDocV2Api({ dealId, currentVersion }),
      ).unwrap();

      let data = blob;

      if (blob instanceof Blob && blob.type === "application/json") {
        data = await blob.text();
        data = JSON.parse(data);
      }

      setDocInfo({
        available: data.available ?? false,
        url: data.url ?? null,
        filename: data.filename ?? null,
        message: data.message ?? null,
      });
    } catch (err) {
      console.error("Failed to check document availability:", err);
      setDocInfo({
        available: false,
        url: null,
        filename: null,
        message: null,
      });
    } finally {
      setLoadingDoc(false);
    }
  };

  useEffect(() => {
    if (dealId) {
      fetchThread();
      fetchDocAvailability();
    }
  }, [dealId]);

  useEffect(() => {
    if (msgBoxRef.current) {
      msgBoxRef.current.scrollTop = msgBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendReply = async () => {
    if (!reply.trim()) return;
    try {
      setSending(true);
      await dispatch(
        sendMessageApi({
          dealId,
          payload: {
            text: reply.trim(),
            from_role: "BROKER",
            from_name: "You",
          },
        }),
      ).unwrap();
      setReply("");
      await fetchThread();
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSending(false);
    }
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);

      const blob = await dispatch(
        downloadDocV2Api({ dealId, currentVersion }),
      ).unwrap();

      let data = blob;

      if (blob instanceof Blob && blob.type === "application/json") {
        data = await blob.text();
        data = JSON.parse(data);
      }

      if (!data?.available || !data?.url) {
        alert(data?.message || "Document not available for download.");
        return;
      }

      const a = document.createElement("a");
      a.href = data.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.download =
        data.filename || `LOI_Counter_Deal_${dealId}_v${currentVersion}.docx`;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  const isSent = (msg) => msg.from_role === "BROKER" || msg.type === "sent";
  const isSystem = (msg) => msg.from_role === "SYSTEM" || msg.type === "system";

  return (
    <div className="loi-tab-content">
      <div className="row g-4">
        <div className="col-12 col-md-6 d-flex flex-column gap-3">
          <div className="loi-section-header d-flex align-items-center gap-2">
            <MessageSquare size={11} />
            NEGOTIATION THREAD — DEAL #{dealId}
          </div>

          <div
            className="loi-msg-box d-flex flex-column gap-2"
            ref={msgBoxRef}
            style={{ overflowY: "auto", maxHeight: 320 }}
          >
            {loadingThread ? (
              <div className="loi-msg-system">Loading thread...</div>
            ) : messages.length === 0 ? (
              <div className="loi-msg-system">No messages yet.</div>
            ) : (
              messages.map((msg, i) => {
                if (isSystem(msg)) {
                  return (
                    <div key={i} className="loi-msg-system">
                      {msg.text ?? msg.message}
                    </div>
                  );
                }
                if (isSent(msg)) {
                  return (
                    <div
                      key={i}
                      className="loi-msg-bubble loi-msg-bubble--sent ms-auto"
                    >
                      <div className="loi-msg-meta">
                        {msg.from_name ?? "You"} · {msg.created_at ?? ""}
                      </div>
                      <div className="loi-msg-text">
                        {msg.text ?? msg.message}
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={i} className="loi-msg-bubble loi-msg-bubble--recv">
                    <div className="loi-msg-meta">
                      {msg.from_name ?? "Landlord"} · {msg.created_at ?? ""}
                    </div>
                    <div className="loi-msg-text loi-text-green-hover">
                      {msg.text ?? msg.message}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <textarea
            className="loi-reply-area w-100"
            placeholder="Type your response here..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            rows={3}
          />

          <div className="d-flex flex-wrap gap-2">
            <button
              className="loi-btn-primary d-flex align-items-center gap-2"
              onClick={handleSendReply}
              disabled={sending || !reply.trim()}
            >
              <Send size={13} />
              {sending ? "Sending..." : "Send Reply"}
            </button>
          </div>
        </div>

        <div className="col-12 col-md-6 d-flex flex-column gap-3">
          <SectionLabel icon={<DollarSign size={11} />}>
            LANDLORD COUNTER TERMS
          </SectionLabel>

          {!loadingDoc && !docInfo.available && (
            <div className="loi-hint d-flex align-items-center gap-1">
              <AlertTriangle size={11} />
              {docInfo.message || "Document not available yet."}
            </div>
          )}

          <button
            className="loi-btn-primary d-flex align-items-center gap-2"
            onClick={handleDownload}
            disabled={downloading || loadingDoc || !docInfo.available}
            style={{
              opacity: docInfo.available ? 1 : 0.5,
              cursor: docInfo.available ? "pointer" : "not-allowed",
            }}
          >
            <Download size={13} />
            {loadingDoc
              ? "Checking..."
              : downloading
                ? "Downloading..."
                : "Download .docx"}
          </button>
        </div>
      </div>
    </div>
  );
};
