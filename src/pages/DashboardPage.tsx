import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CourseCard } from '../components/CourseCard';
import { FadeIn } from '../components/FadeIn';
import { categories, courses } from '../data/mockData';
import { useAppContext } from '../context/useAppContext';

export function DashboardPage() {
  const navigate = useNavigate();
  const { user, setSelectedCourse, notify } = useAppContext();

  const topCourses = useMemo(() => courses.slice(0, 1), []);
  const recommended = useMemo(() => courses.slice(0, 1), []);

  return (
    <main className="section section--dashboard">
      <div className="container">
        <FadeIn>
          <div className="section-heading">
            <div>
              <p className="eyebrow">Welcome back, ready for your next lesson?</p>
              <h1>{user ? `${user.name}'s dashboard` : 'Dashboard overview'}</h1>
            </div>
            <div className="dash-top-actions">
              <button className="btn btn--ghost" onClick={() => navigate('/practice')}>
                Practice mode
              </button>
              <button className="btn btn--solid" onClick={() => navigate('/diagnostic')}>
                Diagnostic test
              </button>
            </div>
          </div>
        </FadeIn>

        <div className="course-grid">
          {topCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              primaryLabel="Open Bootcamp"
              onPrimaryAction={(selected) => {
                setSelectedCourse(selected);
                notify(`Opening ${selected.title}`, 'success');
                navigate(`/courses/${selected.id}`);
              }}
            />
          ))}
        </div>

        <section className="dash-block">
          <div className="section-heading">
            <h2>Choose favorite course from top category</h2>
          </div>
          <div className="category-grid">
            {categories.slice(1).map((category, index) => (
              <FadeIn key={category} delay={index * 0.05} className="category-card">
                <strong>{category}</strong>
                <p>Targeted SAT drills and concept labs</p>
              </FadeIn>
            ))}
          </div>
        </section>

        <section className="dash-block">
          <div className="section-heading">
            <h2>Recommended for you</h2>
            <button className="btn btn--ghost" onClick={() => navigate('/courses')}>
              See all
            </button>
          </div>
          <div className="course-grid course-grid--four">
            {recommended.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                primaryLabel="Open Bootcamp"
                onPrimaryAction={(selected) => {
                  setSelectedCourse(selected);
                  notify(`Opening ${selected.title}`, 'success');
                  navigate(`/courses/${selected.id}`);
                }}
              />
            ))}
          </div>
        </section>

        <section className="callout-banner">
          <div>
            <h2>Online coaching lessons for remote learning</h2>
            <p>
              Book a 1:1 strategy review session to break plateaus and tighten your pacing.
            </p>
          </div>
          <button className="btn btn--solid" onClick={() => navigate('/contact')}>
            Start coaching now
          </button>
        </section>
      </div>
    </main>
  );
}
