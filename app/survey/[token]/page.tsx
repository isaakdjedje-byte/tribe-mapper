import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import Survey1Content from '@/components/Survey1Content';
import { SurveyContext } from '@/lib/survey/context';

export default async function SurveyPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ token: string }>;
  searchParams: Promise<{ context?: string }>;
}) {
  const { token } = await params;
  const { context } = await searchParams;
  
  // Default to 'tribe' if no context provided
  const surveyContext: SurveyContext = (context as SurveyContext) || 'tribe';
  
  return (
    <LanguageProvider>
      <Survey1Content token={token} context={surveyContext} />
    </LanguageProvider>
  );
}
