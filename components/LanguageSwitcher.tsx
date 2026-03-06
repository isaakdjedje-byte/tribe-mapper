'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="language-switcher" style={{ 
      display: 'flex', 
      gap: 'var(--space-2)', 
      alignItems: 'center',
      fontSize: '0.8125rem'
    }}>
      <span style={{ color: 'var(--text-muted)' }}>{t.language.label}:</span>
      <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
        {(['en', 'fr'] as const).map((lang) => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            style={{
              padding: 'var(--space-1) var(--space-2)',
              border: language === lang ? '1px solid var(--primary)' : '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              background: language === lang ? 'var(--primary-subtle)' : 'transparent',
              color: language === lang ? 'var(--primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: language === lang ? 600 : 400,
              transition: 'all 120ms ease'
            }}
          >
            {t.language[lang]}
          </button>
        ))}
      </div>
    </div>
  );
}
