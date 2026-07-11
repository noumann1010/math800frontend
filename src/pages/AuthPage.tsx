import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/useAppContext';
import { registerWithFirebaseEmail, signInWithFirebaseEmail } from '../lib/firebase';
import type { User } from '../types';

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, message: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = window.setTimeout(() => {
      reject(new Error(message));
    }, timeoutMs);

    promise
      .then((result) => {
        window.clearTimeout(timer);
        resolve(result);
      })
      .catch((error) => {
        window.clearTimeout(timer);
        reject(error);
      });
  });
}

export function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { notify, setFirebaseIdToken, setUser } = useAppContext();

  const buildUserFromFirebase = (
    uid: string,
    emailValue: string,
    displayName?: string | null,
  ): User => ({
    id: uid,
    name: displayName?.trim() || emailValue.split('@')[0] || 'Student',
    email: emailValue,
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      notify('Email and password are required', 'error');
      return;
    }

    if (mode === 'register' && !fullName.trim()) {
      notify('Full name is required for registration', 'error');
      return;
    }

    try {
      setLoading(true);

      const firebaseUser =
        mode === 'login'
          ? await withTimeout(
              signInWithFirebaseEmail(email.trim(), password.trim()),
              15000,
              'Sign in timed out. Check your network and Firebase config, then try again.',
            )
          : await withTimeout(
              registerWithFirebaseEmail(email.trim(), password.trim(), fullName.trim()),
              15000,
              'Account creation timed out. Check your network and Firebase config, then try again.',
            );

      const firebaseIdToken = await withTimeout(
        firebaseUser.getIdToken(),
        10000,
        'Could not get Firebase auth token. Please try again.',
      );
      setFirebaseIdToken(firebaseIdToken);
      setUser(
        buildUserFromFirebase(
          firebaseUser.uid,
          firebaseUser.email ?? email.trim(),
          firebaseUser.displayName,
        ),
      );

      notify(mode === 'login' ? 'Signed in successfully' : 'Account created successfully', 'success');
      navigate('/dashboard');
    } catch (error) {
      notify((error as Error).message || 'Authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-layout">
      <section className="auth-media">
        <img
          src="https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1800&q=80"
          alt="Student in classroom"
        />
      </section>

      <section className="auth-panel">
        <p className="eyebrow">Welcome to Math800!</p>

        <div className="toggle-pill" role="tablist" aria-label="Authentication mode">
          <button
            className={mode === 'login' ? 'is-active' : ''}
            onClick={() => setMode('login')}
            role="tab"
          >
            Login
          </button>
          <button
            className={mode === 'register' ? 'is-active' : ''}
            onClick={() => setMode('register')}
            role="tab"
          >
            Register
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'register' ? (
            <label>
              Full Name
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Enter your full name"
              />
            </label>
          ) : null}

          <label>
            Email Address
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
            />
          </label>

          <div className="auth-options">
            <button
              type="button"
              className="text-link"
              onClick={() => notify('Password reset can be enabled from Firebase Auth settings.', 'info')}
            >
              Forgot Password?
            </button>
          </div>

          <button className="btn btn--solid" type="submit" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}
          </button>
        </form>

        <p className="auth-footnote">Beta access is free temporarily while we validate the product.</p>
      </section>
    </main>
  );
}
