import { Redirect } from 'expo-router';

import { Loading } from '@/components/ui';
import { useAuth } from '@/context/auth';
import { ROUTES } from '@/constants/routes';

export default function IndexPage() {
  const { isAuthenticated, isInitialLoading } = useAuth();

  if (isInitialLoading) {
    return <Loading />;
  }

  return <Redirect href={isAuthenticated ? ROUTES.home.href : ROUTES.login.href} />;
}
