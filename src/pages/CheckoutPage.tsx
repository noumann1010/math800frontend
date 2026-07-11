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
          <h1>Beta Access</h1>
          <p className="muted">No payment required right now</p>

          <div className="beta-banner beta-banner--large">
            <strong>Free Temporarily</strong>
            <p>
              Payment and subscriptions are disabled while we are in active beta development.
              You can access learning content for free.
            </p>
          </div>

          <div className="checkout-beta-actions">
            <button
              className="btn btn--solid"
              onClick={() => {
                notify('Beta access activated for this course', 'success');
                navigate('/practice');
              }}
            >
              Continue to Practice
            </button>
            <button className="btn btn--ghost" onClick={() => navigate('/full-test')}>
              Start Full Test
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
              <strong className="beta-chip">Free in Beta</strong>
            </div>
          </div>

          <div className="summary-line">
            <span>Status</span>
            <span>Beta Open</span>
          </div>
          <div className="summary-line">
            <span>Billing</span>
            <span>Temporarily Disabled</span>
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
