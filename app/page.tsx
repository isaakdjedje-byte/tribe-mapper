import Link from 'next/link';

export default function Home() {
  return (
    <div className="container" style={{ maxWidth: 560, paddingTop: 'var(--space-10)' }}>
      <div className="card" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: 'var(--space-3)' }}>TribeMapper</h1>
        <p className="text-secondary" style={{ fontSize: '1.0625rem', marginBottom: 'var(--space-6)' }}>
          Understand how your community works
        </p>
        
        <Link href="/admin" className="btn btn-primary" style={{ display: 'block', width: '100%' }}>
          Admin Dashboard
        </Link>

        <div style={{ marginTop: 'var(--space-8)', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--border)', textAlign: 'left' }}>
          <p className="section-title" style={{ marginBottom: 'var(--space-3)' }}>What TribeMapper Maps</p>
          <ul style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.7, paddingLeft: '1.25rem' }}>
            <li>Trust and influence patterns</li>
            <li>Decision-making dynamics</li>
            <li>Key connectors and bridges</li>
            <li>Sub-groups and clusters</li>
            <li>Potential tension points</li>
            <li>Shared values and language</li>
          </ul>
        </div>
      </div>
      
      <p className="text-muted" style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: '0.8125rem' }}>
        Have a survey link? It will direct you to the right place.
      </p>
    </div>
  );
}
