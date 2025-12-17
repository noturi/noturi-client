import { Redirect } from 'expo-router';

import { useAuth } from '../src/application/providers/auth-provider';
import { HREFS } from '../src/shared/config';
import { Loading } from '~/shared/ui';

export default function IndexPage() {
  const { isAuthenticated, isInitialLoading } = useAuth();

  if (isInitialLoading) {
    return <Loading />;
  }

  return <Redirect href={isAuthenticated ? HREFS.tabs() : HREFS.login()} />;
}
