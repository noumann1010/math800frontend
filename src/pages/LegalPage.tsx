import { useLocation } from 'react-router-dom';

export function LegalPage() {
  const location = useLocation();
  const slug = location.pathname.replace('/', '');

  const titleMap: Record<string, string> = {
    careers: 'Careers',
    privacy: 'Privacy Policy',
    terms: 'Terms & Conditions',
  };

  const title = titleMap[slug] ?? 'Information';

  return (
    <main className="section">
      <div className="container empty-state">
        <h1>{title}</h1>
        <p>
          This page is ready for backend content injection. Replace this placeholder with CMS or
          API-driven legal/careers content.
        </p>
      </div>
    </main>
  );
}
