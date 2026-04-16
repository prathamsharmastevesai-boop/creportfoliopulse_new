import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TourForm } from "./calendarForm";
import {
  deleteTourApi,
  fetchToursApi,
} from "../../../Networking/User/APIs/calendar/calendarApi";
import { Pencil, Trash2 } from "lucide-react";

const TYPE_BADGE = {
  "Building Tour": {
    bg: "var(--bs-green-light)",
    color: "var(--bs-green-dark)",
  },
  "Office Tour": { bg: "#ede9fe", color: "#6d28d9" },
  "Facility Tour": {
    bg: "var(--bs-green-soft)",
    color: "var(--bs-green-primary)",
  },
  "Site Visit": { bg: "#fef3c7", color: "#92400e" },
};
const DEFAULT_BADGE = {
  bg: "var(--bs-badge-bg)",
  color: "var(--text-secondary)",
};

const formatDate = (d) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return d;
  }
};

const formatTime = (t) => {
  if (!t) return "—";
  if (t.includes("AM") || t.includes("PM")) return t;
  try {
    const [h, m] = t.split(":");
    const hour = parseInt(h, 10);
    return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
  } catch {
    return t;
  }
};

const formatPhone = (p) => p || "—";

const FullLoader = ({ text = "Loading…" }) => (
  <div className="cal-list-loader">
    <div className="spinner-border cal-list-loader__spinner" role="status" />
    <small className="cal-subtitle">{text}</small>
  </div>
);

const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  tourTitle,
  isDeleting,
}) => {
  if (!isOpen) return null;

  return (
    <div className="cal-delete-modal-backdrop" onClick={onClose}>
      <div className="cal-delete-modal" onClick={(e) => e.stopPropagation()}>
        <div className="d-flex align-items-center justify-content-between px-4 py-3 cal-section-border">
          <h6 className="mb-0 fw-semibold cal-delete-modal__title">
            Delete Tour
          </h6>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            aria-label="Close"
          />
        </div>

        <div className="px-4 py-4 text-center">
          <p className="mb-2 cal-delete-modal__body-title">
            Are you sure you want to delete this tour?
          </p>
          <p className="mb-0 cal-delete-modal__tour-name">"{tourTitle}"</p>
        </div>

        <div className="d-flex justify-content-end gap-2 px-4 py-3 cal-section-border-top">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="cal-btn cal-btn--cancel"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="cal-btn cal-btn--danger"
          >
            {isDeleting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-1"
                  role="status"
                  aria-hidden="true"
                />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export const CalendarList = () => {
  const dispatch = useDispatch();
  const {
    tours = [],
    fetchLoading,
    createLoading,
    updateLoading,
    deleteLoading,
    error,
  } = useSelector((state) => state.calendarSlice);

  const [editingTour, setEditingTour] = useState(null);
  const [search, setSearch] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [tourToDelete, setTourToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchToursApi());
  }, [dispatch]);

  const handleDeleteClick = (tour) => {
    setTourToDelete(tour);
    setDeleteModalOpen(true);
  };
  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setTourToDelete(null);
  };
  const handleDeleteConfirm = async () => {
    if (tourToDelete) {
      await dispatch(deleteTourApi(tourToDelete.id));
      setDeleteModalOpen(false);
      setTourToDelete(null);
    }
  };

  const filtered = tours.filter((t) => {
    const q = search.toLowerCase();
    return (
      !q ||
      [t.title, t.building, t.contact_name, t.tour_type].some((v) =>
        v?.toLowerCase().includes(q),
      )
    );
  });

  if (editingTour) {
    return (
      <TourForm
        editData={editingTour}
        onSuccess={() => {
          setEditingTour(null);
          dispatch(fetchToursApi());
        }}
        onCancel={() => setEditingTour(null)}
      />
    );
  }

  const isBusy = fetchLoading || createLoading || updateLoading;

  return (
    <>
      <div className="cal-card" style={{ position: "relative" }}>
        {isBusy && (
          <FullLoader
            text={
              fetchLoading
                ? "Loading tours…"
                : createLoading
                  ? "Scheduling tour…"
                  : "Updating tour…"
            }
          />
        )}

        <div className="d-flex align-items-center justify-content-between px-4 py-3 cal-section-border">
          <div>
            <h6 className="mb-0 fw-semibold cal-title">Scheduled Tours</h6>
            <small className="cal-subtitle">
              {tours.length} tour{tours.length !== 1 ? "s" : ""} total
            </small>
          </div>

          <button
            type="button"
            onClick={() => dispatch(fetchToursApi())}
            disabled={fetchLoading}
            className="btn btn-sm d-flex align-items-center gap-1 cal-btn--refresh"
          >
            {fetchLoading ? (
              <span
                className="spinner-border spinner-border-sm"
                style={{ width: "12px", height: "12px", borderWidth: "2px" }}
              />
            ) : (
              <svg
                width="13"
                height="13"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            )}
            Refresh
          </button>
        </div>

        <div className="px-4 py-2 cal-section-border">
          <div className="position-relative">
            <svg
              className="cal-search-icon"
              width="13"
              height="13"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, building, name…"
              className="form-control form-control-sm cal-search-input"
            />
          </div>
        </div>

        <div className="cal-list-body">
          {!fetchLoading && filtered.length === 0 && (
            <div className="text-center py-5 px-4">
              <div className="cal-empty-icon mb-3">📅</div>
              <p className="small fw-medium mb-1 cal-title">No tours found</p>
              <p className="small mb-0 cal-subtitle">
                {search
                  ? "Try a different search term"
                  : "Schedule your first building tour"}
              </p>
            </div>
          )}

          {filtered.map((tour, idx) => {
            const badge = TYPE_BADGE[tour.tour_type] ?? DEFAULT_BADGE;
            const isDeleting = deleteLoading === tour.id;

            return (
              <div
                key={tour.id}
                className={[
                  "cal-tour-row px-4 py-3",
                  isDeleting ? "cal-tour-row--deleting" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                style={{
                  borderBottom:
                    idx < filtered.length - 1
                      ? "1px solid var(--bs-modal-border)"
                      : "none",
                }}
              >
                {isDeleting && (
                  <div className="cal-row-deleting-pill">
                    <div className="cal-row-deleting-pill__inner">
                      <span className="spinner-border cal-row-deleting-pill__spinner" />
                      <small className="cal-subtitle">Deleting…</small>
                    </div>
                  </div>
                )}

                <div className="d-flex align-items-start justify-content-between gap-2">
                  <div className="flex-grow-1" style={{ minWidth: 0 }}>
                    <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                      <span
                        className="badge rounded-pill cal-type-badge"
                        style={{
                          backgroundColor: badge.bg,
                          color: badge.color,
                        }}
                      >
                        {tour.tour_type}
                      </span>
                      <span className="cal-meta">{tour.duration}</span>
                    </div>

                    <p
                      className="mb-0 fw-semibold text-truncate cal-title"
                      style={{ fontSize: "14px" }}
                    >
                      {tour.title}
                    </p>

                    <p className="mb-2 text-truncate cal-meta">
                      📍 {tour.building}
                    </p>

                    <div className="d-flex flex-wrap gap-3">
                      <span className="d-flex align-items-center gap-1 cal-meta">
                        <svg
                          width="11"
                          height="11"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {formatDate(tour.tour_date)}
                      </span>
                      <span className="d-flex align-items-center gap-1 cal-meta">
                        <svg
                          width="11"
                          height="11"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {formatTime(tour.tour_time)}
                      </span>
                      <span className="d-flex align-items-center gap-1 cal-meta">
                        <svg
                          width="11"
                          height="11"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        {tour.contact_name}
                      </span>
                    </div>

                    <div className="d-flex flex-wrap gap-3 mt-1">
                      <span className="d-flex align-items-center gap-1 cal-meta--sm">
                        <svg
                          width="10"
                          height="10"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        {tour.contact_email}
                      </span>
                      {tour.contact_phone && (
                        <span className="d-flex align-items-center gap-1 cal-meta--sm">
                          <svg
                            width="10"
                            height="10"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                          {formatPhone(tour.contact_phone)}
                        </span>
                      )}
                    </div>

                    {tour.description && (
                      <p
                        className="mt-2 mb-0 cal-meta"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {tour.description}
                      </p>
                    )}

                    <p className="mt-1 mb-0 cal-created-at">
                      Added{" "}
                      {new Date(tour.created_at).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <div className="d-flex flex-column gap-1 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setEditingTour(tour)}
                      disabled={isDeleting}
                      className="btn btn-sm cal-action-btn cal-btn--edit"
                      title="Edit"
                    >
                      <Pencil size={18} strokeWidth={2} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteClick(tour)}
                      disabled={isDeleting}
                      className="btn btn-sm cal-action-btn cal-btn--delete"
                      title="Delete"
                    >
                      {isDeleting ? (
                        <span className="spinner-border spinner-border-sm cal-spinner" />
                      ) : (
                        <Trash2 size={18} strokeWidth={2} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {error && (
          <div className="alert alert-danger py-2 small mx-4 my-3 mb-0">
            {typeof error === "string"
              ? error
              : "Something went wrong. Please try again."}
          </div>
        )}
      </div>

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        tourTitle={tourToDelete?.title || ""}
        isDeleting={deleteLoading === tourToDelete?.id}
      />
    </>
  );
};
