import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TourForm } from "./calendarForm";
import { CalendarList } from "./calendarList";
import { fetchToursApi } from "../../../Networking/User/APIs/calendar/calendarApi";
import Card from "../../../Component/Card/Card";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const toYMD = (y, m, d) =>
  `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

const today = new Date();
const todayYMD = toYMD(today.getFullYear(), today.getMonth(), today.getDate());

export const Calendar = () => {
  const dispatch = useDispatch();
  const { tours = [] } = useSelector((s) => s.tours ?? {});

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [activeTab, setActiveTab] = useState("schedule");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    dispatch(fetchToursApi());
  }, [dispatch]);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  }, [viewYear, viewMonth]);

  const toursByDate = useMemo(() => {
    const map = {};
    tours.forEach((t) => {
      if (t.tour_date) map[t.tour_date] = (map[t.tour_date] ?? 0) + 1;
    });
    return map;
  }, [tours]);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };
  const goToday = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
  };

  const openModal = (dateStr = "") => {
    setSelectedDate(dateStr);
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);
  const handleFormSuccess = () => {
    closeModal();
    dispatch(fetchToursApi());
  };

  return (
    <div className="cal-page p-3 p-md-4">
      <div className="mx-auto">
        <div className="d-flex align-items-start justify-content-between mb-3">
          <div className="d-flex align-items-center gap-3">
            <div className="cal-header-icon">
              <svg
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h5 className="mb-0 fw-bold cal-title">Tour Calendar</h5>
              <small className="cal-subtitle">
                Schedule building tours and meetings
              </small>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2 flex-shrink-0">
            <div className="cal-tab-group">
              {["schedule", "list"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`cal-tab-btn${activeTab === tab ? " cal-tab-btn--active" : ""}`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Card variant="elevated" className="mb-3 shadow-sm" bodyClass="p-4">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h6 className="mb-0 fw-bold cal-month-label">
              {MONTHS[viewMonth]} {viewYear}
            </h6>
            <div className="d-flex align-items-center gap-1">
              <button type="button" onClick={prevMonth} className="cal-nav-btn">
                ‹
              </button>
              <button type="button" onClick={goToday} className="cal-today-btn">
                Today
              </button>
              <button type="button" onClick={nextMonth} className="cal-nav-btn">
                ›
              </button>
            </div>
          </div>

          <div className="cal-grid mb-2">
            {DAYS.map((d) => (
              <div key={d} className="cal-day-header">
                {d}
              </div>
            ))}
          </div>

          <div className="cal-grid--gap">
            {calendarDays.map((day, idx) => {
              if (!day) return <div key={`e-${idx}`} />;
              const ymd = toYMD(viewYear, viewMonth, day);
              const isToday = ymd === todayYMD;
              const tourCount = toursByDate[ymd] ?? 0;

              return (
                <button
                  key={ymd}
                  type="button"
                  onClick={() => openModal(ymd)}
                  className={[
                    "cal-day-cell",
                    isToday ? "cal-day-cell--today" : "",
                    tourCount ? "cal-day-cell--has-dot" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {day}
                  {tourCount > 0 && (
                    <span
                      className={`cal-dot${isToday ? " cal-dot--on-today" : ""}`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </Card>

        {activeTab === "schedule" ? (
          <TourForm
            preselectedDate={selectedDate}
            onSuccess={() => dispatch(fetchToursApi())}
          />
        ) : (
          <CalendarList />
        )}
      </div>

      {modalOpen && (
        <>
          <div className="cal-modal-backdrop" onClick={closeModal} />
          <div className="cal-modal-sheet">
            <TourForm
              preselectedDate={selectedDate}
              onSuccess={handleFormSuccess}
              onCancel={closeModal}
            />
          </div>
        </>
      )}
    </div>
  );
};
