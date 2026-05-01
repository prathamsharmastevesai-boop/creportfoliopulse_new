import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addMessageSocket,
  setTypingStatus,
  setUserStatus,
  deleteMessageSocket,
  markMessagesRead,
  updateConversationWithMessage,
} from "../Networking/User/Slice/chatSystemSlice";

const WS_URL =
  "wss://creportfoliopulseversion1-78014104811.us-central1.run.app/messenger/ws";

const CONNECTION_STATUS = {
  CONNECTED: "🟢 Connected",
  DISCONNECTED: "🔴 Disconnected",
  RECONNECTING: "🟡 Reconnecting...",
};

const MAX_RECONNECT_ATTEMPTS = 10;
const BASE_RECONNECT_DELAY_MS = 1000;
const MAX_RECONNECT_DELAY_MS = 30_000;
const HEARTBEAT_INTERVAL_MS = 30_000;
const TYPING_AUTO_CLEAR_MS = 3_000;
const TYPING_DEBOUNCE_MS = 500;


const getToken = () =>
  sessionStorage.getItem("access_token") || sessionStorage.getItem("token");

const getUserIdFromStorage = () =>
  sessionStorage.getItem("user_id") || sessionStorage.getItem("admin_id");

const backoffDelay = (attempt) =>
  Math.min(BASE_RECONNECT_DELAY_MS * 2 ** attempt, MAX_RECONNECT_DELAY_MS);


const WebSocketContext = createContext(null);
export const useWebSocket = () => useContext(WebSocketContext);


const ENTRY_EVENT_MAP = {
  ENTRY_APPROVED: { label: "Approved", actor: "reviewed_by_name" },
  ENTRY_REJECTED: { label: "Rejected", actor: "reviewed_by_name" },
  ENTRY_DELETED: { label: "Deleted", actor: "deleted_by_name" },
  NEW_SUBMISSION: { label: "Submitted", actor: "submitted_by_name" },
};

const BUILDING_ACTION_LABELS = {
  create: "A new item was added",
  update: "An item was updated",
  delete: "An item was removed",
};


export const WebSocketProvider = ({ children }) => {
  const dispatch = useDispatch();

  const socketRef = useRef(null);
  const reconnectTimer = useRef(null);
  const reconnectAttempts = useRef(0);
  const messageQueue = useRef([]);
  const typingDebounceTimer = useRef(null);
  const typingTimeoutsRef = useRef({});
  const currentConversationRef = useRef(null);
  const currentReceiverRef = useRef(null);

  const [status, setStatus] = useState(CONNECTION_STATUS.DISCONNECTED);
  const [isConnected, setIsConnected] = useState(false);

  const { userdata } = useSelector((s) => s.ProfileSlice || {});
  const myUserId = userdata?.id || getUserIdFromStorage();
  const token = getToken();


  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const showNotification = useCallback(({ title, body, url }) => {
    if (
      "Notification" in window &&
      Notification.permission === "granted" &&
      document.hidden
    ) {
      const n = new Notification(title, { body, icon: "/favicon.ico" });
      n.onclick = () => {
        window.focus();
        if (url) window.location.href = url;
        n.close();
      };
    }
  }, []);


  const flushQueue = useCallback(() => {
    while (messageQueue.current.length > 0) {
      const payload = messageQueue.current.shift();
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify(payload));
      } else {
        messageQueue.current.unshift(payload);
        break;
      }
    }
  }, []);


  const handleMessage = useCallback(
    (event) => {
      let data;
      try {
        data = JSON.parse(event.data);
      } catch (err) {
        console.error("Socket parse error:", err);
        return;
      }


      if (ENTRY_EVENT_MAP[data.type]) {
        const cfg = ENTRY_EVENT_MAP[data.type];
        showNotification({
          title: `Entry ${cfg.label}`,
          body: `${data[cfg.actor]} ${cfg.label.toLowerCase()} a ${data.category} entry`,
          url: `/building/${data.building_id}`,
        });
        return;
      }

      switch (data.type) {
        case "MY_PRESENCE":

          break;

        case "USER_STATUS":

          dispatch(
            setUserStatus({
              user_id: data.user_id,
              online: data.online,
              last_seen: data.last_seen,
            }),
          );
          break;

        case "TYPING":
          if (data.sender_id !== myUserId) {
            const conversationId =
              data.conversation_id || currentConversationRef.current;

            if (!conversationId) break;

            dispatch(
              setTypingStatus({
                conversation_id: conversationId,
                sender_id: data.sender_id,
                is_typing: data.is_typing !== false,
              }),
            );
            const key = `${conversationId}_${data.sender_id}`;
            if (typingTimeoutsRef.current[key]) {
              clearTimeout(typingTimeoutsRef.current[key]);
              delete typingTimeoutsRef.current[key];
            }

            if (data.is_typing !== false) {
              typingTimeoutsRef.current[key] = setTimeout(() => {
                dispatch(
                  setTypingStatus({
                    conversation_id: conversationId,
                    sender_id: data.sender_id,
                    is_typing: false,
                  }),
                );
                delete typingTimeoutsRef.current[key];
              }, TYPING_AUTO_CLEAR_MS);
            }
          }
          break;

        case "NEW_MESSAGE":
          dispatch(
            addMessageSocket({
              id: data.message_id || data.id,
              conversation_id: data.conversation_id,
              sender_id: data.sender_id,
              sender_name: data.sender_name,
              content: data.content || "",
              created_at: data.created_at,
              file_id: data.file_id ?? null,
              file_name: data.file_name ?? null,
              file_url: data.file_url ?? null,
              file_type: data.file_name
                ? data.file_name.split(".").pop().toLowerCase()
                : null,
              is_read: data.is_read ?? false,
              read_at: data.read_at ?? null,
              is_group: data.is_group ?? false,
            }),
          );


          dispatch(
            updateConversationWithMessage({
              conversation_id: data.conversation_id,
              last_message: {
                id: data.message_id || data.id,
                content: data.content || "📎 Attachment",
                created_at: data.created_at,
                sender_id: data.sender_id,
                sender_name: data.sender_name,
              },
              sender_id: data.sender_id,
            }),
          );

          if (data.sender_id !== myUserId) {
            showNotification({
              title: data.sender_name || "New Message",
              body: data.content || "📎 Attachment",
              url: `/chat/${data.conversation_id}`,
            });
          }
          break;

        case "MESSAGE_DELETED":
          dispatch(
            deleteMessageSocket({
              conversation_id: data.conversation_id,
              message_id: data.message_id,
            }),
          );
          break;

        case "BUILDING_UPDATE": {
          const actionLabel =
            BUILDING_ACTION_LABELS[data.details?.type] ||
            "Building was updated";
          showNotification({
            title: `Building #${data.building_id} Updated`,
            body: `${actionLabel} (ID: ${data.details?.id})`,
            url: `/building/${data.building_id}`,
          });
          break;
        }

        case "NOTIFICATION":
          showNotification({
            title: data.title || "Notification",
            body: data.message || "",
            url: data.url,
          });
          break;

        case "HEARTBEAT_ACK":

          break;

        case "ERROR":
          console.error("Socket error from server:", data.message);
          break;

        default:
          console.warn("Unknown socket type:", data.type);
      }
    },
    [dispatch, myUserId, showNotification],
  );


  const cleanup = useCallback(() => {
    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
      reconnectTimer.current = null;
    }

    Object.values(typingTimeoutsRef.current).forEach((timeout) => {
      clearTimeout(timeout);
    });
    typingTimeoutsRef.current = {};
  }, []);


  const connect = useCallback(() => {
    cleanup();

    if (!token) {
      console.warn("❌ No token — socket not connecting");
      return;
    }
    if (!myUserId) {
      console.warn("❌ No userId — socket not connecting");
      return;
    }
    if (socketRef.current?.readyState === WebSocket.OPEN) return;
    if (socketRef.current) {
      socketRef.current.onclose = null;
      socketRef.current.close();
      socketRef.current = null;
    }

    const wsUrl = `${WS_URL}?token=${token}`;


    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {

      reconnectAttempts.current = 0;
      setStatus(CONNECTION_STATUS.CONNECTED);
      setIsConnected(true);
      flushQueue();
    };

    socket.onmessage = handleMessage;

    socket.onclose = (event) => {

      setIsConnected(false);
      socketRef.current = null;

      if (event.code === 1008) {
        setStatus(CONNECTION_STATUS.DISCONNECTED);
        console.warn("Auth error — stopping reconnection");
        return;
      }

      if (reconnectAttempts.current >= MAX_RECONNECT_ATTEMPTS) {
        setStatus(CONNECTION_STATUS.DISCONNECTED);
        console.warn("Max reconnect attempts reached. Giving up.");
        return;
      }

      const delay = backoffDelay(reconnectAttempts.current);
      reconnectAttempts.current += 1;


      setStatus(CONNECTION_STATUS.RECONNECTING);
      reconnectTimer.current = setTimeout(connect, delay);
    };

    socket.onerror = (err) => {
      console.error("Socket error:", err);
    };
  }, [token, myUserId, cleanup, flushQueue, handleMessage]);


  useEffect(() => {
    const handleAuthChange = () => {

      reconnectAttempts.current = 0;
      connect();
    };
    window.addEventListener("authChanged", handleAuthChange);
    return () => window.removeEventListener("authChanged", handleAuthChange);
  }, [connect]);


  useEffect(() => {
    if (!isConnected && token && myUserId) connect();
  }, [token, myUserId, isConnected, connect]);


  const sendHeartbeat = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: "HEARTBEAT" }));
    }
  }, []);

  useEffect(() => {
    if (!isConnected) return;
    const interval = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [isConnected, sendHeartbeat]);


  useEffect(() => {
    return () => {
      cleanup();
      if (socketRef.current) {
        socketRef.current.onclose = null;
        socketRef.current.close();
      }
    };
  }, [cleanup]);



  const sendMessage = useCallback(
    (payload, { queue = true } = {}) => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify(payload));
        return true;
      }

      if (queue) {
        console.warn("Socket not open — queuing message:", payload.type);
        messageQueue.current.push(payload);
      }

      if (socketRef.current?.readyState === WebSocket.CLOSED) connect();

      return false;
    },
    [connect],
  );

  const sendTypingIndicator = useCallback(
    (receiverId, isTyping = true) => {
      const conversationId = currentConversationRef.current;
      if (!myUserId || !receiverId || !conversationId) return;

      if (isTyping && typingDebounceTimer.current) return;

      if (isTyping) {
        typingDebounceTimer.current = setTimeout(() => {
          typingDebounceTimer.current = null;
        }, TYPING_DEBOUNCE_MS);
      } else {
        clearTimeout(typingDebounceTimer.current);
        typingDebounceTimer.current = null;
      }

      sendMessage(
        {
          type: "TYPING",
          receiver_id: receiverId,
          conversation_id: conversationId,
          is_typing: isTyping,
        },
        { queue: false },
      );
    },
    [sendMessage, myUserId],
  );

  const sendReadReceipt = useCallback(
    async (conversationId, lastMessageId, isGroup = false) => {
      if (!lastMessageId) return;
      try {
        const currentToken = getToken();
        const endpoint = isGroup
          ? `/messenger/conversations/${conversationId}/read`
          : `/messenger/messages/${lastMessageId}/read`;

        await fetch(endpoint, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${currentToken}`,
            "Content-Type": "application/json",
          },
        });


        dispatch(
          markMessagesRead({
            conversation_id: conversationId,
            message_ids: [lastMessageId],
          }),
        );
      } catch (err) {
        console.error("Read receipt REST call failed:", err);
      }
    },
    [dispatch],
  );

  const setCurrentConversation = useCallback((conversationId, receiverId) => {
    currentConversationRef.current = conversationId;
    currentReceiverRef.current = receiverId;
  }, []);

  const getCurrentConversation = useCallback(
    () => ({
      conversationId: currentConversationRef.current,
      receiverId: currentReceiverRef.current,
    }),
    [],
  );

  const reconnect = useCallback(() => {
    reconnectAttempts.current = 0;
    connect();
  }, [connect]);

  const queuedMessageCount = messageQueue.current.length;

  return (
    <WebSocketContext.Provider
      value={{
        sendMessage,
        sendTypingIndicator,
        sendReadReceipt,
        sendHeartbeat,

        setCurrentConversation,
        getCurrentConversation,

        status,
        isConnected,
        myUserId,

        connect,
        reconnect,
        disconnect: cleanup,

        queuedMessageCount,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
