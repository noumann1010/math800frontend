import { useNavigate } from 'react-router-dom';
import { courses } from '../data/mockData';
import { useAppContext } from '../context/useAppContext';

export function CheckoutPage() {
  const { selectedCourse, notify } = useAppContext();
  const navigate = useNavigate();

  const course = selectedCourse ?? courses[0];

  return (
    <main className="section">
      <div className="container checkout-grid">
        <section className="checkout-card">
          <h1>Get Started</h1>
          <p className="muted">No payment required — ever</p>

          <div className="beta-banner beta-banner--large">
            <strong>Free Forever</strong>
            <p>
              Math800 is completely free. There is nothing to pay and nothing to unlock — just jump
              straight into practice or a diagnostic test.
            </p>
          </div>

          <div className="checkout-beta-actions">
            <button
              className="btn btn--solid"
              onClick={() => {
                notify('You are all set — everything is free.', 'success');
                navigate('/practice');
              }}
            >
              Continue to Practice
            </button>
            <button className="btn btn--ghost" onClick={() => navigate('/diagnostic')}>
              Start Diagnostic Test
            </button>
          </div>
        </section>

        <aside className="summary-card">
          <h2>Selected Course</h2>
          <div className="summary-course">
            <img src={course.image} alt={course.title} />
            <div>
              <h3>{course.title}</h3>
              <p>{course.description.slice(0, 90)}...</p>
              <strong className="beta-chip">Free</strong>
            </div>
          </div>

          <div className="summary-line">
            <span>Status</span>
            <span>Open</span>
          </div>
          <div className="summary-line">
            <span>Billing</span>
            <span>None</span>
          </div>
          <div className="summary-line summary-line--total">
            <span>Amount Due</span>
            <span>$0.00</span>
          </div>
        </aside>
      </div>
    </main>
  );
}
