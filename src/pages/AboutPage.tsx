import { FadeIn } from '../components/FadeIn';
import { useNavigate } from 'react-router-dom';

const benefits = [
  {
    id: '01',
    title: 'Personalized Practice',
    text: 'Adaptive drills focus on the exact concepts and question types you miss most.',
  },
  {
    id: '02',
    title: 'Faster Score Improvement',
    text: 'Less wasted study time by prioritizing high-yield SAT patterns and targeted reviews.',
  },
  {
    id: '03',
    title: 'Smart Diagnostics',
    text: 'AI identifies not only incorrect answers but timing bottlenecks and confidence gaps.',
  },
  {
    id: '04',
    title: 'Affordable Preparation',
    text: 'A structured program that is more cost-effective than repetitive private sessions.',
  },
  {
    id: '05',
    title: 'Progress Tracking',
    text: 'Visual analytics display concept mastery, pace consistency, and score trajectory.',
  },
  {
    id: '06',
    title: 'Practice Anywhere',
    text: 'Use lessons and quizzes across devices for short daily sessions and weekly sprints.',
  },
];

export function AboutPage() {
  const navigate = useNavigate();

  return (
    <main className="section">
      <div className="container">
        <div className="split-grid split-grid--offset">
          <FadeIn>
            <p className="eyebrow">About Us</p>
            <h1>Math800 helps you achieve your SAT Math goal strategically.</h1>
            <p>
              Math800 turns student performance into a practical daily plan. You get precise
              diagnostics, clear explanations, and measurable progress from week one.
            </p>
            <button className="btn btn--solid" onClick={() => navigate('/auth')}>
              Take a Demo Diagnostic
            </button>
          </FadeIn>

          <FadeIn delay={0.1} className="image-stack">
            <img
              src="https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1200&q=80"
              alt="Students learning in a classroom"
            />
          </FadeIn>
        </div>

        <div className="split-grid section--inner">
          <FadeIn>
            <img
              className="rounded-image"
              src="https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=80"
              alt="Tutoring session focused on math preparation"
            />
          </FadeIn>

          <FadeIn delay={0.12}>
            <p className="eyebrow">Features</p>
            <h2>Everything you need to improve your SAT Math score.</h2>
            <p>
              Machine-learning diagnostics and guided practice produce a simple improvement path:
              identify weakness, master it quickly, and re-test under timing pressure.
            </p>
            <button className="btn btn--ghost" onClick={() => navigate('/courses')}>
              Learn More
            </button>
          </FadeIn>
        </div>

        <div className="section-heading section-heading--center about-benefits-heading">
          <div>
            <p className="eyebrow">Our Benefits</p>
            <h2>Why Students Choose Math800</h2>
            <p>
              Designed for measurable score growth with adaptive practice, targeted lessons,
              and detailed performance analytics.
            </p>
          </div>
        </div>

        <div className="benefit-grid">
          {benefits.map((benefit) => (
            <FadeIn key={benefit.id} className="benefit-card">
              <strong>{benefit.id}</strong>
              <h3>{benefit.title}</h3>
              <p>{benefit.text}</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </main>
  );
}
