import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useAppContext } from '../context/useAppContext';

export function Footer() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { notify } = useAppContext();

  const handleSubscribe = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim()) {
      notify('Enter an email address first', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const response = await api.subscribeNewsletter({ email: email.trim() });
      notify(response.message, 'success');
      setEmail('');
    } catch (error) {
      notify((error as Error).message || 'Subscription failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="site-footer">
      <div className="container footer-content">
        <div className="footer-brand-row">
          <div className="brand brand--light">
            <span className="brand__diamond" />
            Math800
          </div>
          <span>Your Journey to an 800</span>
        </div>

        <form className="newsletter" onSubmit={handleSubscribe}>
          <label htmlFor="newsletter-email">Subscribe to get our Newsletter</label>
          <div>
            <input
              id="newsletter-email"
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <button className="btn btn--solid" type="submit" disabled={submitting}>
              {submitting ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>
        </form>

        <div className="footer-links">
          <Link to="/careers">Careers</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms & Conditions</Link>
        </div>

        <p className="footer-copy">© 2026 Nouman LLC.</p>
      </div>
    </footer>
  );
}
