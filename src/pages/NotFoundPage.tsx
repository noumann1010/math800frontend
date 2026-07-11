import { useNavigate } from 'react-router-dom';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <main className="section">
      <div className="container empty-state">
        <h1>404</h1>
        <p>The page you requested does not exist.</p>
        <button className="btn btn--solid" onClick={() => navigate('/')}>
          Return home
        </button>
      </div>
    </main>
  );
}
