import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FadeIn } from '../components/FadeIn';
import { useAppContext } from '../context/useAppContext';
import { api } from '../lib/api';

export function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { notify } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      notify('Please fill out all fields', 'error');
      return;
    }

    try {
      setLoading(true);
      const response = await api.submitContact({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });
      notify(response.message, 'success');
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      notify((error as Error).message || 'Message not sent', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="section section--muted">
      <div className="container">
        <FadeIn>
          <p className="eyebrow">Contact us</p>
          <h1>Talk to our SAT tutoring team</h1>
          <p>
            Have partnership, school, or coaching questions? Send us a message and we will reply
            with next steps.
          </p>
        </FadeIn>

        <form className="contact-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label>
            Email
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label>
            Message
            <textarea rows={5} value={message} onChange={(event) => setMessage(event.target.value)} />
          </label>
          <div className="contact-actions">
            <button className="btn btn--solid" type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send message'}
            </button>
            <button className="btn btn--ghost" type="button" onClick={() => navigate('/courses')}>
              Explore courses
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
