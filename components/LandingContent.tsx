'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function LandingContent() {
  const { t } = useLanguage();

  return (
    <div className="container" style={{ maxWidth: 560, paddingTop: 'var(--space-10)' }}>
      <div className="card" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: 'var(--space-3)' }}>{t.landing.title}</h1>
        <p className="text-secondary" style={{ fontSize: '1.0625rem', marginBottom: 'var(--space-6)' }}>
          {t.landing.subtitle}
        </p>
        
        <Link href="/admin" className="btn btn-primary" style={{ display: 'block', width: '100%' }}>
          {t.landing.adminButton}
        </Link>

        <div style={{ marginTop: 'var(--space-8)', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--border)', textAlign: 'left' }}>
          <p className="section-title" style={{ marginBottom: 'var(--space-3)' }}>{t.landing.whatMaps}</p>
          <ul style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.7, paddingLeft: '1.25rem' }}>
            <li>{t.landing.features.trust}</li>
            <li>{t.landing.features.decision}</li>
            <li>{t.landing.features.connectors}</li>
            <li>{t.landing.features.clusters}</li>
            <li>{t.landing.features.tension}</li>
            <li>{t.landing.features.values}</li>
          </ul>
        </div>
      </div>
      
      <p className="text-muted" style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: '0.8125rem' }}>
        {t.landing.surveyLinkHint}
      </p>
    </div>
  );
}
