import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { calendarSlots, lessonList } from '../data/mockData';
import { useAppContext } from '../context/useAppContext';

type LessonTab = 'create-event' | 'share' | 'calendar' | 'video';

export function LessonWorkspacePage() {
  const [activeTab, setActiveTab] = useState<LessonTab>('video');
  const [selectedLesson, setSelectedLesson] = useState(lessonList[0]?.id);
  const { notify } = useAppContext();
  const navigate = useNavigate();

  const selectedLessonTitle = useMemo(
    () => lessonList.find((lesson) => lesson.id === selectedLesson)?.title ?? 'Lesson module',
    [selectedLesson],
  );

  return (
    <main className="lesson-shell">
      <aside className="lesson-sidebar">
        <button className="back-chip" onClick={() => navigate(-1)}>
          ←
        </button>
        <h2>Change Simplification</h2>

        <div className="lesson-list">
          {lessonList.map((lesson, index) => (
            <button
              key={lesson.id}
              className={selectedLesson === lesson.id ? 'lesson-item lesson-item--active' : 'lesson-item'}
              onClick={() => setSelectedLesson(lesson.id)}
            >
              <span>{lesson.title}</span>
              <small>{lesson.duration}</small>
              <em className={`dot dot-${index % 3}`} />
            </button>
          ))}
        </div>
      </aside>

      <section className="lesson-main">
        <header className="lesson-head">
          <div>
            <h1>Learn about SAT Math Strategy and Prototyping</h1>
            <p>{selectedLessonTitle}</p>
          </div>
          <span>1 hour</span>
        </header>

        <div className="lesson-tabs">
          <button
            className={activeTab === 'create-event' ? 'tab tab--active' : 'tab'}
            onClick={() => setActiveTab('create-event')}
          >
            Create event
          </button>
          <button
            className={activeTab === 'share' ? 'tab tab--active' : 'tab'}
            onClick={() => setActiveTab('share')}
          >
            Share and Refer
          </button>
          <button
            className={activeTab === 'calendar' ? 'tab tab--active' : 'tab'}
            onClick={() => setActiveTab('calendar')}
          >
            Calendar
          </button>
          <button
            className={activeTab === 'video' ? 'tab tab--active' : 'tab'}
            onClick={() => setActiveTab('video')}
          >
            Video lesson
          </button>
        </div>

        {activeTab === 'create-event' ? (
          <div className="lesson-panel">
            <h2>Create new event</h2>
            <p>
              Schedule timed drills, review sessions, and focused concept sprints for your SAT prep.
            </p>
            <div className="form-grid">
              <label>
                Event Name
                <input placeholder="Adaptive SAT Math Review" />
              </label>
              <label>
                Start date / Time
                <input placeholder="September 24, 2026 07:59 am" />
              </label>
              <label>
                End date / Time
                <input placeholder="September 24, 2026 09:00 am" />
              </label>
              <label>
                Location
                <input placeholder="Online session" />
              </label>
              <label>
                Notification
                <select>
                  <option>30 mins</option>
                  <option>1 hour</option>
                </select>
              </label>
              <label>
                Email
                <input placeholder="student@example.com" />
              </label>
            </div>
            <label>
              Event Description
              <textarea placeholder="Enter your event notes" rows={4} />
            </label>
            <button className="btn btn--solid" onClick={() => notify('Event saved', 'success')}>
              Save Now
            </button>
          </div>
        ) : null}

        {activeTab === 'share' ? (
          <div className="lesson-panel">
            <h2>Share and Refer</h2>
            {[1, 2, 3].map((block) => (
              <article key={block} className="share-card">
                <header>
                  <h3>06 Super Coins on the way</h3>
                  <div className="icon-row">
                    {['t', 'f', 'y', 'i', 'a', 'w'].map((icon) => (
                      <button key={icon} onClick={() => notify('Share link copied', 'info')}>
                        {icon}
                      </button>
                    ))}
                  </div>
                </header>
                <p>
                  Invite friends and classmates. You both unlock bonus adaptive question sets
                  and additional progress analytics.
                </p>
              </article>
            ))}
          </div>
        ) : null}

        {activeTab === 'calendar' ? (
          <div className="lesson-panel">
            <h2>Share and refer</h2>
            <div className="calendar-grid">
              <div className="calendar-month">
                <h3>September 2026</h3>
                <div className="calendar-days">
                  {Array.from({ length: 30 }, (_, i) => (
                    <button key={i + 1} onClick={() => notify(`Date selected: Sep ${i + 1}`, 'info')}>
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
              <div className="calendar-day-plan">
                <h3>Sep 12, Monday</h3>
                {calendarSlots.map((slot) => (
                  <div key={slot.time} className={slot.active ? 'slot slot--active' : 'slot'}>
                    <strong>{slot.time}</strong>
                    <span>{slot.task || 'Open slot'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {activeTab === 'video' ? (
          <div className="lesson-panel">
            <img
              className="rounded-image"
              src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1600&q=80"
              alt="Classroom lesson"
            />
            <div className="video-progress">
              <span>01:02 / 03:26</span>
              <div className="progress-line">
                <span />
              </div>
            </div>
            <h2>06 Super Coins on the way</h2>
            <p>
              Learn the exact setup and solving approach used in high-value SAT math questions.
              Then apply it immediately in a timed mini quiz.
            </p>
            <button
              className="btn btn--solid"
              onClick={() => {
                notify('Opening practice mode', 'success');
                navigate('/practice');
              }}
            >
              Start practice quiz
            </button>
          </div>
        ) : null}
      </section>
    </main>
  );
}
