import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import Survey2Content from '@/components/Survey2Content';

export default async function Survey2Page({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  
  return (
    <LanguageProvider>
      <Survey2Content token={token} />
    </LanguageProvider>
  );
}
