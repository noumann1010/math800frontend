import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FadeIn } from '../components/FadeIn';
import { faqItems, pricingPlans } from '../data/mockData';
import { useAppContext } from '../context/useAppContext';

export function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const navigate = useNavigate();
  const { notify } = useAppContext();

  return (
    <main>
      <section className="section" id="faq">
        <div className="container">
          <FadeIn>
            <p className="eyebrow">Beta Access</p>
            <h1>All learning plans are temporarily free</h1>
          </FadeIn>

          <div className="pricing-grid">
            {pricingPlans.map((plan, index) => (
              <FadeIn
                key={plan.id}
                delay={index * 0.08}
                className={plan.featured ? 'pricing-card pricing-card--featured' : 'pricing-card'}
              >
                <p>{plan.description}</p>
                <h3>{plan.name}</h3>
                <p className="price-text">
                  Free <span>/ Beta</span>
                </p>
                <ul>
                  {plan.perks.map((perk) => (
                    <li key={perk}>{perk}</li>
                  ))}
                </ul>
                <button
                  className={plan.featured ? 'btn btn--solid' : 'btn btn--ghost'}
                  onClick={() => {
                    notify(`${plan.name}: free temporarily while in beta`, 'info');
                    navigate('/practice');
                  }}
                >
                  Start Free Beta
                </button>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--muted">
        <div className="container callout-banner">
          <div>
            <h2>Online coaching lessons for remote learning.</h2>
            <p>
              During beta, coaching and adaptive SAT practice are open access at no cost.
            </p>
          </div>
          <button className="btn btn--solid" onClick={() => navigate('/contact')}>
            Start learning now
          </button>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Online coaching lessons for remote learning</h2>
          <div className="faq-list">
            {faqItems.map((faq, index) => {
              const open = openFaq === index;
              return (
                <div key={faq.question} className="faq-item">
                  <button
                    className="faq-trigger"
                    onClick={() => setOpenFaq(open ? null : index)}
                    aria-expanded={open}
                  >
                    <span>{faq.question}</span>
                    <span>{open ? '-' : '+'}</span>
                  </button>
                  {open ? <p>{faq.answer}</p> : null}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
