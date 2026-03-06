import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import AdminDashboardClient from '@/components/AdminDashboardClient';

export default function AdminDashboard() {
  return (
    <LanguageProvider>
      <AdminDashboardClient />
    </LanguageProvider>
  );
}
