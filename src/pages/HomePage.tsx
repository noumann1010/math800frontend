import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FadeIn } from '../components/FadeIn';
import { featureCards, PRIMARY_COURSE_ID } from '../data/mockData';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <main>
      <section className="hero">
        <div className="container hero__content">
          <div>
            <FadeIn>
              <p className="eyebrow">Advance your potential · Always free</p>
              <h1>Master SAT Math with adaptive tutoring that targets your exact gaps.</h1>
              <p>
                Welcome to Math800, the SAT tutoring platform designed to help students
                reach top scores through machine-learning diagnostics and strategic practice.
                It is completely free — no fees, ever.
              </p>
              <div className="hero__actions">
                <button className="btn btn--solid" onClick={() => navigate('/auth')}>
                  Get Started
                </button>
                <button
                  className="btn btn--ghost"
                  onClick={() => navigate(`/courses/${PRIMARY_COURSE_ID}`)}
                >
                  Explore Lessons
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
    </main>
  );
}
