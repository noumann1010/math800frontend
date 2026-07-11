import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/useAppContext';
import { signOutFromFirebase } from '../lib/firebase';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Courses', to: '/courses' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact Us', to: '/contact' },
  { label: 'FAQ', to: '/pricing#faq' },
];

export function Navbar() {
  const [query, setQuery] = useState('');
  const { user, setFirebaseIdToken, setUser, notify } = useAppContext();
  const navigate = useNavigate();

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (!query.trim()) {
      notify('Type a topic to explore courses', 'info');
      return;
    }

    navigate(`/courses?query=${encodeURIComponent(query.trim())}`);
  };

  const handleAuthAction = async () => {
    if (user) {
      try {
        await signOutFromFirebase();
      } catch {
        // fallback to local signout even if Firebase signout fails
      } finally {
        setUser(null);
        setFirebaseIdToken(null);
        notify('Signed out successfully', 'success');
        navigate('/');
      }
      return;
    }

    navigate('/auth');
  };

  return (
    <header className="site-header">
      <div className="container nav-shell">
        <div className="nav-left">
          <Link className="brand" to="/">
            <span className="brand__diamond" />
            Math800
          </Link>

          <form className="explore-search" onSubmit={handleSearch}>
            <input
              type="search"
              placeholder="Want to learn?"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <button type="submit">Explore</button>
          </form>
        </div>

        <div className="nav-right">
          <nav className="site-nav">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => (isActive ? 'is-active' : '')}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="nav-actions">
            <button className="btn btn--ghost" onClick={() => navigate('/dashboard')}>
              Dashboard
            </button>
            <button className="btn btn--solid" onClick={handleAuthAction}>
              {user ? 'Sign out' : 'Sign in'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
