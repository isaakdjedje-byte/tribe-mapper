import Link from 'next/link';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import LandingContent from '@/components/LandingContent';

export default function Home() {
  return (
    <LanguageProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header style={{ 
          padding: 'var(--space-4)', 
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <LanguageSwitcher />
        </header>
        <main style={{ flex: 1 }}>
          <LandingContent />
        </main>
      </div>
    </LanguageProvider>
  );
}
