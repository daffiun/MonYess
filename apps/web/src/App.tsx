import { AuthProvider } from '@/contexts/AuthContext';
import { AppRoutes } from '@/app/routes/AppRoutes';

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
