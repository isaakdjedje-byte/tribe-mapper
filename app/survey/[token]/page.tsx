import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import Survey1Content from '@/components/Survey1Content';

export default async function SurveyPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  
  return (
    <LanguageProvider>
      <Survey1Content token={token} />
    </LanguageProvider>
  );
}
