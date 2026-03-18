import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip, Spinner, Alert } from "react-bootstrap";
import {
  getNotificationStatusAPI,
  toggleNotificationStatusAPI,
} from "../Networking/User/APIs/Notification/notificationApi";
import "bootstrap-icons/font/bootstrap-icons.css";

const getInitialPermission = () => {
  try {
    return "Notification" in window ? Notification.permission : "denied";
  } catch {
    return "denied";
  }
};

export const NotificationToggle = () => {
  const dispatch = useDispatch();
  const { enabled, loading } = useSelector((state) => state.notificationSlice);

  const [permission, setPermission] = useState(getInitialPermission);
  const [isIOS, setIsIOS] = useState(false);
  const [isPWA, setIsPWA] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    setIsIOS(/iPad|iPhone|iPod/.test(ua) && !window.MSStream);

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.matchMedia("(display-mode: fullscreen)").matches ||
      window.matchMedia("(display-mode: minimal-ui)").matches ||
      navigator.standalone === true;

    setIsPWA(standalone);
  }, []);

  useEffect(() => {
    dispatch(getNotificationStatusAPI());
  }, [dispatch]);

  const requestPermission = async () => {
    if (!("Notification" in window)) {
      alert("Your browser does not support notifications.");
      return "denied";
    }

    if (permission !== "default") return permission;

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    } catch (err) {
      console.error("Permission request error:", err);
      return "denied";
    }
  };

  const handleToggle = async () => {
    if (loading) return;

    if (isIOS && !isPWA) {
      setShowIOSGuide(true);
      return;
    }

    let perm = permission;
    if (perm === "default") perm = await requestPermission();

    if (perm !== "granted") {
      alert(
        perm === "denied"
          ? "Notifications are blocked. Please enable them in your browser settings."
          : "Notification permission was not granted.",
      );
      return;
    }

    dispatch(toggleNotificationStatusAPI(!enabled));
  };

  const dismissGuide = () => setShowIOSGuide(false);

  return (
    <div className="">
      {showIOSGuide && isIOS && !isPWA && (
        <Alert
          variant="warning"
          dismissible
          onClose={dismissGuide}
          className="w-100"
          style={{ maxWidth: "400px" }}
        >
          <strong>Enable notifications on iPhone:</strong>
          <ol className="mb-0 mt-2 small">
            <li>
              Tap the <strong>Share</strong> icon (square ↑)
            </li>
            <li>
              Select <strong>Add to Home Screen</strong>
            </li>
            <li>Open the site from your Home Screen</li>
            <li>Tap the bell again to enable notifications</li>
          </ol>
          <p className="small mt-2 mb-0">
            Notifications only work from the Home Screen version on iOS.
          </p>
        </Alert>
      )}

      <OverlayTrigger
        placement="bottom"
        overlay={
          <Tooltip id="notification-tooltip">
            {enabled ? "Disable Notifications" : "Enable Notifications"}
          </Tooltip>
        }
      >
        <button
          onClick={handleToggle}
          className={`btn d-flex align-items-center px-2 py-0 rounded-pill shadow-sm ${
            enabled ? "btn-primary" : "btn-outline-secondary"
          }`}
          style={{
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.2s ease",
          }}
          disabled={loading}
        >
          {loading ? (
            <Spinner animation="border" size="sm" className="me-2" />
          ) : (
            <i
              className={`fs-6 me-2 ${
                enabled ? "bi bi-bell-fill" : "bi bi-bell-slash"
              }`}
            />
          )}
          {enabled ? "Notifications On" : "Notifications Off"}
        </button>
      </OverlayTrigger>

      {permission === "denied" && !loading && (
        <small className="text-danger">
          Notifications are blocked. Please check your browser or device
          settings.
        </small>
      )}
    </div>
  );
};
