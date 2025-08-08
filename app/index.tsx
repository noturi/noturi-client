import { Redirect } from 'expo-router';

import { Loading } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/context/auth';

export default function IndexPage() {
  const { isAuthenticated, isInitialLoading } = useAuth();

  if (isInitialLoading) {
    return <Loading />;
  }

  return <Redirect href={isAuthenticated ? '/home' : ROUTES.login.href} />;
}
