import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CourseCard } from '../components/CourseCard';
import { FadeIn } from '../components/FadeIn';
import { courses, featureCards, heroStats, testimonials } from '../data/mockData';
import { useAppContext } from '../context/useAppContext';

export function HomePage() {
  const navigate = useNavigate();
  const { setSelectedCourse, notify } = useAppContext();

  return (
    <main>
      <section className="hero">
        <div className="container hero__content">
          <div>
            <FadeIn>
              <p className="eyebrow">Advance your potential</p>
              <h1>Master SAT Math with adaptive tutoring that targets your exact gaps.</h1>
              <p>
                Welcome to Math800, the SAT tutoring platform designed to help students
                reach top scores through machine-learning diagnostics and strategic practice.
              </p>
              <div className="hero__actions">
                <button className="btn btn--solid" onClick={() => navigate('/auth')}>
                  Get Started
                </button>
                <button className="btn btn--ghost" onClick={() => navigate('/pricing')}>
                  Free During Beta
                </button>
              </div>
            </FadeIn>
          </div>

          <motion.div
            className="hero__visual"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1400&q=80"
              alt="Student preparing for SAT math"
            />
          </motion.div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container stats-grid">
          {heroStats.map((item, index) => (
            <FadeIn key={item.label} delay={index * 0.07} className="stat-card">
              <strong>{item.value}</strong>
              <p>{item.label}</p>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <FadeIn>
            <p className="eyebrow">SAT Tutoring Features</p>
            <h2>Everything you need to improve your SAT Math score.</h2>
          </FadeIn>

          <div className="feature-grid">
            {featureCards.map((feature, index) => (
              <FadeIn key={feature.title} delay={index * 0.1} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <button className="text-link" onClick={() => navigate('/about')}>
                  Learn More
                </button>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--muted">
        <div className="container split-grid">
          <FadeIn>
            <p className="eyebrow">Why Math800</p>
            <h2>A user interface designed for student focus and measurable growth.</h2>
            <p>
              The experience mirrors your design direction: clean cards, soft color blocks,
              rounded surfaces, and clear action hierarchy for fast navigation.
            </p>
            <button className="btn btn--solid" onClick={() => navigate('/dashboard')}>
              See Dashboard Preview
            </button>
          </FadeIn>

          <FadeIn delay={0.15}>
            <img
              className="rounded-image"
              src="https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=80"
              alt="Students collaborating"
            />
          </FadeIn>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Recommended for you</p>
              <h2>Popular SAT Math courses</h2>
            </div>
            <button className="btn btn--ghost" onClick={() => navigate('/courses')}>
              View all courses
            </button>
          </div>

          <div className="course-grid">
            {courses.slice(0, 3).map((course, index) => (
              <FadeIn key={course.id} delay={index * 0.08}>
                <CourseCard
                  course={course}
                  primaryLabel="Open Lessons"
                  onPrimaryAction={(selected) => {
                    setSelectedCourse(selected);
                    notify(`Opening ${selected.title}`, 'success');
                    navigate(`/courses/${selected.id}`);
                  }}
                />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--muted">
        <div className="container">
          <FadeIn>
            <p className="eyebrow">Student Voices</p>
            <h2>What our students have to say</h2>
          </FadeIn>

          <div className="testimonial-grid">
            {testimonials.map((testimonial, index) => (
              <FadeIn key={testimonial.id} delay={index * 0.1} className="testimonial-card">
                <img src={testimonial.avatar} alt={testimonial.name} />
                <h3>{testimonial.name}</h3>
                <p className="testimonial-role">{testimonial.role}</p>
                <p>{testimonial.quote}</p>
                <div className="stars">{'★'.repeat(testimonial.score)}</div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
