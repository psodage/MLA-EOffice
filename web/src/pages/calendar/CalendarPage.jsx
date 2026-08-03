// src/pages/calendar/CalendarPage.jsx
// ============================================================
// Calendar & Schedule Page — Module 11
// Month grid, color-coded event chips, Today's events & Upcoming 7-day schedule
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api.js';
import CalendarFormModal from './CalendarFormModal.jsx';
import './CalendarPage.css';

const EVENT_TYPE_CONFIG = {
  MEETING: { mr: '🔵 बैठक', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.25)', border: '#38bdf8' },
  PUBLIC_PROGRAM: { mr: '🟣 कार्यक्रम', color: '#c084fc', bg: 'rgba(192, 132, 252, 0.25)', border: '#c084fc' },
  GOVT_DEADLINE: { mr: '🔴 डेडलाइन', color: '#f87171', bg: 'rgba(248, 113, 113, 0.25)', border: '#f87171' },
  ASSEMBLY_SESSION: { mr: '🟠 अधिवेशन', color: '#fb923c', bg: 'rgba(251, 146, 60, 0.25)', border: '#fb923c' },
  CONSTITUENCY_VISIT: { mr: '🟢 दौरा', color: '#4ade80', bg: 'rgba(74, 222, 128, 0.25)', border: '#4ade80' },
  PERSONAL: { mr: '⚪ वैयक्तिक', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.25)', border: '#94a3b8' },
};

const WEEKDAYS_MR = ['रवी', 'सोम', 'मंगळ', 'बुध', 'गुरु', 'शुक्र', 'शनि'];
const MONTHS_MR = [
  'जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल', 'मे', 'जून',
  'जुलै', 'ऑगस्ट', 'सप्टेंबर', 'ऑक्टोबर', 'नोव्हेंबर', 'डिसेंबर'
];

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [todayEvents, setTodayEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Modal State
  const [selectedEventType, setSelectedEventType] = useState('ALL');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDateForModal, setSelectedDateForModal] = useState('');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed
  const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;

  const fetchCalendarData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch month events, today's events, and upcoming events in parallel
      const [resMonth, resToday, resUpcoming] = await Promise.all([
        api.get('/calendar', { params: { month: monthStr, event_type: selectedEventType } }),
        api.get('/calendar/today'),
        api.get('/calendar/upcoming'),
      ]);

      setEvents(resMonth.data?.data || []);
      setTodayEvents(resToday.data?.data || []);
      setUpcomingEvents(resUpcoming.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch calendar data:', err);
    } finally {
      setLoading(false);
    }
  }, [monthStr, selectedEventType]);

  useEffect(() => {
    fetchCalendarData();
  }, [fetchCalendarData]);

  // Month navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
  const handleTodayClick = () => {
    setCurrentDate(new Date());
  };

  // Build Month Calendar Days Grid Matrix
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Sun) to 6 (Sat)
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarCells = [];
  // Leading empty cells
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarCells.push(null);
  }
  // Days of the month
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push(d);
  }

  const todayDateObj = new Date();
  const isCurrentMonth = todayDateObj.getFullYear() === year && todayDateObj.getMonth() === month;
  const todayDayNum = todayDateObj.getDate();

  const openFormForDate = (dayNum) => {
    if (!dayNum) return;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    setSelectedDateForModal(dateStr);
    setIsFormOpen(true);
  };

  return (
    <div className="inward-page-container">
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="inward-page-header">
        <div className="title-group">
          <h1 className="page-title-mr">📅 दिनदर्शिका व कार्यक्रम सूची (Calendar & Schedule)</h1>
          <p className="page-subtitle">
            कार्यालयीन बैठका, शासकीय मुदती, सार्वजनिक कार्यक्रम व मतदारसंघातील दौरे नियोजन
          </p>
        </div>

        <button className="create-inward-btn" onClick={() => openFormForDate(todayDayNum)}>
          <span>➕</span>
          <span>नवीन कार्यक्रम नोंदवा (Add Event)</span>
        </button>
      </div>

      {/* ── Calendar Controls & Filters ────────────────────── */}
      <div className="calendar-controls-bar">
        <div className="month-nav-group">
          <button className="nav-arrow-btn" onClick={handlePrevMonth}>← मागील</button>
          <h2 className="current-month-title">
            {MONTHS_MR[month]} {year}
          </h2>
          <button className="nav-arrow-btn" onClick={handleNextMonth}>पुढील →</button>
          <button className="btn-today-shortcut" onClick={handleTodayClick}>आज (Today)</button>
        </div>

        <div className="event-type-filter-group">
          <label>प्रकार फिल्टर:</label>
          <select value={selectedEventType} onChange={(e) => setSelectedEventType(e.target.value)}>
            <option value="ALL">सर्व कार्यक्रम (All Events)</option>
            {Object.keys(EVENT_TYPE_CONFIG).map((k) => (
              <option key={k} value={k}>
                {EVENT_TYPE_CONFIG[k].mr}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Main Workspace Grid (Calendar Grid + Side Panels) ── */}
      <div className="calendar-main-layout">
        {/* Month Grid View */}
        <div className="calendar-month-card">
          <div className="weekdays-grid">
            {WEEKDAYS_MR.map((day) => (
              <div key={day} className="weekday-header-cell">
                {day}
              </div>
            ))}
          </div>

          {loading ? (
            <div className="table-loading-box">
              <div className="mini-spinner"></div>
              <p>दिनदर्शिका लोड होत आहे...</p>
            </div>
          ) : (
            <div className="days-grid">
              {calendarCells.map((dayNum, idx) => {
                if (!dayNum) {
                  return <div key={`empty-${idx}`} className="day-cell empty-cell" />;
                }

                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                const dayEvents = events.filter((e) => e.event_date === dateStr);
                const isTodayCell = isCurrentMonth && dayNum === todayDayNum;

                return (
                  <div
                    key={dateStr}
                    className={`day-cell ${isTodayCell ? 'today-cell' : ''}`}
                    onClick={() => openFormForDate(dayNum)}
                  >
                    <div className="day-number-header">
                      <span className={`day-number ${isTodayCell ? 'today-badge' : ''}`}>{dayNum}</span>
                      {dayEvents.length > 0 && <span className="event-count-dot">{dayEvents.length}</span>}
                    </div>

                    <div className="day-events-list">
                      {dayEvents.slice(0, 3).map((e) => {
                        const cfg = EVENT_TYPE_CONFIG[e.event_type] || EVENT_TYPE_CONFIG.MEETING;
                        return (
                          <div
                            key={e.id}
                            className="event-chip"
                            style={{ backgroundColor: cfg.bg, color: cfg.color, borderLeft: `3px solid ${cfg.border}` }}
                            title={`${e.title} (${e.start_time || ''})`}
                          >
                            <span className="chip-time">{e.start_time ? e.start_time.slice(0, 5) : ''}</span>
                            <span className="chip-title">{e.title}</span>
                          </div>
                        );
                      })}
                      {dayEvents.length > 3 && (
                        <span className="more-events-tag">+{dayEvents.length - 3} इतर...</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Side Panel Widgets (Today's Events & Upcoming 7 Days) */}
        <div className="calendar-side-panel">
          {/* Today's Schedule Widget */}
          <div className="side-widget-card today-widget">
            <div className="widget-header">
              <h3>📅 आजचे कार्यक्रम ({todayEvents.length})</h3>
              <span className="widget-date-sub">{todayDateObj.toLocaleDateString('mr-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>

            {todayEvents.length > 0 ? (
              <div className="widget-events-list">
                {todayEvents.map((ev) => {
                  const cfg = EVENT_TYPE_CONFIG[ev.event_type] || EVENT_TYPE_CONFIG.MEETING;
                  return (
                    <div key={ev.id} className="widget-event-item">
                      <span className="widget-event-badge" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                        {cfg.mr}
                      </span>
                      <h4 className="widget-event-title">{ev.title}</h4>
                      <div className="widget-event-meta">
                        <span>⏱️ {ev.start_time ? ev.start_time.slice(0, 5) : '—'}</span>
                        {ev.location && <span>📍 {ev.location}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="no-events-text">आज कोणताही नियोजित कार्यक्रम नाही.</p>
            )}
          </div>

          {/* Upcoming 7-Day Events Widget */}
          <div className="side-widget-card upcoming-widget">
            <div className="widget-header">
              <h3>🗓️ पुढील ७ दिवसांतील कार्यक्रम ({upcomingEvents.length})</h3>
            </div>

            {upcomingEvents.length > 0 ? (
              <div className="widget-events-list">
                {upcomingEvents.map((ev) => {
                  const cfg = EVENT_TYPE_CONFIG[ev.event_type] || EVENT_TYPE_CONFIG.MEETING;
                  return (
                    <div key={ev.id} className="widget-event-item">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="widget-event-badge" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                          {cfg.mr}
                        </span>
                        <span className="upcoming-date-tag">📅 {ev.event_date}</span>
                      </div>
                      <h4 className="widget-event-title" style={{ marginTop: '0.35rem' }}>{ev.title}</h4>
                      <div className="widget-event-meta">
                        <span>⏱️ {ev.start_time ? ev.start_time.slice(0, 5) : '—'}</span>
                        {ev.location && <span>📍 {ev.location}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="no-events-text">पुढील ७ दिवसांत कोणताही कार्यक्रम नाही.</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Add Event Modal ─────────────────────────────────── */}
      <CalendarFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={fetchCalendarData}
        initialDate={selectedDateForModal}
      />
    </div>
  );
};

export default CalendarPage;
