import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FadeIn } from '../components/FadeIn';
import { faqItems } from '../data/mockData';
import { useAppContext } from '../context/useAppContext';

const includedFeatures = [
  'Adaptive practice that targets your weakest skills',
  'A full diagnostic test across every SAT Math domain',
  'Concept-level mastery tracking and analytics',
  'Guided lessons and timed strategy training',
];

export function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const navigate = useNavigate();
  const { notify } = useAppContext();

  return (
    <main>
      <section className="section" id="faq">
        <div className="container">
          <FadeIn>
            <p className="eyebrow">Pricing</p>
            <h1>Math800 is free — for everyone, always.</h1>
            <p>
              There is no paywall, no trial, and no subscription. Every feature is open to every
              student at no cost.
            </p>
          </FadeIn>

          <div className="pricing-grid">
            <FadeIn className="pricing-card pricing-card--featured">
              <p>Everything Math800 offers</p>
              <h3>Full Access</h3>
              <p className="price-text">
                Free <span>/ forever</span>
              </p>
              <ul>
                {includedFeatures.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <button
                className="btn btn--solid"
                onClick={() => {
                  notify('Welcome — everything is free. Start whenever you like.', 'success');
                  navigate('/practice');
                }}
              >
                Start learning
              </button>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="section section--muted">
        <div className="container callout-banner">
          <div>
            <h2>Online coaching lessons for remote learning.</h2>
            <p>Adaptive SAT practice and diagnostics are open access at no cost.</p>
          </div>
          <button className="btn btn--solid" onClick={() => navigate('/contact')}>
            Start learning now
          </button>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Frequently asked questions</h2>
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
