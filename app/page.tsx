import Link from 'next/link';

export default function Home() {
  return (
    <div className="container">
      <div className="card text-center" style={{ maxWidth: 600, margin: '4rem auto', padding: '3rem' }}>
        <h1>TribeMapper</h1>
        <p className="text-muted mt-2" style={{ fontSize: '1.125rem' }}>
          Understand your community's dynamics
        </p>
        
        <div className="grid gap-3 mt-4" style={{ marginTop: '2rem' }}>
          <Link href="/admin" className="btn btn-primary" style={{ justifyContent: 'center' }}>
            Admin Dashboard
          </Link>
          
          <p className="text-sm text-muted">
            Have a survey link? The survey will direct you to the right place.
          </p>
        </div>

        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--color-border)' }}>
          <p className="text-sm text-muted">
            TribeMapper helps you map:
          </p>
          <ul style={{ textAlign: 'left', marginTop: '1rem', paddingLeft: '1.5rem' }} className="text-sm">
            <li>Who trusts whom</li>
            <li>How decisions get made</li>
            <li>Who the key connectors are</li>
            <li>Hidden subgroups</li>
            <li>Potential tension points</li>
            <li>Group values and language</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
