// src/pages/calendar/CalendarPage.jsx
// ============================================================
// Calendar & Schedule Page — Module 11
// Month grid matrix matching WIREFRAMES/calendar.html,
// color-coded event chips, Today's events & Upcoming 7-day schedule.
// Clean Language Toggle (EN / MR) Support
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api.js';
import useLangStore from '../../store/langStore.js';
import CalendarFormModal from './CalendarFormModal.jsx';
import LucideIcon from '../../components/common/LucideIcon.jsx';
import './CalendarPage.css';

const EVENT_TYPE_CLASS = {
  MEETING: { en: 'Meeting', mr: 'बैठक', class: 'ev-meeting' },
  PUBLIC_PROGRAM: { en: 'Program', mr: 'कार्यक्रम', class: 'ev-program' },
  GOVT_DEADLINE: { en: 'Deadline', mr: 'डेडलाइन', class: 'ev-deadline' },
  ASSEMBLY_SESSION: { en: 'Assembly Session', mr: 'अधिवेशन', class: 'ev-session' },
  CONSTITUENCY_VISIT: { en: 'Visit', mr: 'दौरा', class: 'ev-program' },
  PERSONAL: { en: 'Personal', mr: 'वैयक्तिक', class: 'ev-personal' },
  HOLIDAY: { en: 'Holiday', mr: 'सुट्टी', class: 'ev-holiday' },
};

const WEEKDAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAYS_MR = ['रवी', 'सोम', 'मंगळ', 'बुध', 'गुरु', 'शुक्र', 'शनि'];

const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTHS_MR = [
  'जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल', 'मे', 'जून',
  'जुलै', 'ऑगस्ट', 'सप्टेंबर', 'ऑक्टोबर', 'नोव्हेंबर', 'डिसेंबर'
];

const CalendarPage = () => {
  const { lang, setLang } = useLangStore();
  const isMr = lang === 'MR';

  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeView, setActiveView] = useState('Month');
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

  // Build Month Calendar Days Matrix
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Sun) to 6 (Sat)
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const calendarCells = [];
  // Leading cells from previous month
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarCells.push({ day: prevMonthDays - i, isOtherMonth: true });
  }
  // Days of current month
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push({ day: d, isOtherMonth: false });
  }
  // Trailing cells for next month
  const totalCells = Math.ceil(calendarCells.length / 7) * 7;
  const trailingCount = totalCells - calendarCells.length;
  for (let i = 1; i <= trailingCount; i++) {
    calendarCells.push({ day: i, isOtherMonth: true });
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
    <div className="calendar-page-container">
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            {isMr ? 'दिनदर्शिका (Calendar)' : 'Calendar · '}
            <span className="mr">{isMr ? '' : 'दिनदर्शिका'}</span>
          </h1>
          <p className="page-subtitle">
            {isMr
              ? 'कार्यालयीन बैठका, शासकीय मुदती, सार्वजनिक कार्यक्रम व मतदारसंघातील दौरे नियोजन'
              : 'Schedule, meetings, government deadlines, public programs and visits'}
          </p>
        </div>

        <div className="page-actions">
          <button className="btn-o" onClick={() => alert(isMr ? 'दिनदर्शिका एक्सपोर्ट होत आहे...' : 'Exporting calendar...')}>
            📥 {isMr ? 'एक्सपोर्ट' : 'Export'}
          </button>
          <button className="btn-p" onClick={() => openFormForDate(todayDayNum)}>
            + {isMr ? 'नवीन कार्यक्रम' : 'New Event'}
          </button>
        </div>
      </div>

      {/* ── Calendar Navigation Toolbar ────────────────────── */}
      <div className="cal-nav">
        <button className="cal-nav-btn" onClick={handlePrevMonth} title="Previous Month">
          ‹
        </button>
        <span className="cal-month">
          {isMr ? MONTHS_MR[month] : MONTHS_EN[month]} {year}
        </span>
        <button className="cal-nav-btn" onClick={handleNextMonth} title="Next Month">
          ›
        </button>
        <button className="cal-today" onClick={handleTodayClick}>
          {isMr ? 'आज' : 'Today'}
        </button>

        {/* View Toggle */}
        <div className="cal-view-toggle">
          <button
            className={`cvt ${activeView === 'Month' ? 'active' : ''}`}
            onClick={() => setActiveView('Month')}
          >
            {isMr ? 'महिना' : 'Month'}
          </button>
          <button
            className={`cvt ${activeView === 'Week' ? 'active' : ''}`}
            onClick={() => setActiveView('Week')}
          >
            {isMr ? 'आठवडा' : 'Week'}
          </button>
          <button
            className={`cvt ${activeView === 'Day' ? 'active' : ''}`}
            onClick={() => setActiveView('Day')}
          >
            {isMr ? 'दिवस' : 'Day'}
          </button>
        </div>
      </div>

      {/* ── Main Layout (Calendar Grid + Side Panel Widgets) ── */}
      <div className="cal-main-layout">
        {/* Month Grid View */}
        <div className="cal-grid">
          <div className="cal-header">
            {(isMr ? WEEKDAYS_MR : WEEKDAYS_EN).map((day) => (
              <div key={day} className="cal-day-name">
                {day}
              </div>
            ))}
          </div>

          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-3)' }}>
              <p>{isMr ? 'दिनदर्शिका लोड होत आहे...' : 'Loading calendar schedule...'}</p>
            </div>
          ) : (
            <div className="cal-body">
              {calendarCells.map((cell, idx) => {
                if (cell.isOtherMonth) {
                  return (
                    <div key={`other-${idx}`} className="cal-cell other-month">
                      <span className="cal-date">{cell.day}</span>
                    </div>
                  );
                }

                const dayNum = cell.day;
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                const dayEvents = events.filter((e) => e.event_date === dateStr);
                const isTodayCell = isCurrentMonth && dayNum === todayDayNum;

                return (
                  <div
                    key={dateStr}
                    className={`cal-cell ${isTodayCell ? 'today' : ''}`}
                    onClick={() => openFormForDate(dayNum)}
                  >
                    <span className="cal-date">{dayNum}</span>

                    <div>
                      {dayEvents.slice(0, 3).map((e) => {
                        const cfg = EVENT_TYPE_CLASS[e.event_type] || EVENT_TYPE_CLASS.MEETING;
                        return (
                          <span
                            key={e.id}
                            className={`cal-event ${cfg.class}`}
                            title={`${e.title} (${e.start_time || ''})`}
                          >
                            {e.title}
                          </span>
                        );
                      })}
                      {dayEvents.length > 3 && (
                        <span className="cal-more">+{dayEvents.length - 3} {isMr ? 'इतर' : 'more'}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Side Panel Widgets */}
        <div className="calendar-side-panel">
          {/* Today's Schedule Card */}
          <div className="side-widget-card">
            <div className="widget-header">
              <h3>
                📅 {isMr ? 'आजचे कार्यक्रम' : "Today's Schedule"} ({todayEvents.length})
              </h3>
            </div>

            {todayEvents.length > 0 ? (
              <div className="widget-events-list">
                {todayEvents.map((ev) => {
                  const cfg = EVENT_TYPE_CLASS[ev.event_type] || EVENT_TYPE_CLASS.MEETING;
                  return (
                    <div key={ev.id} className="widget-event-item">
                      <span className={`widget-event-badge ${cfg.class}`}>
                        {isMr ? cfg.mr : cfg.en}
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
              <p className="no-events-text">
                {isMr ? 'आज कोणताही नियोजित कार्यक्रम नाही.' : 'No events scheduled for today.'}
              </p>
            )}
          </div>

          {/* Upcoming 7 Days Events Card */}
          <div className="side-widget-card">
            <div className="widget-header">
              <h3>
                🗓️ {isMr ? 'पुढील ७ दिवसांतील कार्यक्रम' : 'Upcoming 7 Days'} ({upcomingEvents.length})
              </h3>
            </div>

            {upcomingEvents.length > 0 ? (
              <div className="widget-events-list">
                {upcomingEvents.map((ev) => {
                  const cfg = EVENT_TYPE_CLASS[ev.event_type] || EVENT_TYPE_CLASS.MEETING;
                  return (
                    <div key={ev.id} className="widget-event-item">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className={`widget-event-badge ${cfg.class}`}>
                          {isMr ? cfg.mr : cfg.en}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'JetBrains Mono' }}>
                          📅 {ev.event_date}
                        </span>
                      </div>
                      <h4 className="widget-event-title" style={{ marginTop: '4px' }}>{ev.title}</h4>
                      <div className="widget-event-meta">
                        <span>⏱️ {ev.start_time ? ev.start_time.slice(0, 5) : '—'}</span>
                        {ev.location && <span>📍 {ev.location}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="no-events-text">
                {isMr ? 'पुढील ७ दिवसांत कोणताही कार्यक्रम नाही.' : 'No upcoming events in next 7 days.'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Add Event Form Modal ─────────────────────────────── */}
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
